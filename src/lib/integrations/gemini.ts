import { GoogleGenAI } from "@google/genai";
import {
  AI_PLATFORM_LABELS,
  AI_TONE_LABELS,
  type AiContentTone,
  type AiServiceOption,
  type GeneratedSpaPost,
} from "@/features/ai-studio/types";
import { formatCurrencyVND } from "@/lib/utils";
import type { ActionResult } from "@/types/common";
import type { AiPlatformType } from "@/types/database.types";

const SPA_MARKETING_SYSTEM_PROMPT = `Bạn là chuyên gia Marketing & Sáng tạo nội dung hàng đầu cho ngành Spa & Thẩm mỹ tại Việt Nam.
Nhiệm vụ của bạn là viết bài quảng cáo thu hút khách hàng nữ tại Việt Nam (từ 22-45 tuổi) bằng tiếng Việt tự nhiên, ấm áp, đáng tin cậy, sử dụng emoji vừa phải, tối ưu SEO và có lời kêu gọi hành động (CTA) rõ ràng.
Luôn trả về duy nhất một JSON object hợp lệ với đúng 4 khóa string:
- "title": Tiêu đề hấp dẫn, ngắn gọn
- "content": Bài viết hoàn chỉnh sẵn sàng đăng (có đoạn mở đầu thu hút, lợi ích liệu trình, ưu đãi nếu có, CTA đặt lịch, và 4-6 hashtag tiếng Việt liên quan)
- "videoScript": Kịch bản video ngắn 30-45 giây chia theo từng cảnh (Cảnh 1, Cảnh 2, Cảnh 3...)
- "voiceoverScript": Lời bình đọc liên mạch dài khoảng 60-100 từ, tự nhiên, không chứa ký hiệu đặc biệt hay emoji, sẵn sàng chuyển thành giọng đọc AI tiếng Việt.`;

function stripMarkdownFence(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("```")) {
    return trimmed
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }
  return trimmed;
}

/** Generate SEO post, short-video script, and Vietnamese voiceover using Gemini API. */
export async function generateSpaMarketingContent(params: {
  spaName: string;
  spaPhone: string;
  service: AiServiceOption;
  platform: AiPlatformType;
  tone: AiContentTone;
  promoKeyword?: string;
}): Promise<ActionResult<GeneratedSpaPost>> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      error:
        "Chưa cấu hình GEMINI_API_KEY trong biến môi trường để tạo nội dung AI.",
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = [
      `Tên Spa: ${params.spaName} (Hotline đặt lịch: ${params.spaPhone})`,
      `Nền tảng đăng tải: ${AI_PLATFORM_LABELS[params.platform]}`,
      `Giọng văn mong muốn: ${AI_TONE_LABELS[params.tone]}`,
      `Tên dịch vụ: ${params.service.name}`,
      `Danh mục: ${params.service.category}`,
      `Giá tham khảo: ${formatCurrencyVND(params.service.price)} | Thời lượng: ${params.service.duration_minutes} phút`,
      params.service.description
        ? `Mô tả liệu trình: ${params.service.description}`
        : "",
      params.promoKeyword
        ? `Từ khóa / Chương trình ưu đãi cần nhấn mạnh: ${params.promoKeyword}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SPA_MARKETING_SYSTEM_PROMPT,
        responseMimeType: "application/json",
      },
    });

    const rawText = response.text ?? "";
    if (!rawText) {
      return {
        success: false,
        error: "AI không trả về nội dung. Vui lòng thử lại.",
      };
    }

    const parsed = JSON.parse(
      stripMarkdownFence(rawText)
    ) as Partial<GeneratedSpaPost>;

    if (!parsed.title || !parsed.content) {
      return {
        success: false,
        error: "Dữ liệu trả về từ AI chưa đúng định dạng mong muốn.",
      };
    }

    return {
      success: true,
      data: {
        title: parsed.title,
        content: parsed.content,
        videoScript: parsed.videoScript ?? "",
        voiceoverScript: parsed.voiceoverScript ?? "",
      },
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Không thể kết nối tới Google Gemini API.";
    return { success: false, error: message };
  }
}
