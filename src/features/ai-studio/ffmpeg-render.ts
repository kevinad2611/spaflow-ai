import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

const VIDEO_WIDTH = 720;
const VIDEO_HEIGHT = 1280;
const FFMPEG_CORE_BASE = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

let ffmpegInstance: FFmpeg | null = null;

async function getLoadedFfmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance && ffmpegInstance.loaded) {
    return ffmpegInstance;
  }

  const ffmpeg = new FFmpeg();
  await ffmpeg.load({
    coreURL: await toBlobURL(
      `${FFMPEG_CORE_BASE}/ffmpeg-core.js`,
      "text/javascript"
    ),
    wasmURL: await toBlobURL(
      `${FFMPEG_CORE_BASE}/ffmpeg-core.wasm`,
      "application/wasm"
    ),
  });
  ffmpegInstance = ffmpeg;
  return ffmpeg;
}

function wrapVietnameseText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

/** Render an uploaded image with Vietnamese caption overlay onto a 720x1280 PNG frame. */
async function renderSlideFramePng(
  file: File,
  caption: string
): Promise<Uint8Array> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = VIDEO_WIDTH;
  canvas.height = VIDEO_HEIGHT;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    bitmap.close();
    throw new Error("Trình duyệt không hỗ trợ Canvas 2D.");
  }

  ctx.fillStyle = "#0F172A";
  ctx.fillRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);

  const scale = Math.max(
    VIDEO_WIDTH / bitmap.width,
    VIDEO_HEIGHT / bitmap.height
  );
  const drawW = bitmap.width * scale;
  const drawH = bitmap.height * scale;
  const drawX = (VIDEO_WIDTH - drawW) / 2;
  const drawY = (VIDEO_HEIGHT - drawH) / 2;
  ctx.drawImage(bitmap, drawX, drawY, drawW, drawH);
  bitmap.close();

  if (caption.trim()) {
    const gradient = ctx.createLinearGradient(0, VIDEO_HEIGHT - 340, 0, VIDEO_HEIGHT);
    gradient.addColorStop(0, "rgba(15, 23, 42, 0)");
    gradient.addColorStop(1, "rgba(15, 23, 42, 0.86)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, VIDEO_HEIGHT - 340, VIDEO_WIDTH, 340);

    ctx.font = "bold 34px sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";

    const lines = wrapVietnameseText(ctx, caption, VIDEO_WIDTH - 96);
    const startY = VIDEO_HEIGHT - 110 - (lines.length - 1) * 46;
    lines.forEach((line, index) => {
      ctx.fillText(line, VIDEO_WIDTH / 2, startY + index * 46);
    });
  }

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Không xuất được khung hình."))),
      "image/png"
    );
  });

  return new Uint8Array(await blob.arrayBuffer());
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/** Combine 3-5 Spa images and optional Vietnamese TTS MP3 audio into an MP4 video client-side. */
export async function renderSpaSlideshowVideo(params: {
  files: File[];
  captions: string[];
  audioBase64?: string | null;
  onProgress?: (percent: number) => void;
}): Promise<Blob> {
  const ffmpeg = await getLoadedFfmpeg();
  const progressHandler = ({ progress }: { progress: number }) => {
    params.onProgress?.(Math.min(100, Math.round(progress * 100)));
  };
  ffmpeg.on("progress", progressHandler);

  try {
    const slideDuration = 3.5;
    const concatLines: string[] = [];

    for (let i = 0; i < params.files.length; i += 1) {
      const file = params.files[i];
      if (!file) continue;
      const caption = params.captions[i] ?? "";
      const frameBytes = await renderSlideFramePng(file, caption);
      const fileName = `slide_${i}.png`;
      await ffmpeg.writeFile(fileName, frameBytes);
      concatLines.push(`file '${fileName}'`);
      concatLines.push(`duration ${slideDuration}`);
    }

    const lastIdx = params.files.length - 1;
    if (lastIdx >= 0) {
      concatLines.push(`file 'slide_${lastIdx}.png'`);
    }

    await ffmpeg.writeFile(
      "concat.txt",
      new TextEncoder().encode(concatLines.join("\n"))
    );

    const args = ["-f", "concat", "-safe", "0", "-i", "concat.txt"];
    if (params.audioBase64) {
      await ffmpeg.writeFile("voice.mp3", base64ToUint8Array(params.audioBase64));
      args.push("-i", "voice.mp3", "-c:a", "aac", "-shortest");
    }

    args.push(
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-r",
      "25",
      "output.mp4"
    );

    await ffmpeg.exec(args);
    const outputData = await ffmpeg.readFile("output.mp4");
    if (typeof outputData === "string") {
      throw new Error("Dữ liệu video đầu ra không hợp lệ.");
    }

    return new Blob([new Uint8Array(outputData)], { type: "video/mp4" });
  } finally {
    ffmpeg.off("progress", progressHandler);
  }
}
