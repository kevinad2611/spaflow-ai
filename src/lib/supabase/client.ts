import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

/** Return validated public Supabase environment variables. */
function getPublicSupabaseEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Thiếu cấu hình NEXT_PUBLIC_SUPABASE_URL hoặc NEXT_PUBLIC_SUPABASE_ANON_KEY trong biến môi trường."
    );
  }

  return { url, anonKey };
}

/** Create a Supabase client for use in Client Components. */
export function createClient() {
  const { url, anonKey } = getPublicSupabaseEnv();
  return createBrowserClient<Database>(url, anonKey);
}
