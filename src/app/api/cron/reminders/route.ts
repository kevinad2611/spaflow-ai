import { NextResponse } from "next/server";
import {
  addDaysISO,
  getVietnamTodayISO,
} from "@/features/appointments/utils";
import {
  isAppointmentDueForTrigger,
  renderTemplate,
  TRIGGER_METADATA,
} from "@/features/automation/template";
import { decryptJson } from "@/lib/crypto";
import {
  sendResendEmail,
  type EmailCredentials,
} from "@/lib/integrations/email";
import { sendZaloMessage, type ZaloCredentials } from "@/lib/integrations/zalo";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDateVN, formatTimeVN } from "@/lib/utils";
import type {
  AppointmentStatus,
  AutomationTriggerType,
  MessageChannel,
} from "@/types/database.types";

interface CronAppointmentRow {
  id: string;
  spa_id: string;
  customer_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  customer: {
    full_name: string;
    phone: string;
    zalo_phone: string | null;
    email: string | null;
  } | null;
  appointment_services: {
    services: { name: string } | null;
  }[];
}

function verifyCronAuthorization(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

async function runRemindersJob() {
  const supabase = createAdminClient();
  const today = getVietnamTodayISO();
  const fromDate = addDaysISO(today, -2);
  const toDate = addDaysISO(today, 2);

  const [rulesRes, spasRes, connectionsRes, apptsRes] = await Promise.all([
    supabase.from("automation_rules").select("*").eq("is_active", true),
    supabase.from("spas").select("id, name"),
    supabase
      .from("platform_connections")
      .select("spa_id, platform, is_connected, credentials_encrypted")
      .in("platform", ["zalo_oa", "email"])
      .eq("is_connected", true),
    supabase
      .from("appointments")
      .select(
        "id, spa_id, customer_id, appointment_date, start_time, end_time, status, customer:customers(full_name, phone, zalo_phone, email), appointment_services(services(name))"
      )
      .gte("appointment_date", fromDate)
      .lte("appointment_date", toDate)
      .in("status", ["pending", "confirmed", "completed"]),
  ]);

  if (rulesRes.error || spasRes.error || connectionsRes.error || apptsRes.error) {
    throw new Error("Không thể truy vấn dữ liệu nhắc lịch từ Supabase.");
  }

  const spaNameMap = new Map(
    (spasRes.data ?? []).map((s) => [s.id, s.name])
  );
  const connMap = new Map<string, string>();
  for (const conn of connectionsRes.data ?? []) {
    if (conn.credentials_encrypted) {
      connMap.set(`${conn.spa_id}:${conn.platform}`, conn.credentials_encrypted);
    }
  }

  const appointments = (apptsRes.data ?? []) as CronAppointmentRow[];
  const appointmentIds = appointments.map((a) => a.id);
  const existingLogKeys = new Set<string>();

  if (appointmentIds.length > 0) {
    const { data: existingLogs } = await supabase
      .from("message_logs")
      .select("appointment_id, rule_id, channel")
      .in("appointment_id", appointmentIds);

    for (const log of existingLogs ?? []) {
      existingLogKeys.add(
        `${log.appointment_id}:${log.rule_id ?? ""}:${log.channel}`
      );
    }
  }

  let sentCount = 0;
  let failedCount = 0;

  for (const rule of rulesRes.data ?? []) {
    const triggerType = rule.trigger_type as AutomationTriggerType;
    const spaAppts = appointments.filter((a) => a.spa_id === rule.spa_id);

    for (const appt of spaAppts) {
      if (!appt.customer) continue;

      const statusMatches =
        triggerType === "after_completed_24h"
          ? appt.status === "completed"
          : appt.status === "pending" || appt.status === "confirmed";
      if (!statusMatches) continue;

      if (
        !isAppointmentDueForTrigger(
          appt.appointment_date,
          appt.start_time,
          appt.end_time,
          triggerType
        )
      ) {
        continue;
      }

      const channels: MessageChannel[] =
        rule.channel === "both"
          ? ["zalo", "email"]
          : [rule.channel as MessageChannel];

      const serviceNames =
        appt.appointment_services
          .map((item) => item.services?.name)
          .filter((name): name is string => Boolean(name))
          .join(", ") || "Dịch vụ Spa";

      const rendered = renderTemplate(rule.template_content, {
        ten_khach: appt.customer.full_name,
        ten_spa: spaNameMap.get(appt.spa_id) ?? "SpaFlow",
        dich_vu: serviceNames,
        ngay_hen: formatDateVN(appt.appointment_date),
        gio_hen: formatTimeVN(appt.start_time),
      });

      for (const ch of channels) {
        const dedupeKey = `${appt.id}:${rule.id}:${ch}`;
        if (existingLogKeys.has(dedupeKey)) continue;

        let deliveryResult: { success: boolean; error?: string } = {
          success: false,
          error: "Thiếu cấu hình kênh gửi.",
        };

        if (ch === "zalo") {
          const enc = connMap.get(`${appt.spa_id}:zalo_oa`);
          if (!enc) {
            deliveryResult = { success: false, error: "Chưa kết nối Zalo OA." };
          } else {
            const creds = decryptJson<ZaloCredentials>(enc);
            deliveryResult = await sendZaloMessage({
              credentials: creds,
              phone: appt.customer.zalo_phone ?? appt.customer.phone,
              message: rendered,
              templateData: {
                customer_name: appt.customer.full_name,
                spa_name: spaNameMap.get(appt.spa_id) ?? "Spa",
                service_name: serviceNames,
                date: formatDateVN(appt.appointment_date),
                time: formatTimeVN(appt.start_time),
              },
            });
          }
        } else if (ch === "email") {
          const enc = connMap.get(`${appt.spa_id}:email`);
          if (!appt.customer.email) {
            deliveryResult = {
              success: false,
              error: "Khách hàng chưa có địa chỉ Email.",
            };
          } else if (!enc) {
            deliveryResult = { success: false, error: "Chưa kết nối Email." };
          } else {
            const creds = decryptJson<EmailCredentials>(enc);
            deliveryResult = await sendResendEmail({
              credentials: creds,
              to: appt.customer.email,
              subject: TRIGGER_METADATA[triggerType].emailSubject,
              text: rendered,
            });
          }
        }

        const { error: insertLogErr } = await supabase
          .from("message_logs")
          .insert({
            spa_id: appt.spa_id,
            appointment_id: appt.id,
            customer_id: appt.customer_id,
            rule_id: rule.id,
            channel: ch,
            status: deliveryResult.success ? "sent" : "failed",
            error_message: deliveryResult.success
              ? null
              : (deliveryResult.error ?? "Gửi tin thất bại"),
          });

        if (!insertLogErr) {
          existingLogKeys.add(dedupeKey);
          if (deliveryResult.success) sentCount += 1;
          else failedCount += 1;
        }
      }
    }
  }

  return { sentCount, failedCount };
}

export async function GET(request: Request) {
  if (!verifyCronAuthorization(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await runRemindersJob();
    return NextResponse.json({ success: true, data: summary });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Cron job error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
