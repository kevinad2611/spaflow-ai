"use client";

import { useEffect, useState } from "react";
import { Clapperboard, Download, Loader2, Mic } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AiSlideUploader } from "@/features/ai-studio/components/AiSlideUploader";
import { renderSpaSlideshowVideo } from "@/features/ai-studio/ffmpeg-render";

interface AiVideoStudioCardProps {
  initialVoiceover: string;
}

/** Client-side FFmpeg slideshow + Vietnamese voiceover MP4 generator. */
export function AiVideoStudioCard({
  initialVoiceover,
}: AiVideoStudioCardProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);
  const [voiceover, setVoiceover] = useState(initialVoiceover);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialVoiceover) {
      setVoiceover(initialVoiceover);
    }
  }, [initialVoiceover]);

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  function handleFilesSelected(selected: File[]) {
    setFiles(selected);
    setCaptions(selected.map((_, idx) => `Bước ${idx + 1} tại Spa`));
  }

  function handleCaptionChange(index: number, value: string) {
    setCaptions((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  async function handleGenerateTts() {
    setIsGeneratingAudio(true);
    try {
      const response = await fetch("/api/ai/generate-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: voiceover }),
      });
      const json = (await response.json()) as {
        success: boolean;
        error?: string;
        data?: { audioBase64: string };
      };

      if (!response.ok || !json.success || !json.data) {
        toast.error(json.error ?? "Không thể tạo giọng đọc tiếng Việt.");
        return;
      }

      setAudioBase64(json.data.audioBase64);
      toast.success("Đã tạo giọng đọc tiếng Việt thành công!");
    } catch {
      toast.error("Lỗi kết nối khi tạo giọng đọc TTS.");
    } finally {
      setIsGeneratingAudio(false);
    }
  }

  async function handleRenderVideo() {
    if (files.length < 3) {
      toast.error("Vui lòng chọn từ 3 đến 5 ảnh thực tế tại Spa.");
      return;
    }

    setIsRendering(true);
    setProgress(0);
    try {
      const blob = await renderSpaSlideshowVideo({
        files,
        captions,
        audioBase64,
        onProgress: setProgress,
      });
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      setVideoUrl(URL.createObjectURL(blob));
      toast.success("Xuất video MP4 thành công!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Không thể dựng video MP4.";
      toast.error(message);
    } finally {
      setIsRendering(false);
    }
  }

  return (
    <Card className="rounded-xl border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-heading text-[18px]">
          <Clapperboard className="h-5 w-5 text-primary" />
          2. Dựng Video ngắn MP4 (3–5 ảnh + Giọng đọc)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AiSlideUploader
          files={files}
          captions={captions}
          onFilesChange={handleFilesSelected}
          onCaptionChange={handleCaptionChange}
        />

        <div className="space-y-1.5">
          <Label htmlFor="voiceover-text">Lời bình giọng đọc tiếng Việt</Label>
          <Textarea
            id="voiceover-text"
            rows={3}
            value={voiceover}
            onChange={(e) => setVoiceover(e.target.value)}
            placeholder="Nhập lời bình hoặc tạo tự động từ mục 1..."
            className="rounded-lg text-[14px]"
          />
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            disabled={isGeneratingAudio}
            onClick={handleGenerateTts}
            className="min-h-[44px] flex-1 rounded-lg"
          >
            {isGeneratingAudio ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mic className="h-4 w-4 text-primary" />
            )}
            {isGeneratingAudio ? "Đang tạo giọng đọc..." : "Tạo giọng đọc AI"}
          </Button>

          <Button
            type="button"
            disabled={isRendering || files.length < 3}
            onClick={handleRenderVideo}
            className="min-h-[44px] flex-1 rounded-lg"
          >
            {isRendering ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Clapperboard className="h-4 w-4" />
            )}
            {isRendering ? `Đang xuất (${progress}%)` : "Xuất Video MP4"}
          </Button>
        </div>

        {audioBase64 ? (
          <audio
            controls
            src={`data:audio/mpeg;base64,${audioBase64}`}
            className="w-full"
          />
        ) : null}

        {videoUrl ? (
          <div className="space-y-3 rounded-xl border border-border bg-background/60 p-3">
            <video
              controls
              src={videoUrl}
              className="mx-auto max-h-[360px] rounded-lg"
            />
            <Button asChild className="min-h-[44px] w-full rounded-lg">
              <a href={videoUrl} download="spaflow-video.mp4">
                <Download className="h-4 w-4" />
                Tải Video MP4 về máy
              </a>
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
