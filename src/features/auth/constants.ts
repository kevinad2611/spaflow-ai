import type { TablesInsert } from "@/types/database.types";

/** Create the 3 default automation rules for a newly registered Spa. */
export function buildDefaultAutomationRules(
  spaId: string
): TablesInsert<"automation_rules">[] {
  return [
    {
      spa_id: spaId,
      trigger_type: "before_24h",
      channel: "zalo",
      template_content:
        "Chào {{ten_khach}}, {{ten_spa}} xin nhắc bạn có lịch hẹn {{dich_vu}} vào ngày mai ({{ngay_hen}}) lúc {{gio_hen}}. Rất hân hạnh được đón tiếp bạn!",
      is_active: true,
    },
    {
      spa_id: spaId,
      trigger_type: "before_2h",
      channel: "zalo",
      template_content:
        "Chào {{ten_khach}}, chỉ còn 2 tiếng nữa là đến giờ hẹn {{dich_vu}} tại {{ten_spa}} lúc {{gio_hen}} hôm nay. Hẹn gặp bạn nhé!",
      is_active: true,
    },
    {
      spa_id: spaId,
      trigger_type: "after_completed_24h",
      channel: "zalo",
      template_content:
        "Cảm ơn {{ten_khach}} đã tin tưởng sử dụng dịch vụ {{dich_vu}} tại {{ten_spa}}. Nếu cần tư vấn chăm sóc sau liệu trình, bạn nhắn cho Spa nhé!",
      is_active: true,
    },
  ];
}
