import { redirect } from "next/navigation";
import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: spa } = await supabase
    .from("spas")
    .select("name, phone")
    .eq("owner_id", user.id)
    .maybeSingle();

  const spaName = spa?.name ?? "Spa của bạn";
  const spaPhone = spa?.phone ?? null;
  const userEmail = user.email ?? "";

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar spaName={spaName} spaPhone={spaPhone} userEmail={userEmail} />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav spaName={spaName} spaPhone={spaPhone} userEmail={userEmail} />
        <main className="flex-1 p-4 pb-24 md:p-6 md:pb-8 lg:p-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
