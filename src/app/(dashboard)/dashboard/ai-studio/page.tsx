import type { Metadata } from "next";
import { getAiStudioPageData } from "@/features/ai-studio/actions";
import { AiStudioView } from "@/features/ai-studio/components/AiStudioView";

export const metadata: Metadata = {
  title: "AI Marketing Studio | SpaFlow AI",
  description:
    "AI viết bài quảng cáo chuẩn SEO và dựng video ngắn tự động cho Spa.",
};

export default async function AiStudioPage() {
  const result = await getAiStudioPageData();
  const services = result.data?.services ?? [];
  const contents = result.data?.contents ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold leading-8 text-foreground">
          AI Content &amp; Video Studio
        </h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          Chọn dịch vụ của Spa để AI tự động viết bài chuẩn SEO, kịch bản
          TikTok và dựng video MP4 từ ảnh thực tế.
        </p>
      </div>

      {result.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-[15px] text-spa-error">
          {result.error}
        </div>
      ) : null}

      <AiStudioView services={services} contents={contents} />
    </div>
  );
}
