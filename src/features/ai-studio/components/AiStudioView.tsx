"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { History, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AiHistoryList } from "@/features/ai-studio/components/AiHistoryList";
import { AiPostGeneratorCard } from "@/features/ai-studio/components/AiPostGeneratorCard";
import { AiPostPreview } from "@/features/ai-studio/components/AiPostPreview";
import { AiVideoStudioCard } from "@/features/ai-studio/components/AiVideoStudioCard";
import type {
  AiContentRow,
  AiServiceOption,
} from "@/features/ai-studio/types";

interface AiStudioViewProps {
  services: AiServiceOption[];
  contents: AiContentRow[];
}

/** Two-column AI Marketing Studio combining post generation, video rendering, and saved history. */
export function AiStudioView({ services, contents }: AiStudioViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("studio");
  const [activeContent, setActiveContent] = useState<AiContentRow | null>(
    contents[0] ?? null
  );
  const [voiceoverScript, setVoiceoverScript] = useState("");

  function handleGenerated(content: AiContentRow, voiceover: string) {
    setActiveContent(content);
    setVoiceoverScript(voiceover);
    router.refresh();
  }

  function handleSelectFromHistory(content: AiContentRow) {
    setActiveContent(content);
    setActiveTab("studio");
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="space-y-5"
    >
      <TabsList className="grid h-auto w-full max-w-md grid-cols-2 rounded-xl bg-muted p-1">
        <TabsTrigger
          value="studio"
          className="min-h-[44px] gap-2 rounded-lg text-[14px] font-medium"
        >
          <Sparkles className="h-4 w-4" />
          Tạo Bài &amp; Video
        </TabsTrigger>
        <TabsTrigger
          value="history"
          className="min-h-[44px] gap-2 rounded-lg text-[14px] font-medium"
        >
          <History className="h-4 w-4" />
          Đã lưu ({contents.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="studio" className="mt-0">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-5">
            <AiPostGeneratorCard
              services={services}
              onGenerated={handleGenerated}
            />
            <AiVideoStudioCard initialVoiceover={voiceoverScript} />
          </div>

          <div className="lg:col-span-7">
            <AiPostPreview activeContent={activeContent} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="history" className="mt-0">
        <AiHistoryList
          contents={contents}
          onSelectContent={handleSelectFromHistory}
        />
      </TabsContent>
    </Tabs>
  );
}
