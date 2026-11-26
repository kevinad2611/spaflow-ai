import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { logoutAction } from "@/features/auth/actions";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: spa } = await supabase
    .from("spas")
    .select("id, name, phone")
    .eq("owner_id", user.id)
    .maybeSingle();

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card className="rounded-xl border-border bg-card shadow-sm">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="font-heading text-2xl font-bold text-foreground">
                {spa?.name ?? "Spa của bạn"}
              </CardTitle>
              <p className="mt-1 text-[15px] text-muted-foreground">
                Tài khoản: {user.email}
                {spa?.phone ? ` • Hotline: ${spa.phone}` : ""}
              </p>
            </div>
            <form action={logoutAction}>
              <Button
                type="submit"
                variant="outline"
                className="min-h-[44px] rounded-lg px-4 text-[15px]"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </Button>
            </form>
          </CardHeader>
          <CardContent className="text-[15px] leading-6 text-muted-foreground">
            Xác thực và kết nối cơ sở dữ liệu đã sẵn sàng. Giao diện App Shell
            và các trang nghiệp vụ sẽ được xây dựng ở Phase 3 &amp; Phase 4.
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
