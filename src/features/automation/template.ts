import type { AutomationTriggerType } from "@/types/database.types";

export interface TemplateVariables {
  ten_khach: string;
  ten_spa: string;
  dich_vu: string;
  ngay_hen: string;
  gio_hen: string;
}

export const TEMPLATE_VARIABLE_CHIPS = [
  "{{ten_khach}}",
  "{{ten_spa}}",
  "{{dich_vu}}",
  "{{ngay_hen}}",
  "{{gio_hen}}",
] as const;

export const TRIGGER_METADATA: Record<
  AutomationTriggerType,
  { title: string; description: string; emailSubject: string }
> = {
  before_24h: {
    title: "Nhắc lịch trước 24 tiếng",
    description:
      "Tự động gửi cho khách hàng trước giờ hẹn khoảng 24 giờ để giảm quên lịch.",
    emailSubject: "Nhắc lịch hẹn ngày mai tại Spa",
  },
  before_2h: {
    title: "Nhắc lịch trước 2 tiếng",
    description:
      "Nhắn nhắc khách chuẩn bị di chuyển trước giờ làm liệu trình 2 tiếng.",
    emailSubject: "Sắp đến giờ hẹn làm đẹp của bạn",
  },
  after_completed_24h: {
    title: "Hỏi thăm sau hoàn thành 24 tiếng",
    description:
      "Tự động chăm sóc, hỏi thăm cảm nhận và xin đánh giá sau khi khách làm xong dịch vụ 1 ngày.",
    emailSubject: "Cảm ơn bạn đã ghé thăm Spa",
  },
};

/** Replace dynamic Spa template placeholders with real appointment values. */
export function renderTemplate(
  template: string,
  vars: TemplateVariables
): string {
  return template
    .replaceAll("{{ten_khach}}", vars.ten_khach)
    .replaceAll("{{ten_spa}}", vars.ten_spa)
    .replaceAll("{{dich_vu}}", vars.dich_vu)
    .replaceAll("{{ngay_hen}}", vars.ngay_hen)
    .replaceAll("{{gio_hen}}", vars.gio_hen);
}

/** Parse a Vietnam local date + HH:mm time into UTC epoch milliseconds. */
function parseVietnamDateTimeMs(dateISO: string, timeStr: string): number {
  const normalizedTime = timeStr.slice(0, 5);
  return Date.parse(`${dateISO}T${normalizedTime}:00+07:00`);
}

/** Check whether an appointment falls inside the trigger window for the cron run. */
export function isAppointmentDueForTrigger(
  appointmentDate: string,
  startTime: string,
  endTime: string,
  triggerType: AutomationTriggerType,
  now: Date = new Date()
): boolean {
  const nowMs = now.getTime();
  const startMs = parseVietnamDateTimeMs(appointmentDate, startTime);
  const endMs = parseVietnamDateTimeMs(appointmentDate, endTime);

  const HOUR_MS = 60 * 60 * 1000;

  if (triggerType === "before_24h") {
    const diff = startMs - nowMs;
    return diff >= 23 * HOUR_MS && diff <= 25 * HOUR_MS;
  }

  if (triggerType === "before_2h") {
    const diff = startMs - nowMs;
    return diff >= 1 * HOUR_MS && diff <= 2.5 * HOUR_MS;
  }

  // after_completed_24h: 23h to 26h after endTime
  const elapsed = nowMs - endMs;
  return elapsed >= 23 * HOUR_MS && elapsed <= 26 * HOUR_MS;
}
