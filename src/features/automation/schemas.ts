import { z } from "zod";
import { VIETNAM_PHONE_REGEX } from "@/features/auth/schemas";

const optionalUrlSchema = z
  .string()
  .trim()
  .refine(
    (val) => val === "" || /^https?:\/\/.+/i.test(val),
    "Đường dẫn phải bắt đầu bằng http:// hoặc https://"
  );

export const zaloConnectionSchema = z.object({
  appId: z.string().trim().min(2, "Vui lòng nhập Zalo App ID"),
  secretKey: z.string().trim().min(4, "Vui lòng nhập Zalo Secret Key"),
  refreshToken: z.string().trim().min(4, "Vui lòng nhập Zalo Refresh Token"),
  templateId: z.string().trim().optional().or(z.literal("")),
});

export const emailConnectionSchema = z.object({
  apiKey: z.string().trim().min(6, "Vui lòng nhập Resend API Key hợp lệ"),
  fromEmail: z
    .string()
    .trim()
    .refine(
      (val) => val === "" || z.string().email().safeParse(val).success,
      "Email người gửi không đúng định dạng"
    ),
  fromName: z
    .string()
    .trim()
    .max(80, "Tên hiển thị tối đa 80 ký tự")
    .optional()
    .or(z.literal("")),
});

export const socialLinksSchema = z.object({
  facebook: optionalUrlSchema,
  tiktok: optionalUrlSchema,
  youtube: optionalUrlSchema,
  website: optionalUrlSchema,
});

export const testMessageSchema = z
  .object({
    channel: z.enum(["zalo", "email"]),
    recipient: z.string().trim().min(1, "Vui lòng nhập người nhận để test"),
  })
  .superRefine((data, ctx) => {
    if (data.channel === "zalo" && !VIETNAM_PHONE_REGEX.test(data.recipient)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Số điện thoại Zalo test không hợp lệ (VD: 0901234567)",
        path: ["recipient"],
      });
    }
    if (
      data.channel === "email" &&
      !z.string().email().safeParse(data.recipient).success
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email nhận tin test không đúng định dạng",
        path: ["recipient"],
      });
    }
  });

export const updateAutomationRuleSchema = z.object({
  id: z.string().uuid("Mã kịch bản không hợp lệ"),
  channel: z.enum(["zalo", "email", "both"]),
  template_content: z
    .string()
    .trim()
    .min(10, "Nội dung tin nhắn mẫu phải có ít nhất 10 ký tự")
    .max(1000, "Nội dung tin nhắn mẫu tối đa 1000 ký tự"),
  is_active: z.boolean(),
});

export type ZaloConnectionValues = z.infer<typeof zaloConnectionSchema>;
export type EmailConnectionValues = z.infer<typeof emailConnectionSchema>;
export type SocialLinksValues = z.infer<typeof socialLinksSchema>;
export type TestMessageValues = z.infer<typeof testMessageSchema>;
export type UpdateAutomationRuleValues = z.infer<
  typeof updateAutomationRuleSchema
>;
