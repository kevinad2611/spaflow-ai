"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveZaloConnectionAction } from "@/features/automation/actions";
import { TestMessageBar } from "@/features/automation/components/TestMessageBar";
import {
  zaloConnectionSchema,
  type ZaloConnectionValues,
} from "@/features/automation/schemas";

interface ZaloConnectionCardProps {
  isConnected: boolean;
}

/** Zalo OA connection form with encrypted credential storage and instant test message. */
export function ZaloConnectionCard({ isConnected }: ZaloConnectionCardProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ZaloConnectionValues>({
    resolver: zodResolver(zaloConnectionSchema),
    defaultValues: {
      appId: "",
      secretKey: "",
      refreshToken: "",
      templateId: "",
    },
  });

  async function onSubmit(values: ZaloConnectionValues) {
    setIsSaving(true);
    const result = await saveZaloConnectionAction(values);
    setIsSaving(false);

    if (!result.success) {
      toast.error(result.error ?? "Không thể lưu kết nối Zalo OA.");
      return;
    }

    toast.success("Đã mã hóa và lưu kết nối Zalo OA!");
    router.refresh();
  }

  return (
    <Card className="rounded-xl border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <CardTitle className="font-heading text-[18px]">
            Zalo OA / ZNS
          </CardTitle>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Dùng để gửi tin nhắn nhắc lịch tự động tới Zalo của khách.
          </p>
        </div>
        <Badge variant={isConnected ? "secondary" : "outline"}>
          {isConnected ? (
            <span className="inline-flex items-center gap-1 text-spa-success">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Đã kết nối
            </span>
          ) : (
            "Chưa kết nối"
          )}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="zalo-app-id">App ID *</Label>
              <Input
                id="zalo-app-id"
                placeholder="Nhập Zalo App ID"
                className="min-h-[44px] rounded-lg"
                {...register("appId")}
              />
              {errors.appId ? (
                <p className="text-[12px] text-spa-error">
                  {errors.appId.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-1">
              <Label htmlFor="zalo-template-id">Template ID (ZNS)</Label>
              <Input
                id="zalo-template-id"
                placeholder="VD: 312456"
                className="min-h-[44px] rounded-lg"
                {...register("templateId")}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="zalo-secret">Secret Key *</Label>
            <Input
              id="zalo-secret"
              type="password"
              placeholder="Nhập Secret Key mới để lưu hoặc cập nhật"
              className="min-h-[44px] rounded-lg"
              {...register("secretKey")}
            />
            {errors.secretKey ? (
              <p className="text-[12px] text-spa-error">
                {errors.secretKey.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1">
            <Label htmlFor="zalo-refresh">Refresh Token *</Label>
            <Input
              id="zalo-refresh"
              type="password"
              placeholder="Nhập Refresh Token Zalo OA"
              className="min-h-[44px] rounded-lg"
              {...register("refreshToken")}
            />
            {errors.refreshToken ? (
              <p className="text-[12px] text-spa-error">
                {errors.refreshToken.message}
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            disabled={isSaving}
            className="min-h-[44px] w-full rounded-lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang lưu cấu hình...
              </>
            ) : (
              "Lưu kết nối Zalo OA"
            )}
          </Button>
        </form>

        <TestMessageBar
          channel="zalo"
          label="Gửi tin nhắn test Zalo"
          placeholder="SĐT nhận test (0901234567)"
        />
      </CardContent>
    </Card>
  );
}
