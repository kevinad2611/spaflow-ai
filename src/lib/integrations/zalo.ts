import type { ActionResult } from "@/types/common";

export interface ZaloCredentials {
  appId: string;
  secretKey: string;
  refreshToken: string;
  templateId?: string;
}

interface ZaloOAuthResponse {
  access_token?: string;
  error?: number;
  error_description?: string;
}

interface ZaloZnsResponse {
  error?: number;
  message?: string;
  data?: {
    msg_id?: string;
  };
}

/** Normalize a Vietnamese phone number into 84xxxxxxxxx format for Zalo ZNS. */
export function normalizeZaloPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    return `84${digits.slice(1)}`;
  }
  return digits;
}

/** Send a Zalo ZNS message via Zalo OA v3 API using OAuth refresh token exchange. */
export async function sendZaloMessage(params: {
  credentials: ZaloCredentials;
  phone: string;
  message: string;
  templateData?: Record<string, string>;
}): Promise<ActionResult<{ messageId?: string }>> {
  try {
    const tokenBody = new URLSearchParams({
      refresh_token: params.credentials.refreshToken,
      app_id: params.credentials.appId,
      grant_type: "refresh_token",
    });

    const tokenRes = await fetch("https://oauth.zaloapp.com/v4/oa/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        secret_key: params.credentials.secretKey,
      },
      body: tokenBody.toString(),
    });

    const tokenJson = (await tokenRes.json()) as ZaloOAuthResponse;
    if (!tokenRes.ok || !tokenJson.access_token) {
      return {
        success: false,
        error:
          tokenJson.error_description ??
          "Không lấy được Access Token từ Zalo OA. Vui lòng kiểm tra App ID / Secret Key / Refresh Token.",
      };
    }

    if (!params.credentials.templateId) {
      return {
        success: false,
        error:
          "Kết nối Zalo OA hợp lệ nhưng chưa cấu hình Template ID để gửi tin ZNS.",
      };
    }

    const znsRes = await fetch(
      "https://business.openapi.zalo.me/message/template",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_token: tokenJson.access_token,
        },
        body: JSON.stringify({
          phone: normalizeZaloPhone(params.phone),
          template_id: params.credentials.templateId,
          template_data: params.templateData ?? { content: params.message },
          tracking_id: `spaflow_${Date.now()}`,
        }),
      }
    );

    const znsJson = (await znsRes.json()) as ZaloZnsResponse;
    if (!znsRes.ok || (znsJson.error !== undefined && znsJson.error !== 0)) {
      return {
        success: false,
        error: znsJson.message ?? "Zalo ZNS từ chối gửi tin nhắn.",
      };
    }

    return {
      success: true,
      data: { messageId: znsJson.data?.msg_id },
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi kết nối tới Zalo OA API.";
    return { success: false, error: message };
  }
}
