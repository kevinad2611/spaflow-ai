import { z } from "zod";

export const VIETNAM_PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập email")
    .email("Email không đúng định dạng"),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const registerSchema = z
  .object({
    spaName: z
      .string()
      .trim()
      .min(2, "Tên Spa phải có ít nhất 2 ký tự")
      .max(100, "Tên Spa không được vượt quá 100 ký tự"),
    phone: z
      .string()
      .trim()
      .regex(
        VIETNAM_PHONE_REGEX,
        "Số điện thoại Việt Nam không hợp lệ (VD: 0901234567)"
      ),
    email: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập email")
      .email("Email không đúng định dạng"),
    password: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z
      .string()
      .min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
