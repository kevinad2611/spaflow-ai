import type { Metadata } from "next";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản Spa | SpaFlow AI",
  description: "Khởi tạo tài khoản SpaFlow AI miễn phí trong 1 phút.",
};

export default function RegisterPage() {
  return (
    <AuthSplitLayout
      title="Bắt đầu dùng thử miễn phí"
      subtitle="Điền thông tin cơ bản để thiết lập không gian quản lý cho Spa của bạn."
    >
      <RegisterForm />
    </AuthSplitLayout>
  );
}
