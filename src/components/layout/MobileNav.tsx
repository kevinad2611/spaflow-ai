"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, Sparkles, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { logoutAction } from "@/features/auth/actions";
import { cn } from "@/lib/utils";
import {
  DASHBOARD_NAV_ITEMS,
  isNavItemActive,
} from "@/components/layout/nav-items";

interface MobileNavProps {
  spaName: string;
  spaPhone: string | null;
  userEmail: string;
}

/** Mobile top header + bottom navigation bar (< 768px) with expandable Sheet menu. */
export function MobileNav({ spaName, spaPhone, userEmail }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const primaryTabs = DASHBOARD_NAV_ITEMS.filter(
    (item) => item.showInMobileBar
  );

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card px-4 md:hidden">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-heading text-base font-bold text-foreground"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="truncate max-w-[200px]">{spaName}</span>
        </Link>
      </header>

      <nav
        aria-label="Điều hướng di động"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card md:hidden"
      >
        <div className="grid grid-cols-5 items-center px-1 py-1">
          {primaryTabs.map((item) => {
            const Icon = item.icon;
            const active = isNavItemActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-lg px-1 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{item.shortLabel}</span>
              </Link>
            );
          })}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-lg px-1 text-[11px] font-medium text-muted-foreground"
              >
                <Menu className="h-5 w-5 shrink-0" />
                <span>Mở rộng</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[290px] bg-card p-0">
              <SheetHeader className="border-b border-border p-5 text-left">
                <SheetTitle className="flex items-center gap-2 font-heading text-lg">
                  <Store className="h-5 w-5 text-primary" />
                  <span className="truncate">{spaName}</span>
                </SheetTitle>
                <p className="truncate text-[13px] text-muted-foreground">
                  {spaPhone ?? userEmail}
                </p>
              </SheetHeader>

              <div className="space-y-1.5 p-3">
                {DASHBOARD_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = isNavItemActive(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex min-h-[44px] items-center gap-3 rounded-lg px-3.5 py-2.5 text-[15px] font-medium transition-colors",
                        active
                          ? "bg-secondary text-secondary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-border p-3">
                <form action={logoutAction}>
                  <Button
                    type="submit"
                    variant="ghost"
                    className="min-h-[44px] w-full justify-start gap-3 rounded-lg px-3.5 text-[15px] font-medium text-spa-error hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5 shrink-0" />
                    <span>Đăng xuất</span>
                  </Button>
                </form>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
}
