"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AI_PLATFORM_LABELS,
  AI_TONE_LABELS,
  type AiContentRow,
  type AiContentTone,
  type AiServiceOption,
} from "@/features/ai-studio/types";
import type { AiPlatformType } from "@/types/database.types";

interface AiPostGeneratorCardProps {
  services: AiServiceOption[];
  onGenerated: (content: AiContentRow, voiceoverScript: string) => void;
}

const PLATFORMS: AiPlatformType[] = [
  "facebook",
  "zalo",
  "website",
  "tiktok",
  "youtube",
];

const TONES: AiContentTone[] = ["than_thien", "chuyen_gia", "uu_dai"];

/** Control panel to pick a service, platform, tone, and generate SEO marketing content. */
export function AiPostGeneratorCard({
  services,
  onGenerated,
}: AiPostGeneratorCardProps) {
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [platform, setPlatform] = useState<AiPlatformType>("facebook");
  const [tone, setTone] = useState<AiContentTone>("than_thien");
  const [promoKeyword, setPromoKeyword] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!serviceId) {
      toast.error("Vui lòng tạo ít nhất 1 dịch vụ trước khi dùng AI.");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, platform, tone, promoKeyword }),
      });
      const json = (await response.json()) as {
        success: boolean;
        error?: string;
        data?: { saved: AiContentRow; voiceoverScript: string };
      };

      if (!response.ok || !json.success || !json.data) {
        toast.error(json.error ?? "Không thể tạo nội dung AI.");
        return;
      }

      toast.success("AI đã viết xong bài và kịch bản video!");
      onGenerated(json.data.saved, json.data.voiceoverScript);
    } catch {
      toast.error("Lỗi kết nối khi gọi AI tạo bài viết.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Card className="rounded-xl border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-heading text-[18px]">
          <Sparkles className="h-5 w-5 text-spa-accent" />
          1. AI Viết bài SEO &amp; Kịch bản Video
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Chọn dịch vụ muốn quảng cáo *</Label>
            <Select value={serviceId} onValueChange={setServiceId}>
              <SelectTrigger className="min-h-[44px] rounded-lg">
                <SelectValue placeholder="Chọn dịch vụ của Spa" />
              </SelectTrigger>
              <SelectContent>
                {services.map((svc) => (
                  <SelectItem key={svc.id} value={svc.id}>
                    {svc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Nền tảng đích</Label>
              <Select
                value={platform}
                onValueChange={(v) => setPlatform(v as AiPlatformType)}
              >
                <SelectTrigger className="min-h-[44px] rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {AI_PLATFORM_LABELS[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Phong cách bài viết</Label>
              <Select
                value={tone}
                onValueChange={(v) => setTone(v as AiContentTone)}
              >
                <SelectTrigger className="min-h-[44px] rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {AI_TONE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ai-promo">Từ khóa / Ưu đãi kèm theo</Label>
            <Input
              id="ai-promo"
              value={promoKeyword}
              onChange={(e) => setPromoKeyword(e.target.value)}
              placeholder="VD: Giảm 30% trải nghiệm lần đầu trong tháng này"
              className="min-h-[44px] rounded-lg"
            />
          </div>

          <Button
            type="submit"
            disabled={isGenerating || services.length === 0}
            className="min-h-[44px] w-full rounded-lg bg-spa-accent text-[15px] font-semibold text-white hover:bg-amber-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                AI đang sáng tạo nội dung...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Tạo nội dung &amp; Kịch bản ngay
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
