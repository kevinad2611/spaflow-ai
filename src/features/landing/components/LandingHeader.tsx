import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingHeaderProps {
  isAuthenticated: boolean;
}

/** Sticky top navigation bar for the SpaFlow AI landing page. */
export function LandingHeader({ isAuthenticated }: LandingHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-heading text-xl font-bold text-foreground"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </span>
          <span>SpaFlow AI</span>
        </Link>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {isAuthenticated ? (
            <Button
              asChild
              className="min-h-[44px] rounded-lg px-5 text-[15px] font-medium"
            >
              <Link href="/dashboard">
                Vào trang quản lý
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                className="min-h-[44px] rounded-lg px-4 text-[15px] font-medium"
              >
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button
                asChild
                className="min-h-[44px] rounded-lg px-4 text-[15px] font-medium sm:px-5"
              >
                <Link href="/register">Dùng thử miễn phí</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
