import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, UserX } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { getCustomerDetail } from "@/features/customers/actions";
import { CustomerDetailView } from "@/features/customers/components/CustomerDetailView";

export const metadata: Metadata = {
  title: "Chi tiết khách hàng | SpaFlow AI",
  description: "Hồ sơ chi tiết và lịch sử sử dụng dịch vụ của khách hàng.",
};

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const { id } = await params;
  const result = await getCustomerDetail(id);

  if (!result.success || !result.data) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" className="min-h-[44px] rounded-lg">
          <Link href="/dashboard/customers">
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách khách hàng
          </Link>
        </Button>
        <EmptyState
          icon={UserX}
          title="Không tìm thấy khách hàng"
          description={
            result.error ?? "Hồ sơ khách hàng không tồn tại hoặc đã bị xóa."
          }
          actionLabel="Về danh sách khách hàng"
          actionHref="/dashboard/customers"
        />
      </div>
    );
  }

  return <CustomerDetailView detail={result.data} />;
}
