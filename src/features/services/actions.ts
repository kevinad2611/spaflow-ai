"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSpaContext } from "@/lib/supabase/spa";
import {
  serviceSchema,
  toggleServiceStatusSchema,
  updateServiceSchema,
  type ServiceFormValues,
  type ToggleServiceStatusValues,
  type UpdateServiceValues,
} from "@/features/services/schemas";
import type { ServiceRow } from "@/features/services/types";
import type { ActionResult } from "@/types/common";

const SERVICES_PATH = "/dashboard/services";

/** Fetch all services belonging to the current Spa. */
export async function getServices(): Promise<ActionResult<ServiceRow[]>> {
  try {
    const context = await getCurrentSpaContext();
    if (context.error || !context.data) {
      return { success: false, error: context.error ?? "Chưa xác thực Spa." };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("spa_id", context.data.spaId)
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, error: "Không thể tải danh sách dịch vụ." };
    }

    return { success: true, data: data ?? [] };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi hệ thống khi tải dịch vụ.";
    return { success: false, error: message };
  }
}

/** Create a new Spa service. */
export async function createService(
  rawInput: ServiceFormValues
): Promise<ActionResult<ServiceRow>> {
  const parsed = serviceSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dữ liệu dịch vụ không hợp lệ.",
    };
  }

  try {
    const context = await getCurrentSpaContext();
    if (context.error || !context.data) {
      return { success: false, error: context.error ?? "Chưa xác thực Spa." };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services")
      .insert({
        spa_id: context.data.spaId,
        name: parsed.data.name,
        category: parsed.data.category,
        price: Math.round(parsed.data.price),
        duration_minutes: parsed.data.duration_minutes,
        description: parsed.data.description || null,
      })
      .select("*")
      .single();

    if (error || !data) {
      return { success: false, error: "Không thể thêm dịch vụ mới." };
    }

    revalidatePath(SERVICES_PATH);
    return { success: true, data };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi hệ thống khi thêm dịch vụ.";
    return { success: false, error: message };
  }
}

/** Update an existing Spa service. */
export async function updateService(
  rawInput: UpdateServiceValues
): Promise<ActionResult<ServiceRow>> {
  const parsed = updateServiceSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dữ liệu cập nhật không hợp lệ.",
    };
  }

  try {
    const context = await getCurrentSpaContext();
    if (context.error || !context.data) {
      return { success: false, error: context.error ?? "Chưa xác thực Spa." };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services")
      .update({
        name: parsed.data.name,
        category: parsed.data.category,
        price: Math.round(parsed.data.price),
        duration_minutes: parsed.data.duration_minutes,
        description: parsed.data.description || null,
      })
      .eq("id", parsed.data.id)
      .eq("spa_id", context.data.spaId)
      .select("*")
      .single();

    if (error || !data) {
      return { success: false, error: "Không thể cập nhật thông tin dịch vụ." };
    }

    revalidatePath(SERVICES_PATH);
    return { success: true, data };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi hệ thống khi cập nhật dịch vụ.";
    return { success: false, error: message };
  }
}

/** Toggle active/paused status of a Spa service. */
export async function toggleServiceStatus(
  rawInput: ToggleServiceStatusValues
): Promise<ActionResult<ServiceRow>> {
  const parsed = toggleServiceStatusSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Trạng thái không hợp lệ.",
    };
  }

  try {
    const context = await getCurrentSpaContext();
    if (context.error || !context.data) {
      return { success: false, error: context.error ?? "Chưa xác thực Spa." };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services")
      .update({ is_active: parsed.data.is_active })
      .eq("id", parsed.data.id)
      .eq("spa_id", context.data.spaId)
      .select("*")
      .single();

    if (error || !data) {
      return { success: false, error: "Không thể đổi trạng thái dịch vụ." };
    }

    revalidatePath(SERVICES_PATH);
    return { success: true, data };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi hệ thống khi đổi trạng thái.";
    return { success: false, error: message };
  }
}
