import { createClient } from "@/lib/supabase/server";

export interface SpaContext {
  userId: string;
  spaId: string;
  spaName: string;
}

/** Resolve authenticated user and their Spa tenant record on the server. */
export async function getCurrentSpaContext(): Promise<
  { data: SpaContext; error?: never } | { data?: never; error: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." };
  }

  const { data: spa, error: spaError } = await supabase
    .from("spas")
    .select("id, name")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (spaError || !spa) {
    return { error: "Không tìm thấy thông tin Spa cho tài khoản hiện tại." };
  }

  return {
    data: {
      userId: user.id,
      spaId: spa.id,
      spaName: spa.name,
    },
  };
}
