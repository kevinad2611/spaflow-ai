import type { Metadata } from "next";
import { BellRing, History, Link2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAutomationPageData } from "@/features/automation/actions";
import { AutomationRulesCard } from "@/features/automation/components/AutomationRulesCard";
import { EmailConnectionCard } from "@/features/automation/components/EmailConnectionCard";
import { MessageLogsTable } from "@/features/automation/components/MessageLogsTable";
import { SocialLinksCard } from "@/features/automation/components/SocialLinksCard";
import { ZaloConnectionCard } from "@/features/automation/components/ZaloConnectionCard";

export const metadata: Metadata = {
  title: "Chăm sóc tự động | SpaFlow AI",
  description:
    "Kết nối Zalo OA, Email, mạng xã hội và cấu hình kịch bản nhắc lịch tự động.",
};

export default async function AutomationPage() {
  const result = await getAutomationPageData();
  const connections = result.data?.connections ?? [];
  const rules = result.data?.rules ?? [];
  const logs = result.data?.logs ?? [];

  const isZaloConnected = connections.some(
    (c) => c.platform === "zalo_oa" && c.is_connected
  );
  const isEmailConnected = connections.some(
    (c) => c.platform === "email" && c.is_connected
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold leading-8 text-foreground">
          Kết nối &amp; Chăm sóc tự động
        </h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          Thiết lập Zalo OA, Email và kịch bản tự động nhắn nhắc lịch cho
          khách hàng.
        </p>
      </div>

      {result.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-[15px] text-spa-error">
          {result.error}
        </div>
      ) : null}

      <Tabs defaultValue="connections" className="space-y-5">
        <TabsList className="grid h-auto w-full max-w-2xl grid-cols-1 gap-1 rounded-xl bg-muted p-1 sm:grid-cols-3">
          <TabsTrigger
            value="connections"
            className="min-h-[44px] gap-2 rounded-lg text-[14px] font-medium"
          >
            <Link2 className="h-4 w-4" />
            Cài đặt Kết nối
          </TabsTrigger>
          <TabsTrigger
            value="rules"
            className="min-h-[44px] gap-2 rounded-lg text-[14px] font-medium"
          >
            <BellRing className="h-4 w-4" />
            Kịch bản tự động ({rules.length})
          </TabsTrigger>
          <TabsTrigger
            value="logs"
            className="min-h-[44px] gap-2 rounded-lg text-[14px] font-medium"
          >
            <History className="h-4 w-4" />
            Lịch sử gửi tin ({logs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="mt-0 space-y-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <ZaloConnectionCard isConnected={isZaloConnected} />
            <EmailConnectionCard isConnected={isEmailConnected} />
          </div>
          <SocialLinksCard connections={connections} />
        </TabsContent>

        <TabsContent value="rules" className="mt-0">
          <AutomationRulesCard rules={rules} />
        </TabsContent>

        <TabsContent value="logs" className="mt-0">
          <MessageLogsTable logs={logs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
