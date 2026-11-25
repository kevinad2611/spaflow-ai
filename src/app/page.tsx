export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <div className="max-w-xl rounded-xl border border-border bg-card p-8 shadow-sm">
        <span className="inline-block rounded-full bg-secondary px-3 py-1 text-[13px] font-medium text-secondary-foreground">
          SpaFlow AI
        </span>
        <h1 className="mt-4 font-heading text-2xl font-bold leading-8 text-foreground">
          Nền tảng Quản lý Spa &amp; Chăm sóc Khách hàng Tự động
        </h1>
        <p className="mt-3 text-[15px] leading-6 text-muted-foreground">
          Hệ thống đang được khởi tạo nền tảng. Trang giới thiệu và bảng điều
          khiển sẽ được hoàn thiện ở các bước tiếp theo.
        </p>
      </div>
    </main>
  );
}
