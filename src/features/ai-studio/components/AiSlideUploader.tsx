"use client";

import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AiSlideUploaderProps {
  files: File[];
  captions: string[];
  onFilesChange: (files: File[]) => void;
  onCaptionChange: (index: number, value: string) => void;
}

/** Multi-image uploader (3-5 Spa photos) with per-slide Vietnamese caption inputs. */
export function AiSlideUploader({
  files,
  captions,
  onFilesChange,
  onCaptionChange,
}: AiSlideUploaderProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="video-images">Tải lên 3–5 ảnh tại Spa *</Label>
        <label
          htmlFor="video-images"
          className="flex min-h-[52px] cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background/60 px-4 py-3 text-[14px] font-medium text-primary hover:bg-secondary/50"
        >
          <Upload className="h-4 w-4" />
          {files.length > 0
            ? `Đã chọn ${files.length} ảnh (bấm để chọn lại)`
            : "Chọn 3–5 ảnh liệu trình tại Spa"}
        </label>
        <input
          id="video-images"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const selected = Array.from(e.target.files ?? []).slice(0, 5);
            onFilesChange(selected);
          }}
          className="sr-only"
        />
      </div>

      {files.length > 0 ? (
        <div className="space-y-2">
          {files.map((file, idx) => (
            <Input
              key={`${file.name}-${idx}`}
              value={captions[idx] ?? ""}
              onChange={(e) => onCaptionChange(idx, e.target.value)}
              placeholder={`Chữ hiển thị trên ảnh ${idx + 1}`}
              className="min-h-[44px] rounded-lg text-[14px]"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
