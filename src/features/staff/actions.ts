"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSpaContext } from "@/lib/supabase/spa";
import {
  staffSchema,
  toggleStaffStatusSchema,
  updateStaffSchema,
  type StaffFormValues,
  type ToggleStaffStatusValues,
  type UpdateStaffValues,
} from "@/features/staff/schemas";
import type { StaffRow } from "@/features/staff/types";
import type { ActionResult } from "@/types/common";

const SERVICES_PATH = "/dashboard/services";

/** Fetch all staff members belonging to the current Spa. */
export async function getStaff(): Promise<ActionResult<StaffRow[]>> {
  try {
    const context = await getCurrentSpaContext();
    if (context.error || !context.data) {
      return { success: false, error: context.error ?? "Chưa xác thực Spa." };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .eq("spa_id", context.data.spaId)
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, error: "Không thể tải danh sách nhân viên." };
    }

    return { success: true, data: data ?? [] };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi hệ thống khi tải nhân viên.";
    return { success: false, error: message };
  }
}

/** Create a new Spa staff member. */
export async function createStaff(
  rawInput: StaffFormValues
): Promise<ActionResult<StaffRow>> {
  const parsed = staffSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dữ liệu nhân viên không hợp lệ.",
    };
  }

  try {
    const context = await getCurrentSpaContext();
    if (context.error || !context.data) {
      return { success: false, error: context.error ?? "Chưa xác thực Spa." };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("staff")
      .insert({
        spa_id: context.data.spaId,
        full_name: parsed.data.full_name,
        phone: parsed.data.phone || null,
        role: parsed.data.role,
      })
      .select("*")
      .single();

    if (error || !data) {
      return { success: false, error: "Không thể thêm nhân viên mới." };
    }

    revalidatePath(SERVICES_PATH);
    return { success: true, data };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi hệ thống khi thêm nhân viên.";
    return { success: false, error: message };
  }
}

/** Update an existing Spa staff member. */
export async function updateStaff(
  rawInput: UpdateStaffValues
): Promise<ActionResult<StaffRow>> {
  const parsed = updateStaffSchema.safeParse(rawInput);
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
      .from("staff")
      .update({
        full_name: parsed.data.full_name,
        phone: parsed.data.phone || null,
        role: parsed.data.role,
      })
      .eq("id", parsed.data.id)
      .eq("spa_id", context.data.spaId)
      .select("*")
      .single();

    if (error || !data) {
      return { success: false, error: "Không thể cập nhật thông tin nhân viên." };
    }

    revalidatePath(SERVICES_PATH);
    return { success: true, data };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi hệ thống khi cập nhật nhân viên.";
    return { success: false, error: message };
  }
}

/** Toggle active/inactive working status of a staff member. */
export async function toggleStaffStatus(
  rawInput: ToggleStaffStatusValues
): Promise<ActionResult<StaffRow>> {
  const parsed = toggleStaffStatusSchema.safeParse(rawInput);
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
      .from("staff")
      .update({ is_active: parsed.data.is_active })
      .eq("id", parsed.data.id)
      .eq("spa_id", context.data.spaId)
      .select("*")
      .single();

    if (error || !data) {
      return { success: false, error: "Không thể đổi trạng thái nhân viên." };
    }

    revalidatePath(SERVICES_PATH);
    return { success: true, data };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi hệ thống khi đổi trạng thái.";
    return { success: false, error: message };
  }
}
