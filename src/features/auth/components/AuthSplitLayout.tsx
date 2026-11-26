import Link from "next/link";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface AuthSplitLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const SPA_BENEFITS = [
  "Quản lý lịch hẹn và kỹ thuật viên chỉ trên 1 màn hình",
  "Tự động nhắc lịch trước 24h & 2h qua Zalo ZNS, Email",
  "AI tự viết bài quảng cáo và kịch bản video cho Spa",
];

/** Two-column desktop / single-column mobile auth layout per UI_UX_SPEC.md. */
export function AuthSplitLayout({
  title,
  subtitle,
  children,
}: AuthSplitLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
      <div className="flex flex-col justify-center px-5 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-heading text-xl font-bold text-primary"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </span>
            SpaFlow AI
          </Link>

          <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <h1 className="font-heading text-2xl font-bold leading-8 text-foreground">
              {title}
            </h1>
            <p className="mt-1.5 text-[15px] leading-6 text-muted-foreground">
              {subtitle}
            </p>
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>

      <div className="hidden flex-col justify-between bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-700 p-12 text-white lg:flex">
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-[13px] font-medium backdrop-blur-sm">
          <Sparkles className="h-4 w-4 text-amber-300" />
          Trợ lý vận hành dành riêng cho chủ Spa
        </div>

        <div className="max-w-lg space-y-6">
          <blockquote className="font-heading text-2xl font-semibold leading-9">
            &ldquo;Giảm 70% khách quên lịch hẹn và tiết kiệm hàng giờ viết bài
            quảng cáo mỗi tuần.&rdquo;
          </blockquote>
          <ul className="space-y-3 text-[15px] leading-6 text-teal-50">
            {SPA_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-200" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[13px] text-teal-100/80">
          SpaFlow AI — Soft Organic Luxury &amp; High-Clarity
        </p>
      </div>
    </div>
  );
}
