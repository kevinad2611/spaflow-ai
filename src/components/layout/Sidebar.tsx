"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Sparkles, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/auth/actions";
import { cn } from "@/lib/utils";
import {
  DASHBOARD_NAV_ITEMS,
  isNavItemActive,
} from "@/components/layout/nav-items";

interface SidebarProps {
  spaName: string;
  spaPhone: string | null;
  userEmail: string;
}

/** Fixed 260px desktop navigation sidebar for the SpaFlow AI App Shell. */
export function Sidebar({ spaName, spaPhone, userEmail }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[260px] shrink-0 flex-col border-r border-border bg-card md:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-5 w-5" />
        </span>
        <span className="font-heading text-lg font-bold text-foreground">
          SpaFlow AI
        </span>
      </div>

      <div className="border-b border-border px-4 py-3.5">
        <div className="flex items-start gap-2.5 rounded-xl bg-secondary/70 p-3">
          <Store className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="truncate font-heading text-[15px] font-semibold text-foreground">
              {spaName}
            </p>
            <p className="truncate text-[13px] text-muted-foreground">
              {spaPhone ?? userEmail}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 px-3 py-4" aria-label="Menu chính">
        {DASHBOARD_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isNavItemActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[44px] items-center gap-3 rounded-lg px-3.5 py-2.5 text-[15px] font-medium transition-colors",
                active
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <form action={logoutAction}>
          <Button
            type="submit"
            variant="ghost"
            className="min-h-[44px] w-full justify-start gap-3 rounded-lg px-3.5 text-[15px] font-medium text-muted-foreground hover:bg-red-50 hover:text-spa-error"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Đăng xuất</span>
          </Button>
        </form>
      </div>
    </aside>
  );
}
