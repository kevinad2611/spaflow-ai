import { z } from "zod";
import { VIETNAM_PHONE_REGEX } from "@/features/auth/schemas";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const createAppointmentSchema = z
  .object({
    customer_mode: z.enum(["existing", "quick_new"]),
    customer_id: z.string().optional(),
    quick_customer_name: z.string().trim().optional(),
    quick_customer_phone: z.string().trim().optional(),
    service_ids: z
      .array(z.string().uuid("Mã dịch vụ không hợp lệ"))
      .min(1, "Vui lòng chọn ít nhất 1 dịch vụ"),
    staff_id: z.string().optional(),
    appointment_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày hẹn không đúng định dạng"),
    start_time: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "Giờ bắt đầu không đúng định dạng"),
    notes: z
      .string()
      .trim()
      .max(500, "Ghi chú không được vượt quá 500 ký tự")
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.customer_mode === "existing") {
      if (!data.customer_id || !UUID_REGEX.test(data.customer_id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng chọn khách hàng",
          path: ["customer_id"],
        });
      }
    } else {
      if (!data.quick_customer_name || data.quick_customer_name.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Tên khách hàng phải có ít nhất 2 ký tự",
          path: ["quick_customer_name"],
        });
      }
      if (
        !data.quick_customer_phone ||
        !VIETNAM_PHONE_REGEX.test(data.quick_customer_phone)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Số điện thoại Việt Nam không hợp lệ (VD: 0901234567)",
          path: ["quick_customer_phone"],
        });
      }
    }

    if (data.staff_id && data.staff_id !== "unassigned") {
      if (!UUID_REGEX.test(data.staff_id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nhân viên được chọn không hợp lệ",
          path: ["staff_id"],
        });
      }
    }
  });

export const updateAppointmentStatusSchema = z.object({
  id: z.string().uuid("Mã lịch hẹn không hợp lệ"),
  status: z.enum([
    "pending",
    "confirmed",
    "in_progress",
    "completed",
    "cancelled",
  ]),
});

export type CreateAppointmentValues = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentStatusValues = z.infer<
  typeof updateAppointmentStatusSchema
>;
