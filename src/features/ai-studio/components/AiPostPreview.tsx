"use client";

import { Copy, FileText, Video } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AI_PLATFORM_LABELS,
  type AiContentRow,
} from "@/features/ai-studio/types";

interface AiPostPreviewProps {
  activeContent: AiContentRow | null;
}

/** Preview pane for AI-generated SEO posts and video scripts with 1-click copy. */
export function AiPostPreview({ activeContent }: AiPostPreviewProps) {
  async function handleCopy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Đã sao chép ${label}!`);
    } catch {
      toast.error("Không thể truy cập clipboard của trình duyệt.");
    }
  }

  if (!activeContent) {
    return (
      <EmptyState
        icon={FileText}
        title="Khung xem trước nội dung AI"
        description="Chọn dịch vụ ở cột bên trái và bấm Tạo nội dung để AI viết bài quảng cáo chuẩn SEO cùng kịch bản video."
      />
    );
  }

  return (
    <Card className="rounded-xl border-border bg-card shadow-sm">
      <CardHeader className="flex flex-col gap-3 border-b border-border sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <Badge variant="secondary">
            {AI_PLATFORM_LABELS[activeContent.platform]}
          </Badge>
          <CardTitle className="font-heading text-lg leading-7 text-foreground">
            {activeContent.title}
          </CardTitle>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            handleCopy(
              `${activeContent.title}\n\n${activeContent.content}`,
              "bài viết"
            )
          }
          className="min-h-[44px] shrink-0 rounded-lg px-4"
        >
          <Copy className="h-4 w-4 text-primary" />
          Sao chép bài viết
        </Button>
      </CardHeader>

      <CardContent className="space-y-5 pt-5">
        <div className="whitespace-pre-wrap rounded-xl border border-border bg-background/60 p-4 text-[15px] leading-7 text-foreground">
          {activeContent.content}
        </div>

        {activeContent.video_script ? (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="flex items-center gap-2 font-heading text-[16px] font-semibold text-foreground">
                <Video className="h-4 w-4 text-primary" />
                Kịch bản Video ngắn (TikTok / Reels)
              </h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  handleCopy(activeContent.video_script ?? "", "kịch bản")
                }
                className="min-h-[44px] rounded-lg px-3"
              >
                <Copy className="h-4 w-4" />
                Sao chép kịch bản
              </Button>
            </div>
            <div className="whitespace-pre-wrap rounded-xl border border-border bg-secondary/40 p-4 text-[14px] leading-6 text-foreground">
              {activeContent.video_script}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
