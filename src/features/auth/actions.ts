"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buildDefaultAutomationRules } from "@/features/auth/constants";
import {
  loginSchema,
  registerSchema,
  type LoginFormValues,
  type RegisterFormValues,
} from "@/features/auth/schemas";
import type {
  ActionResult,
  AuthRedirectResult,
} from "@/features/auth/types";

function mapAuthErrorMessage(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials")) {
    return "Email hoặc mật khẩu không chính xác.";
  }
  if (lower.includes("already registered")) {
    return "Email này đã được đăng ký tài khoản.";
  }
  if (lower.includes("email not confirmed")) {
    return "Tài khoản chưa xác thực email. Vui lòng kiểm tra hộp thư của bạn.";
  }
  if (lower.includes("rate limit")) {
    return "Bạn thao tác quá nhanh, vui lòng thử lại sau ít phút.";
  }
  return "Không thể xử lý yêu cầu xác thực. Vui lòng thử lại.";
}

/** Sign in an existing Spa owner with email and password. */
export async function loginAction(
  rawInput: LoginFormValues
): Promise<ActionResult<{ redirectTo: string }>> {
  const parsed = loginSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dữ liệu đăng nhập không hợp lệ.",
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      return { success: false, error: mapAuthErrorMessage(error.message) };
    }

    return { success: true, data: { redirectTo: "/dashboard" } };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Đã có lỗi xảy ra khi đăng nhập.";
    return { success: false, error: message };
  }
}

/** Register a new Spa account and initialize its Spa profile and default automation rules. */
export async function registerAction(
  rawInput: RegisterFormValues
): Promise<ActionResult<AuthRedirectResult>> {
  const parsed = registerSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Dữ liệu đăng ký không hợp lệ.",
    };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: {
          spa_name: parsed.data.spaName,
          phone: parsed.data.phone,
        },
      },
    });

    if (error) {
      return { success: false, error: mapAuthErrorMessage(error.message) };
    }

    if (!data.user) {
      return {
        success: false,
        error: "Không thể tạo tài khoản lúc này. Vui lòng thử lại.",
      };
    }

    if (!data.session) {
      return {
        success: true,
        data: { redirectTo: "/login", requiresEmailConfirmation: true },
      };
    }

    const { data: spa, error: spaError } = await supabase
      .from("spas")
      .insert({
        owner_id: data.user.id,
        name: parsed.data.spaName,
        phone: parsed.data.phone,
      })
      .select("id")
      .single();

    if (spaError || !spa) {
      return {
        success: false,
        error: "Tạo tài khoản thành công nhưng chưa khởi tạo được hồ sơ Spa.",
      };
    }

    const { error: rulesError } = await supabase
      .from("automation_rules")
      .insert(buildDefaultAutomationRules(spa.id));

    if (rulesError) {
      return {
        success: false,
        error: "Đã tạo Spa nhưng chưa khởi tạo được kịch bản nhắc lịch mặc định.",
      };
    }

    return { success: true, data: { redirectTo: "/dashboard" } };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Đã có lỗi xảy ra khi đăng ký.";
    return { success: false, error: message };
  }
}

/** Sign out current user and redirect to login page. */
export async function logoutAction(): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Redirect to login even if signOut encountered a transient issue.
  }
  redirect("/login");
}
