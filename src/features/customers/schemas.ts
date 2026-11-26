import { z } from "zod";
import { VIETNAM_PHONE_REGEX } from "@/features/auth/schemas";

export const customerSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Họ tên khách hàng phải có ít nhất 2 ký tự")
    .max(100, "Họ tên không được vượt quá 100 ký tự"),
  phone: z
    .string()
    .trim()
    .regex(
      VIETNAM_PHONE_REGEX,
      "Số điện thoại Việt Nam không hợp lệ (VD: 0901234567)"
    ),
  zalo_phone: z
    .string()
    .trim()
    .refine(
      (val) => val === "" || VIETNAM_PHONE_REGEX.test(val),
      "Số Zalo phải đúng định dạng SĐT Việt Nam"
    ),
  email: z
    .string()
    .trim()
    .refine(
      (val) => val === "" || z.string().email().safeParse(val).success,
      "Email không đúng định dạng"
    ),
  address: z
    .string()
    .trim()
    .max(250, "Địa chỉ không được vượt quá 250 ký tự")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .trim()
    .max(1000, "Ghi chú không được vượt quá 1000 ký tự")
    .optional()
    .or(z.literal("")),
});

export const updateCustomerSchema = customerSchema.extend({
  id: z.string().uuid("ID khách hàng không hợp lệ"),
});

export const deleteCustomerSchema = z.object({
  id: z.string().uuid("ID khách hàng không hợp lệ"),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
export type UpdateCustomerValues = z.infer<typeof updateCustomerSchema>;
export type DeleteCustomerValues = z.infer<typeof deleteCustomerSchema>;
