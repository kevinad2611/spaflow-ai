import { NextResponse } from "next/server";
import { generateTtsSchema } from "@/features/ai-studio/schemas";
import { getCurrentSpaContext } from "@/lib/supabase/spa";

interface GoogleTtsResponse {
  audioContent?: string;
  error?: { message?: string };
}

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
    const parsed = generateTtsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            parsed.error.issues[0]?.message ?? "Lời bình không hợp lệ.",
        },
        { status: 400 }
      );
    }

    const ttsApiKey = process.env.GOOGLE_TTS_API_KEY;
    if (!ttsApiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Chưa cấu hình GOOGLE_TTS_API_KEY trong biến môi trường để tạo giọng đọc tiếng Việt.",
        },
        { status: 503 }
      );
    }

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(ttsApiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { text: parsed.data.text },
          voice: {
            languageCode: "vi-VN",
            name: "vi-VN-Wavenet-A",
            ssmlGender: "FEMALE",
          },
          audioConfig: {
            audioEncoding: "MP3",
            speakingRate: 1.0,
          },
        }),
      }
    );

    const json = (await response.json()) as GoogleTtsResponse;
    if (!response.ok || !json.audioContent) {
      return NextResponse.json(
        {
          success: false,
          error:
            json.error?.message ??
            "Không thể tạo file giọng đọc tiếng Việt từ Google TTS.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        audioBase64: json.audioContent,
        mimeType: "audio/mpeg",
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi hệ thống khi tạo giọng đọc.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
