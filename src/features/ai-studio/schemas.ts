import { z } from "zod";

export const generatePostSchema = z.object({
  serviceId: z.string().uuid("Vui lòng chọn dịch vụ hợp lệ"),
  platform: z.enum(["facebook", "zalo", "tiktok", "youtube", "website"], {
    message: "Vui lòng chọn nền tảng đích",
  }),
  promoKeyword: z
    .string()
    .trim()
    .max(200, "Từ khóa / ưu đãi tối đa 200 ký tự")
    .optional()
    .or(z.literal("")),
  tone: z.enum(["than_thien", "chuyen_gia", "uu_dai"]).default("than_thien"),
});

export const generateTtsSchema = z.object({
  text: z
    .string()
    .trim()
    .min(10, "Lời bình video cần ít nhất 10 ký tự")
    .max(1200, "Lời bình video tối đa 1200 ký tự"),
});

export const deleteAiContentSchema = z.object({
  id: z.string().uuid("Mã nội dung không hợp lệ"),
});

export type GeneratePostInput = z.infer<typeof generatePostSchema>;
export type GenerateTtsInput = z.infer<typeof generateTtsSchema>;
export type DeleteAiContentInput = z.infer<typeof deleteAiContentSchema>;
