"use server";

import { revalidatePath } from "next/cache";
import {
  deleteAiContentSchema,
  type DeleteAiContentInput,
} from "@/features/ai-studio/schemas";
import type {
  AiContentRow,
  AiServiceOption,
} from "@/features/ai-studio/types";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSpaContext } from "@/lib/supabase/spa";
import type { ActionResult } from "@/types/common";

const AI_STUDIO_PATH = "/dashboard/ai-studio";

/** Load active Spa services and saved AI marketing contents. */
export async function getAiStudioPageData(): Promise<
  ActionResult<{ services: AiServiceOption[]; contents: AiContentRow[] }>
> {
  try {
    const context = await getCurrentSpaContext();
    if (context.error || !context.data) {
      return { success: false, error: context.error ?? "Chưa xác thực Spa." };
    }

    const supabase = await createClient();
    const [servicesRes, contentsRes] = await Promise.all([
      supabase
        .from("services")
        .select("id, name, category, price, duration_minutes, description")
        .eq("spa_id", context.data.spaId)
        .eq("is_active", true)
        .order("name", { ascending: true }),
      supabase
        .from("ai_contents")
        .select("*")
        .eq("spa_id", context.data.spaId)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    if (servicesRes.error || contentsRes.error) {
      return { success: false, error: "Không thể tải dữ liệu AI Studio." };
    }

    return {
      success: true,
      data: {
        services: servicesRes.data ?? [],
        contents: contentsRes.data ?? [],
      },
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi hệ thống khi tải AI Studio.";
    return { success: false, error: message };
  }
}

/** Delete a saved AI content entry owned by the current Spa. */
export async function deleteAiContentAction(
  rawInput: DeleteAiContentInput
): Promise<ActionResult> {
  const parsed = deleteAiContentSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Mã nội dung không hợp lệ.",
    };
  }

  try {
    const context = await getCurrentSpaContext();
    if (context.error || !context.data) {
      return { success: false, error: context.error ?? "Chưa xác thực Spa." };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("ai_contents")
      .delete()
      .eq("id", parsed.data.id)
      .eq("spa_id", context.data.spaId);

    if (error) {
      return { success: false, error: "Không thể xóa bài viết đã lưu." };
    }

    revalidatePath(AI_STUDIO_PATH);
    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi hệ thống khi xóa nội dung.";
    return { success: false, error: message };
  }
}
