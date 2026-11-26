"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveSocialLinksAction } from "@/features/automation/actions";
import {
  socialLinksSchema,
  type SocialLinksValues,
} from "@/features/automation/schemas";
import type { SafePlatformConnection } from "@/features/automation/types";

interface SocialLinksCardProps {
  connections: SafePlatformConnection[];
}

/** Form storing Spa's Facebook, TikTok, YouTube, and Website profile URLs. */
export function SocialLinksCard({ connections }: SocialLinksCardProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const getUrl = (platform: string) =>
    connections.find((c) => c.platform === platform)?.profile_url ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SocialLinksValues>({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: {
      facebook: getUrl("facebook"),
      tiktok: getUrl("tiktok"),
      youtube: getUrl("youtube"),
      website: getUrl("website"),
    },
  });

  async function onSubmit(values: SocialLinksValues) {
    setIsSaving(true);
    const result = await saveSocialLinksAction(values);
    setIsSaving(false);

    if (!result.success) {
      toast.error(result.error ?? "Không thể lưu liên kết.");
      return;
    }

    toast.success("Đã cập nhật các kênh mạng xã hội & website!");
    router.refresh();
  }

  return (
    <Card className="rounded-xl border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-heading text-[18px]">
          <Globe className="h-5 w-5 text-primary" />
          Trang Mạng xã hội &amp; Website của Spa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <div className="space-y-1">
            <Label htmlFor="link-fb">Facebook Fanpage</Label>
            <Input
              id="link-fb"
              placeholder="https://facebook.com/..."
              className="min-h-[44px] rounded-lg"
              {...register("facebook")}
            />
            {errors.facebook ? (
              <p className="text-[12px] text-spa-error">
                {errors.facebook.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1">
            <Label htmlFor="link-tiktok">Kênh TikTok</Label>
            <Input
              id="link-tiktok"
              placeholder="https://tiktok.com/@..."
              className="min-h-[44px] rounded-lg"
              {...register("tiktok")}
            />
            {errors.tiktok ? (
              <p className="text-[12px] text-spa-error">
                {errors.tiktok.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1">
            <Label htmlFor="link-yt">Kênh YouTube</Label>
            <Input
              id="link-yt"
              placeholder="https://youtube.com/@..."
              className="min-h-[44px] rounded-lg"
              {...register("youtube")}
            />
            {errors.youtube ? (
              <p className="text-[12px] text-spa-error">
                {errors.youtube.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1">
            <Label htmlFor="link-web">Website Spa</Label>
            <Input
              id="link-web"
              placeholder="https://ten-spa.vn"
              className="min-h-[44px] rounded-lg"
              {...register("website")}
            />
            {errors.website ? (
              <p className="text-[12px] text-spa-error">
                {errors.website.message}
              </p>
            ) : null}
          </div>

          <div className="sm:col-span-2">
            <Button
              type="submit"
              disabled={isSaving}
              className="min-h-[44px] rounded-lg px-6"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Lưu liên kết kênh"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
