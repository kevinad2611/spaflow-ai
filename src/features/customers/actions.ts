"use server";

import { revalidatePath } from "next/cache";
import {
  customerSchema,
  deleteCustomerSchema,
  updateCustomerSchema,
  type CustomerFormValues,
  type DeleteCustomerValues,
  type UpdateCustomerValues,
} from "@/features/customers/schemas";
import type {
  CustomerAppointmentItem,
  CustomerDetailData,
  CustomerRow,
} from "@/features/customers/types";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSpaContext } from "@/lib/supabase/spa";
import type { ActionResult } from "@/types/common";

const CUSTOMERS_PATH = "/dashboard/customers";

/** Fetch all active (non-deleted) customers of the current Spa. */
export async function getCustomers(
  searchQuery?: string
): Promise<ActionResult<CustomerRow[]>> {
  try {
    const context = await getCurrentSpaContext();
    if (context.error || !context.data) {
      return { success: false, error: context.error ?? "Chưa xác thực Spa." };
    }

    const supabase = await createClient();
    let query = supabase
      .from("customers")
      .select("*")
      .eq("spa_id", context.data.spaId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    const trimmed = searchQuery?.trim();
    if (trimmed) {
      const safeTerm = trimmed.replace(/[%_,]/g, "");
      if (safeTerm) {
        query = query.or(
          `full_name.ilike.%${safeTerm}%,phone.ilike.%${safeTerm}%`
        );
      }
    }

    const { data, error } = await query;
    if (error) {
      return { success: false, error: "Không thể tải danh sách khách hàng." };
    }

    return { success: true, data: data ?? [] };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi hệ thống khi tải khách hàng.";
    return { success: false, error: message };
  }
}

/** Fetch a single customer profile along with their appointments and services. */
export async function getCustomerDetail(
  customerId: string
): Promise<ActionResult<CustomerDetailData>> {
  if (!deleteCustomerSchema.safeParse({ id: customerId }).success) {
    return { success: false, error: "Mã khách hàng không hợp lệ." };
  }

  try {
    const context = await getCurrentSpaContext();
    if (context.error || !context.data) {
      return { success: false, error: context.error ?? "Chưa xác thực Spa." };
    }

    const supabase = await createClient();
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("*")
      .eq("id", customerId)
      .eq("spa_id", context.data.spaId)
      .eq("is_deleted", false)
      .maybeSingle();

    if (customerError || !customer) {
      return { success: false, error: "Không tìm thấy thông tin khách hàng." };
    }

    const { data: appointments, error: apptError } = await supabase
      .from("appointments")
      .select(
        "id, appointment_date, start_time, end_time, status, total_price, notes, staff(full_name), appointment_services(price_at_booking, services(name, duration_minutes))"
      )
      .eq("customer_id", customer.id)
      .eq("spa_id", context.data.spaId)
      .order("appointment_date", { ascending: false })
      .order("start_time", { ascending: false });

    if (apptError) {
      return { success: false, error: "Không thể tải lịch sử dịch vụ khách." };
    }

    return {
      success: true,
      data: {
        customer,
        appointments: (appointments ?? []) as CustomerAppointmentItem[],
      },
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi hệ thống khi tải chi tiết khách.";
    return { success: false, error: message };
  }
}

/** Create a new customer record for the current Spa. */
export async function createCustomer(
  rawInput: CustomerFormValues
): Promise<ActionResult<CustomerRow>> {
  const parsed = customerSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Thông tin khách hàng không hợp lệ.",
    };
  }

  try {
    const context = await getCurrentSpaContext();
    if (context.error || !context.data) {
      return { success: false, error: context.error ?? "Chưa xác thực Spa." };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("customers")
      .insert({
        spa_id: context.data.spaId,
        full_name: parsed.data.full_name,
        phone: parsed.data.phone,
        zalo_phone: parsed.data.zalo_phone || null,
        email: parsed.data.email || null,
        address: parsed.data.address || null,
        notes: parsed.data.notes || null,
      })
      .select("*")
      .single();

    if (error || !data) {
      return { success: false, error: "Không thể thêm khách hàng mới." };
    }

    revalidatePath(CUSTOMERS_PATH);
    return { success: true, data };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi hệ thống khi thêm khách hàng.";
    return { success: false, error: message };
  }
}

/** Update an existing customer record. */
export async function updateCustomer(
  rawInput: UpdateCustomerValues
): Promise<ActionResult<CustomerRow>> {
  const parsed = updateCustomerSchema.safeParse(rawInput);
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
      .from("customers")
      .update({
        full_name: parsed.data.full_name,
        phone: parsed.data.phone,
        zalo_phone: parsed.data.zalo_phone || null,
        email: parsed.data.email || null,
        address: parsed.data.address || null,
        notes: parsed.data.notes || null,
      })
      .eq("id", parsed.data.id)
      .eq("spa_id", context.data.spaId)
      .eq("is_deleted", false)
      .select("*")
      .single();

    if (error || !data) {
      return { success: false, error: "Không thể cập nhật thông tin khách hàng." };
    }

    revalidatePath(CUSTOMERS_PATH);
    revalidatePath(`${CUSTOMERS_PATH}/${parsed.data.id}`);
    return { success: true, data };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi hệ thống khi cập nhật khách hàng.";
    return { success: false, error: message };
  }
}

/** Soft-delete a customer by setting is_deleted = true. */
export async function softDeleteCustomer(
  rawInput: DeleteCustomerValues
): Promise<ActionResult> {
  const parsed = deleteCustomerSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Mã khách hàng không hợp lệ.",
    };
  }

  try {
    const context = await getCurrentSpaContext();
    if (context.error || !context.data) {
      return { success: false, error: context.error ?? "Chưa xác thực Spa." };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("customers")
      .update({ is_deleted: true })
      .eq("id", parsed.data.id)
      .eq("spa_id", context.data.spaId);

    if (error) {
      return { success: false, error: "Không thể xóa khách hàng." };
    }

    revalidatePath(CUSTOMERS_PATH);
    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi hệ thống khi xóa khách hàng.";
    return { success: false, error: message };
  }
}
