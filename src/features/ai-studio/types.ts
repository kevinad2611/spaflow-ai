import type { AiPlatformType, Tables } from "@/types/database.types";

export type AiContentRow = Tables<"ai_contents">;

export interface AiServiceOption {
  id: string;
  name: string;
  category: string;
  price: number;
  duration_minutes: number;
  description: string | null;
}

export type AiContentTone = "than_thien" | "chuyen_gia" | "uu_dai";

export interface GeneratedSpaPost {
  title: string;
  content: string;
  videoScript: string;
  voiceoverScript: string;
}

export const AI_PLATFORM_LABELS: Record<AiPlatformType, string> = {
  facebook: "Facebook Fanpage",
  zalo: "Zalo OA",
  website: "Bài viết Website SEO",
  tiktok: "Kịch bản TikTok",
  youtube: "YouTube Shorts",
};

export const AI_TONE_LABELS: Record<AiContentTone, string> = {
  than_thien: "Thân thiện, gần gũi",
  chuyen_gia: "Chuyên gia chuẩn Y khoa",
  uu_dai: "Thúc đẩy đặt lịch / Ưu đãi",
};
