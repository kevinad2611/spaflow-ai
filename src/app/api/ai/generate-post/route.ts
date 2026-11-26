import { NextResponse } from "next/server";
import { generatePostSchema } from "@/features/ai-studio/schemas";
import { generateSpaMarketingContent } from "@/lib/integrations/gemini";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSpaContext } from "@/lib/supabase/spa";

export async function POST(request: Request) {
  try {
    const context = await getCurrentSpaContext();
    if (context.error || !context.data) {
      return NextResponse.json(
        { success: false, error: context.error ?? "Unauthorized" },
        { status: 401 }
      );
    }

    const body: unknown = await request.json();
    const parsed = generatePostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            parsed.error.issues[0]?.message ?? "Dữ liệu yêu cầu không hợp lệ.",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const [spaRes, serviceRes] = await Promise.all([
      supabase
        .from("spas")
        .select("name, phone")
        .eq("id", context.data.spaId)
        .single(),
      supabase
        .from("services")
        .select("id, name, category, price, duration_minutes, description")
        .eq("id", parsed.data.serviceId)
        .eq("spa_id", context.data.spaId)
        .single(),
    ]);

    if (serviceRes.error || !serviceRes.data) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy dịch vụ được chọn." },
        { status: 404 }
      );
    }

    const aiResult = await generateSpaMarketingContent({
      spaName: spaRes.data?.name ?? context.data.spaName,
      spaPhone: spaRes.data?.phone ?? "",
      service: serviceRes.data,
      platform: parsed.data.platform,
      tone: parsed.data.tone,
      promoKeyword: parsed.data.promoKeyword,
    });

    if (!aiResult.success || !aiResult.data) {
      return NextResponse.json(
        { success: false, error: aiResult.error ?? "AI tạo bài thất bại." },
        { status: 500 }
      );
    }

    const { data: savedContent, error: saveError } = await supabase
      .from("ai_contents")
      .insert({
        spa_id: context.data.spaId,
        service_id: serviceRes.data.id,
        platform: parsed.data.platform,
        title: aiResult.data.title,
        content: aiResult.data.content,
        video_script: aiResult.data.videoScript || null,
      })
      .select("*")
      .single();

    if (saveError || !savedContent) {
      return NextResponse.json(
        { success: false, error: "Đã tạo bài nhưng không thể lưu lịch sử." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        saved: savedContent,
        voiceoverScript: aiResult.data.voiceoverScript,
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi hệ thống khi tạo nội dung AI.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
