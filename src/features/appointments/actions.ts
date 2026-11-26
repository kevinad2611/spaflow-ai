"use server";

import { revalidatePath } from "next/cache";
import {
  createAppointmentSchema,
  updateAppointmentStatusSchema,
  type CreateAppointmentValues,
  type UpdateAppointmentStatusValues,
} from "@/features/appointments/schemas";
import type {
  AppointmentDateFilter,
  AppointmentFormOptions,
  AppointmentItem,
  DashboardSummary,
} from "@/features/appointments/types";
import {
  addDaysISO,
  calculateEndTime,
  getVietnamTodayISO,
  hasTimeOverlap,
} from "@/features/appointments/utils";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSpaContext } from "@/lib/supabase/spa";
import type { ActionResult } from "@/types/common";

const APPOINTMENT_SELECT =
  "id, appointment_date, start_time, end_time, status, total_price, notes, customer:customers(id, full_name, phone), staff:staff(id, full_name), appointment_services(service_id, price_at_booking, services(name, duration_minutes))";

/** Fetch appointments filtered by date preset and optional staff id. */
export async function getAppointments(
  dateFilter: AppointmentDateFilter = "today",
  staffId?: string
): Promise<ActionResult<AppointmentItem[]>> {
  try {
    const context = await getCurrentSpaContext();
    if (context.error || !context.data) {
      return { success: false, error: context.error ?? "Chưa xác thực Spa." };
    }

    const supabase = await createClient();
    const today = getVietnamTodayISO();
    let query = supabase
      .from("appointments")
      .select(APPOINTMENT_SELECT)
      .eq("spa_id", context.data.spaId);

    if (dateFilter === "today") {
      query = query.eq("appointment_date", today);
    } else if (dateFilter === "tomorrow") {
      query = query.eq("appointment_date", addDaysISO(today, 1));
    } else if (dateFilter === "week") {
      query = query
        .gte("appointment_date", today)
        .lte("appointment_date", addDaysISO(today, 6));
    }

    if (staffId && staffId !== "all") {
      query = query.eq("staff_id", staffId);
    }

    const { data, error } = await query
      .order("appointment_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) {
      return { success: false, error: "Không thể tải danh sách lịch hẹn." };
    }

    return { success: true, data: (data ?? []) as AppointmentItem[] };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi hệ thống khi tải lịch hẹn.";
    return { success: false, error: message };
  }
}

/** Load active customers, services, and staff options for creating appointments. */
export async function getAppointmentFormOptions(): Promise<
  ActionResult<AppointmentFormOptions>
> {
  try {
    const context = await getCurrentSpaContext();
    if (context.error || !context.data) {
      return { success: false, error: context.error ?? "Chưa xác thực Spa." };
    }

    const supabase = await createClient();
    const [customersRes, servicesRes, staffRes] = await Promise.all([
      supabase
        .from("customers")
        .select("id, full_name, phone")
        .eq("spa_id", context.data.spaId)
        .eq("is_deleted", false)
        .order("full_name", { ascending: true }),
      supabase
        .from("services")
        .select("id, name, category, price, duration_minutes")
        .eq("spa_id", context.data.spaId)
        .eq("is_active", true)
        .order("name", { ascending: true }),
      supabase
        .from("staff")
        .select("id, full_name, role")
        .eq("spa_id", context.data.spaId)
        .eq("is_active", true)
        .order("full_name", { ascending: true }),
    ]);

    if (customersRes.error || servicesRes.error || staffRes.error) {
      return { success: false, error: "Không thể tải dữ liệu biểu mẫu." };
    }

    return {
      success: true,
      data: {
        customers: customersRes.data ?? [],
        services: servicesRes.data ?? [],
        staff: staffRes.data ?? [],
      },
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi hệ thống khi tải tùy chọn.";
    return { success: false, error: message };
  }
}

/** Create an appointment with multi-service pricing, end time calc, and staff overlap check. */
export async function createAppointment(
  rawInput: CreateAppointmentValues
): Promise<ActionResult<{ id: string }>> {
  const parsed = createAppointmentSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dữ liệu lịch hẹn không hợp lệ.",
    };
  }

  try {
    const context = await getCurrentSpaContext();
    if (context.error || !context.data) {
      return { success: false, error: context.error ?? "Chưa xác thực Spa." };
    }

    const supabase = await createClient();
    const spaId = context.data.spaId;

    const { data: selectedServices, error: svcError } = await supabase
      .from("services")
      .select("id, price, duration_minutes")
      .eq("spa_id", spaId)
      .eq("is_active", true)
      .in("id", parsed.data.service_ids);

    if (
      svcError ||
      !selectedServices ||
      selectedServices.length !== parsed.data.service_ids.length
    ) {
      return {
        success: false,
        error: "Một hoặc nhiều dịch vụ không còn hoạt động.",
      };
    }

    const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
    const totalMinutes = selectedServices.reduce(
      (sum, s) => sum + s.duration_minutes,
      0
    );
    const endTime = calculateEndTime(parsed.data.start_time, totalMinutes);
    const assignedStaffId =
      parsed.data.staff_id && parsed.data.staff_id !== "unassigned"
        ? parsed.data.staff_id
        : null;

    if (assignedStaffId) {
      const { data: existingAppts } = await supabase
        .from("appointments")
        .select("id, start_time, end_time")
        .eq("spa_id", spaId)
        .eq("staff_id", assignedStaffId)
        .eq("appointment_date", parsed.data.appointment_date)
        .neq("status", "cancelled");

      const conflict = (existingAppts ?? []).some((appt) =>
        hasTimeOverlap(
          parsed.data.start_time,
          endTime,
          appt.start_time,
          appt.end_time
        )
      );
      if (conflict) {
        return {
          success: false,
          error:
            "Nhân viên đã có lịch hẹn trùng khung giờ này. Vui lòng chọn giờ hoặc nhân viên khác.",
        };
      }
    }

    let resolvedCustomerId = parsed.data.customer_id ?? "";
    if (parsed.data.customer_mode === "quick_new") {
      const { data: newCust, error: custError } = await supabase
        .from("customers")
        .insert({
          spa_id: spaId,
          full_name: parsed.data.quick_customer_name ?? "",
          phone: parsed.data.quick_customer_phone ?? "",
        })
        .select("id")
        .single();

      if (custError || !newCust) {
        return { success: false, error: "Không thể tạo nhanh khách hàng mới." };
      }
      resolvedCustomerId = newCust.id;
    }

    const { data: appt, error: apptError } = await supabase
      .from("appointments")
      .insert({
        spa_id: spaId,
        customer_id: resolvedCustomerId,
        staff_id: assignedStaffId,
        appointment_date: parsed.data.appointment_date,
        start_time: parsed.data.start_time,
        end_time: endTime,
        status: "confirmed",
        total_price: totalPrice,
        notes: parsed.data.notes || null,
      })
      .select("id")
      .single();

    if (apptError || !appt) {
      return { success: false, error: "Không thể tạo lịch hẹn mới." };
    }

    const { error: pivotError } = await supabase
      .from("appointment_services")
      .insert(
        selectedServices.map((svc) => ({
          appointment_id: appt.id,
          service_id: svc.id,
          price_at_booking: svc.price,
        }))
      );

    if (pivotError) {
      return {
        success: false,
        error: "Đã tạo lịch hẹn nhưng chưa lưu được chi tiết dịch vụ.",
      };
    }

    revalidatePath("/dashboard/appointments");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/customers");
    return { success: true, data: { id: appt.id } };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi hệ thống khi tạo lịch hẹn.";
    return { success: false, error: message };
  }
}

/** Update appointment status with one-tap workflow transitions. */
export async function updateAppointmentStatus(
  rawInput: UpdateAppointmentStatusValues
): Promise<ActionResult> {
  const parsed = updateAppointmentStatusSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Trạng thái lịch hẹn không hợp lệ.",
    };
  }

  try {
    const context = await getCurrentSpaContext();
    if (context.error || !context.data) {
      return { success: false, error: context.error ?? "Chưa xác thực Spa." };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("appointments")
      .update({ status: parsed.data.status })
      .eq("id", parsed.data.id)
      .eq("spa_id", context.data.spaId);

    if (error) {
      return { success: false, error: "Không thể cập nhật trạng thái lịch hẹn." };
    }

    revalidatePath("/dashboard/appointments");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/customers");
    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi hệ thống khi đổi trạng thái.";
    return { success: false, error: message };
  }
}

/** Fetch real KPI counters and today's appointments for the Dashboard overview. */
export async function getDashboardSummary(): Promise<
  ActionResult<DashboardSummary>
> {
  try {
    const context = await getCurrentSpaContext();
    if (context.error || !context.data) {
      return { success: false, error: context.error ?? "Chưa xác thực Spa." };
    }

    const supabase = await createClient();
    const today = getVietnamTodayISO();

    const [todayRes, logsRes] = await Promise.all([
      supabase
        .from("appointments")
        .select(APPOINTMENT_SELECT)
        .eq("spa_id", context.data.spaId)
        .eq("appointment_date", today)
        .order("start_time", { ascending: true }),
      supabase
        .from("message_logs")
        .select("id", { count: "exact", head: true })
        .eq("spa_id", context.data.spaId)
        .eq("status", "sent"),
    ]);

    if (todayRes.error) {
      return { success: false, error: "Không thể tải dữ liệu tổng quan." };
    }

    const todayAppointments = (todayRes.data ?? []) as AppointmentItem[];
    const activeToday = todayAppointments.filter(
      (a) => a.status !== "cancelled"
    );

    return {
      success: true,
      data: {
        todayCount: activeToday.length,
        inProgressCount: todayAppointments.filter(
          (a) => a.status === "in_progress"
        ).length,
        sentMessagesCount: logsRes.count ?? 0,
        expectedRevenue: activeToday.reduce((sum, a) => sum + a.total_price, 0),
        todayAppointments,
      },
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi hệ thống khi tải tổng quan.";
    return { success: false, error: message };
  }
}
