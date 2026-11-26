"use server";

import { revalidatePath } from "next/cache";
import {
  emailConnectionSchema,
  socialLinksSchema,
  testMessageSchema,
  updateAutomationRuleSchema,
  zaloConnectionSchema,
  type EmailConnectionValues,
  type SocialLinksValues,
  type TestMessageValues,
  type UpdateAutomationRuleValues,
  type ZaloConnectionValues,
} from "@/features/automation/schemas";
import type {
  AutomationPageData,
  AutomationRuleRow,
  MessageLogItem,
  SafePlatformConnection,
} from "@/features/automation/types";
import { decryptJson, encryptJson } from "@/lib/crypto";
import {
  sendResendEmail,
  type EmailCredentials,
} from "@/lib/integrations/email";
import { sendZaloMessage, type ZaloCredentials } from "@/lib/integrations/zalo";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSpaContext } from "@/lib/supabase/spa";
import type { ActionResult } from "@/types/common";
import type { PlatformType } from "@/types/database.types";

const AUTOMATION_PATH = "/dashboard/automation";

/** Load sanitized platform connections, automation rules, and recent message logs. */
export async function getAutomationPageData(): Promise<
  ActionResult<AutomationPageData>
> {
  try {
    const context = await getCurrentSpaContext();
    if (context.error || !context.data) {
      return { success: false, error: context.error ?? "Chưa xác thực Spa." };
    }

    const supabase = await createClient();
    const spaId = context.data.spaId;

    const [connectionsRes, rulesRes, logsRes] = await Promise.all([
      supabase
        .from("platform_connections")
        .select("id, platform, is_connected, profile_url, updated_at")
        .eq("spa_id", spaId),
      supabase
        .from("automation_rules")
        .select("*")
        .eq("spa_id", spaId)
        .order("trigger_type", { ascending: true }),
      supabase
        .from("message_logs")
        .select(
          "id, channel, status, error_message, sent_at, customer:customers(full_name, phone), rule:automation_rules(trigger_type)"
        )
        .eq("spa_id", spaId)
        .order("sent_at", { ascending: false })
        .limit(30),
    ]);

    if (connectionsRes.error || rulesRes.error || logsRes.error) {
      return {
        success: false,
        error: "Không thể tải dữ liệu kết nối và chăm sóc tự động.",
      };
    }

    return {
      success: true,
      data: {
        connections: (connectionsRes.data ?? []) as SafePlatformConnection[],
        rules: (rulesRes.data ?? []) as AutomationRuleRow[],
        logs: (logsRes.data ?? []) as MessageLogItem[],
      },
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi hệ thống khi tải cài đặt.";
    return { success: false, error: message };
  }
}

/** Encrypt and save Zalo OA credentials for the current Spa. */
export async function saveZaloConnectionAction(
  rawInput: ZaloConnectionValues
): Promise<ActionResult> {
  const parsed = zaloConnectionSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Thông tin Zalo OA không hợp lệ.",
    };
  }

  try {
    const context = await getCurrentSpaContext();
    if (context.error || !context.data) {
      return { success: false, error: context.error ?? "Chưa xác thực Spa." };
    }

    const encrypted = encryptJson<ZaloCredentials>({
      appId: parsed.data.appId,
      secretKey: parsed.data.secretKey,
      refreshToken: parsed.data.refreshToken,
      templateId: parsed.data.templateId || undefined,
    });

    const supabase = await createClient();
    const { error } = await supabase.from("platform_connections").upsert(
      {
        spa_id: context.data.spaId,
        platform: "zalo_oa",
        is_connected: true,
        credentials_encrypted: encrypted,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "spa_id,platform" }
    );

    if (error) {
      return { success: false, error: "Không thể lưu cấu hình Zalo OA." };
    }

    revalidatePath(AUTOMATION_PATH);
    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi mã hóa khi lưu Zalo OA.";
    return { success: false, error: message };
  }
}

/** Encrypt and save Resend Email credentials for the current Spa. */
export async function saveEmailConnectionAction(
  rawInput: EmailConnectionValues
): Promise<ActionResult> {
  const parsed = emailConnectionSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Thông tin Email không hợp lệ.",
    };
  }

  try {
    const context = await getCurrentSpaContext();
    if (context.error || !context.data) {
      return { success: false, error: context.error ?? "Chưa xác thực Spa." };
    }

    const encrypted = encryptJson<EmailCredentials>({
      apiKey: parsed.data.apiKey,
      fromEmail: parsed.data.fromEmail || undefined,
      fromName: parsed.data.fromName || context.data.spaName,
    });

    const supabase = await createClient();
    const { error } = await supabase.from("platform_connections").upsert(
      {
        spa_id: context.data.spaId,
        platform: "email",
        is_connected: true,
        credentials_encrypted: encrypted,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "spa_id,platform" }
    );

    if (error) {
      return { success: false, error: "Không thể lưu cấu hình Email." };
    }

    revalidatePath(AUTOMATION_PATH);
    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi mã hóa khi lưu Email.";
    return { success: false, error: message };
  }
}

/** Save Social Media and Website profile URLs for the current Spa. */
export async function saveSocialLinksAction(
  rawInput: SocialLinksValues
): Promise<ActionResult> {
  const parsed = socialLinksSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Đường dẫn không hợp lệ.",
    };
  }

  try {
    const context = await getCurrentSpaContext();
    if (context.error || !context.data) {
      return { success: false, error: context.error ?? "Chưa xác thực Spa." };
    }

    const entries: { platform: PlatformType; url: string }[] = [
      { platform: "facebook", url: parsed.data.facebook },
      { platform: "tiktok", url: parsed.data.tiktok },
      { platform: "youtube", url: parsed.data.youtube },
      { platform: "website", url: parsed.data.website },
    ];

    const supabase = await createClient();
    const { error } = await supabase.from("platform_connections").upsert(
      entries.map((item) => ({
        spa_id: context.data.spaId,
        platform: item.platform,
        is_connected: item.url.length > 0,
        profile_url: item.url || null,
        updated_at: new Date().toISOString(),
      })),
      { onConflict: "spa_id,platform" }
    );

    if (error) {
      return { success: false, error: "Không thể lưu liên kết mạng xã hội." };
    }

    revalidatePath(AUTOMATION_PATH);
    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi hệ thống khi lưu liên kết.";
    return { success: false, error: message };
  }
}

/** Send an immediate test message using stored Zalo OA or Email credentials. */
export async function sendTestMessageAction(
  rawInput: TestMessageValues
): Promise<ActionResult> {
  const parsed = testMessageSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Thông tin test không hợp lệ.",
    };
  }

  try {
    const context = await getCurrentSpaContext();
    if (context.error || !context.data) {
      return { success: false, error: context.error ?? "Chưa xác thực Spa." };
    }

    const platform: PlatformType =
      parsed.data.channel === "zalo" ? "zalo_oa" : "email";
    const supabase = await createClient();
    const { data: conn } = await supabase
      .from("platform_connections")
      .select("credentials_encrypted")
      .eq("spa_id", context.data.spaId)
      .eq("platform", platform)
      .maybeSingle();

    if (!conn?.credentials_encrypted) {
      return {
        success: false,
        error:
          parsed.data.channel === "zalo"
            ? "Bạn chưa lưu cấu hình kết nối Zalo OA."
            : "Bạn chưa lưu cấu hình kết nối Email (Resend).",
      };
    }

    if (parsed.data.channel === "zalo") {
      const creds = decryptJson<ZaloCredentials>(conn.credentials_encrypted);
      const res = await sendZaloMessage({
        credentials: creds,
        phone: parsed.data.recipient,
        message: `[SpaFlow AI] Tin nhắn kiểm tra kết nối từ ${context.data.spaName}.`,
        templateData: {
          customer_name: "Quản lý Spa",
          spa_name: context.data.spaName,
        },
      });
      return { success: res.success, error: res.error };
    }

    const emailCreds = decryptJson<EmailCredentials>(
      conn.credentials_encrypted
    );
    const res = await sendResendEmail({
      credentials: emailCreds,
      to: parsed.data.recipient,
      subject: `[Test kết nối] ${context.data.spaName} - SpaFlow AI`,
      text: `Xin chào, đây là email kiểm tra kết nối tự động từ hệ thống SpaFlow AI cho ${context.data.spaName}.`,
    });
    return { success: res.success, error: res.error };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi khi gửi tin nhắn kiểm tra.";
    return { success: false, error: message };
  }
}

/** Update an automation rule's active toggle, delivery channel, and template text. */
export async function updateAutomationRuleAction(
  rawInput: UpdateAutomationRuleValues
): Promise<ActionResult> {
  const parsed = updateAutomationRuleSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dữ liệu kịch bản không hợp lệ.",
    };
  }

  try {
    const context = await getCurrentSpaContext();
    if (context.error || !context.data) {
      return { success: false, error: context.error ?? "Chưa xác thực Spa." };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("automation_rules")
      .update({
        channel: parsed.data.channel,
        template_content: parsed.data.template_content,
        is_active: parsed.data.is_active,
      })
      .eq("id", parsed.data.id)
      .eq("spa_id", context.data.spaId);

    if (error) {
      return { success: false, error: "Không thể cập nhật kịch bản chăm sóc." };
    }

    revalidatePath(AUTOMATION_PATH);
    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi hệ thống khi cập nhật kịch bản.";
    return { success: false, error: message };
  }
}
