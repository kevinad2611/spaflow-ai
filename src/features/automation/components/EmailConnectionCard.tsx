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
import { saveEmailConnectionAction } from "@/features/automation/actions";
import { TestMessageBar } from "@/features/automation/components/TestMessageBar";
import {
  emailConnectionSchema,
  type EmailConnectionValues,
} from "@/features/automation/schemas";

interface EmailConnectionCardProps {
  isConnected: boolean;
}

/** Resend Email connection form with encrypted API key storage and instant test send. */
export function EmailConnectionCard({ isConnected }: EmailConnectionCardProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailConnectionValues>({
    resolver: zodResolver(emailConnectionSchema),
    defaultValues: { apiKey: "", fromEmail: "", fromName: "" },
  });

  async function onSubmit(values: EmailConnectionValues) {
    setIsSaving(true);
    const result = await saveEmailConnectionAction(values);
    setIsSaving(false);

    if (!result.success) {
      toast.error(result.error ?? "Không thể lưu kết nối Email.");
      return;
    }

    toast.success("Đã mã hóa và lưu kết nối Email!");
    router.refresh();
  }

  return (
    <Card className="rounded-xl border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <CardTitle className="font-heading text-[18px]">
            Email (Resend)
          </CardTitle>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Kênh dự phòng hoặc gửi song song khi khách có địa chỉ Email.
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
          <div className="space-y-1">
            <Label htmlFor="resend-key">Resend API Key *</Label>
            <Input
              id="resend-key"
              type="password"
              placeholder="re_xxxxxxxx..."
              className="min-h-[44px] rounded-lg"
              {...register("apiKey")}
            />
            {errors.apiKey ? (
              <p className="text-[12px] text-spa-error">
                {errors.apiKey.message}
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="email-from">Email người gửi</Label>
              <Input
                id="email-from"
                type="email"
                placeholder="cskh@ten-spa.vn"
                className="min-h-[44px] rounded-lg"
                {...register("fromEmail")}
              />
              {errors.fromEmail ? (
                <p className="text-[12px] text-spa-error">
                  {errors.fromEmail.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-1">
              <Label htmlFor="email-name">Tên hiển thị</Label>
              <Input
                id="email-name"
                placeholder="VD: Lan Anh Spa"
                className="min-h-[44px] rounded-lg"
                {...register("fromName")}
              />
            </div>
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
              "Lưu kết nối Email"
            )}
          </Button>
        </form>

        <TestMessageBar
          channel="email"
          label="Gửi email kiểm tra"
          placeholder="nhanvien@gmail.com"
        />
      </CardContent>
    </Card>
  );
}
