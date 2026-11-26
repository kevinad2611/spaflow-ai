import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LandingHeroProps {
  isAuthenticated: boolean;
}

const SAMPLE_APPOINTMENTS = [
  {
    time: "09:30",
    customer: "Chị Minh Thư",
    service: "Chăm sóc da chuyên sâu",
    status: "Đã nhắc Zalo 2h",
  },
  {
    time: "14:00",
    customer: "Chị Ngọc Hân",
    service: "Triệt lông công nghệ cao",
    status: "Đã xác nhận",
  },
  {
    time: "16:30",
    customer: "Chị Bảo Vy",
    service: "Massage body thư giãn",
    status: "Đã nhắc trước 24h",
  },
];

/** Hero section with pain-point headline, CTA, and visual appointment preview card. */
export function LandingHero({ isAuthenticated }: LandingHeroProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-6">
          <Badge className="rounded-full bg-secondary px-3.5 py-1.5 text-[13px] font-medium text-secondary-foreground hover:bg-secondary">
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-spa-accent" />
            Dành riêng cho chủ Spa từ 2–10 nhân viên
          </Badge>

          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-[42px] lg:leading-[1.2]">
            Quản lý lịch hẹn Spa &amp; Tự động nhắc khách qua Zalo chỉ với 1
            chạm
          </h1>

          <p className="text-base leading-7 text-muted-foreground sm:text-[17px]">
            Tạm biệt sổ tay và bảng Excel rối rắm. SpaFlow AI giúp bạn xếp lịch
            nhân viên không trùng giờ, tự động nhắn tin nhắc hẹn qua Zalo/Email
            và tạo bài quảng cáo bằng AI trong vài giây.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              className="min-h-[48px] rounded-lg px-6 text-[16px] font-semibold"
            >
              <Link href={isAuthenticated ? "/dashboard" : "/register"}>
                {isAuthenticated
                  ? "Vào trang quản lý"
                  : "Dùng thử miễn phí ngay"}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="min-h-[48px] rounded-lg px-6 text-[15px] font-medium"
            >
              <a href="#features">Xem 3 tính năng chính</a>
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-md sm:p-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <p className="font-heading text-[18px] font-semibold text-foreground">
                Lịch hẹn hôm nay
              </p>
              <p className="text-[13px] text-muted-foreground">
                Tự động nhắc lịch qua Zalo ZNS &amp; Email
              </p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-[13px] font-medium text-primary">
              3 lịch đã xác nhận
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {SAMPLE_APPOINTMENTS.map((item) => (
              <div
                key={item.time}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/70 p-3.5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-11 shrink-0 items-center gap-1 rounded-lg bg-secondary px-2.5 text-[13px] font-semibold text-primary">
                    <Clock className="h-3.5 w-3.5" />
                    {item.time}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {item.customer}
                    </p>
                    <p className="truncate text-[13px] text-muted-foreground">
                      {item.service}
                    </p>
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[12px] font-medium text-spa-success">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
