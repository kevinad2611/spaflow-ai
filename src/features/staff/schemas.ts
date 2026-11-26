import { z } from "zod";
import { VIETNAM_PHONE_REGEX } from "@/features/auth/schemas";

export const staffSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Họ tên nhân viên phải có ít nhất 2 ký tự")
    .max(100, "Họ tên không được vượt quá 100 ký tự"),
  phone: z
    .string()
    .trim()
    .refine(
      (val) => val === "" || VIETNAM_PHONE_REGEX.test(val),
      "Số điện thoại Việt Nam không hợp lệ (VD: 0901234567)"
    ),
  role: z.enum(["manager", "technician", "receptionist"], {
    message: "Vui lòng chọn vai trò hợp lệ",
  }),
});

export const updateStaffSchema = staffSchema.extend({
  id: z.string().uuid("ID nhân viên không hợp lệ"),
});

export const toggleStaffStatusSchema = z.object({
  id: z.string().uuid("ID nhân viên không hợp lệ"),
  is_active: z.boolean(),
});

export type StaffFormValues = z.infer<typeof staffSchema>;
export type UpdateStaffValues = z.infer<typeof updateStaffSchema>;
export type ToggleStaffStatusValues = z.infer<typeof toggleStaffStatusSchema>;
