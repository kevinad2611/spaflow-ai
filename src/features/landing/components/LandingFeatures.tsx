import { BellRing, CalendarDays, Wand2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CORE_FEATURES = [
  {
    icon: CalendarDays,
    title: "Lịch hẹn & Khách hàng thông minh",
    description:
      "Tạo lịch hẹn nhanh trong 10 giây, phân công kỹ thuật viên rõ ràng và lưu trữ đầy đủ lịch sử liệu trình, ghi chú tình trạng da.",
  },
  {
    icon: BellRing,
    title: "Tự động nhắc lịch Zalo & Email",
    description:
      "Hệ thống tự động gửi tin nhắn nhắc trước 24h, trước 2h và hỏi thăm sau liệu trình 1 ngày — giảm tới 70% tỷ lệ khách quên lịch.",
  },
  {
    icon: Wand2,
    title: "AI viết bài SEO & Dựng video",
    description:
      "Chọn dịch vụ có sẵn của Spa để AI viết ngay bài đăng Facebook, Zalo, kịch bản TikTok và ghép ảnh thành video ngắn có giọng đọc tiếng Việt.",
  },
];

/** Three core feature pillar cards and footer for the SpaFlow AI landing page. */
export function LandingFeatures() {
  return (
    <>
      <section
        id="features"
        className="border-t border-border bg-card py-14 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Mọi công cụ chủ Spa cần, trên một màn hình dễ dùng
            </h2>
            <p className="mt-3 text-[15px] leading-6 text-muted-foreground">
              Thiết kế chữ to, nút bấm rõ ràng, thao tác mượt mà trên cả điện
              thoại và iPad tại quầy lễ tân.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {CORE_FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="rounded-xl border-border bg-background/60 shadow-sm"
                >
                  <CardHeader>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="font-heading text-[18px] font-semibold leading-7 text-foreground">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-[15px] leading-6 text-muted-foreground">
                    {feature.description}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background py-6 text-center text-[13px] text-muted-foreground">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          © {new Date().getFullYear()} SpaFlow AI — Trợ lý quản lý &amp;
          marketing thông minh dành cho Spa Việt Nam.
        </div>
      </footer>
    </>
  );
}
