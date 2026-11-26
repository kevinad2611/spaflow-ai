"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deleteAiContentAction } from "@/features/ai-studio/actions";
import {
  AI_PLATFORM_LABELS,
  type AiContentRow,
} from "@/features/ai-studio/types";
import { formatDateVN } from "@/lib/utils";

interface AiHistoryListProps {
  contents: AiContentRow[];
  onSelectContent: (content: AiContentRow) => void;
}

/** List of previously generated AI marketing posts with preview and delete actions. */
export function AiHistoryList({
  contents,
  onSelectContent,
}: AiHistoryListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    const result = await deleteAiContentAction({ id });
    setDeletingId(null);

    if (!result.success) {
      toast.error(result.error ?? "Không thể xóa bài viết.");
      return;
    }

    toast.success("Đã xóa nội dung khỏi lịch sử.");
    router.refresh();
  }

  if (contents.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="Chưa có bài viết AI nào được lưu"
        description="Các bài viết SEO và kịch bản video bạn tạo sẽ tự động được lưu lại để tái sử dụng."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {contents.map((item) => (
        <Card key={item.id} className="rounded-xl border-border bg-card">
          <CardContent className="flex h-full flex-col justify-between gap-4 p-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="secondary">
                  {AI_PLATFORM_LABELS[item.platform]}
                </Badge>
                <span className="text-[12px] text-muted-foreground">
                  {formatDateVN(item.created_at)}
                </span>
              </div>
              <h3 className="line-clamp-2 font-heading text-[16px] font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="line-clamp-3 text-[14px] text-muted-foreground">
                {item.content}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onSelectContent(item)}
                className="min-h-[44px] rounded-lg px-4"
              >
                <Eye className="h-4 w-4" />
                Xem &amp; Sao chép
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={deletingId === item.id}
                onClick={() => handleDelete(item.id)}
                className="min-h-[44px] rounded-lg px-3 text-spa-error hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
