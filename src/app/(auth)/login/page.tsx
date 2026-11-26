import type { Metadata } from "next";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập | SpaFlow AI",
  description: "Đăng nhập vào hệ thống quản lý SpaFlow AI.",
};

export default function LoginPage() {
  return (
    <AuthSplitLayout
      title="Chào mừng trở lại"
      subtitle="Đăng nhập để quản lý lịch hẹn và chăm sóc khách hàng của Spa."
    >
      <LoginForm />
    </AuthSplitLayout>
  );
}
