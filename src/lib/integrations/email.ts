import type { ActionResult } from "@/types/common";

export interface EmailCredentials {
  apiKey: string;
  fromEmail?: string;
  fromName?: string;
}

interface ResendApiResponse {
  id?: string;
  message?: string;
}

/** Send a transactional email through Resend REST API. */
export async function sendResendEmail(params: {
  credentials: EmailCredentials;
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<ActionResult<{ id?: string }>> {
  try {
    const senderEmail =
      params.credentials.fromEmail?.trim() || "onboarding@resend.dev";
    const senderName = params.credentials.fromName?.trim() || "SpaFlow AI";
    const fromHeader = `${senderName} <${senderEmail}>`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.credentials.apiKey}`,
      },
      body: JSON.stringify({
        from: fromHeader,
        to: [params.to],
        subject: params.subject,
        text: params.text,
        html:
          params.html ??
          `<div style="font-family:sans-serif;line-height:1.6;color:#0f172a"><p>${params.text.replace(/\n/g, "<br/>")}</p></div>`,
      }),
    });

    const data = (await response.json()) as ResendApiResponse;
    if (!response.ok) {
      return {
        success: false,
        error:
          data.message ??
          "Resend API từ chối gửi email. Vui lòng kiểm tra API Key hoặc địa chỉ người gửi.",
      };
    }

    return { success: true, data: { id: data.id } };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Lỗi kết nối tới Resend Email API.";
    return { success: false, error: message };
  }
}
