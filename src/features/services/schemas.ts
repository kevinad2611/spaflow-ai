import { z } from "zod";
import { SERVICE_CATEGORIES } from "@/features/services/types";

export const serviceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tên dịch vụ phải có ít nhất 2 ký tự")
    .max(120, "Tên dịch vụ không được vượt quá 120 ký tự"),
  category: z.enum(SERVICE_CATEGORIES, {
    message: "Vui lòng chọn danh mục hợp lệ",
  }),
  price: z
    .number({ message: "Vui lòng nhập giá dịch vụ hợp lệ" })
    .min(0, "Giá dịch vụ không được âm")
    .max(1000000000, "Giá dịch vụ quá lớn"),
  duration_minutes: z
    .number({ message: "Vui lòng nhập thời lượng hợp lệ" })
    .int("Thời lượng phải là số nguyên")
    .min(5, "Thời lượng tối thiểu là 5 phút")
    .max(600, "Thời lượng tối đa là 600 phút"),
  description: z
    .string()
    .trim()
    .max(500, "Mô tả không được vượt quá 500 ký tự")
    .optional()
    .or(z.literal("")),
});

export const updateServiceSchema = serviceSchema.extend({
  id: z.string().uuid("ID dịch vụ không hợp lệ"),
});

export const toggleServiceStatusSchema = z.object({
  id: z.string().uuid("ID dịch vụ không hợp lệ"),
  is_active: z.boolean(),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;
export type UpdateServiceValues = z.infer<typeof updateServiceSchema>;
export type ToggleServiceStatusValues = z.infer<typeof toggleServiceStatusSchema>;
