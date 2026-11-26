import type { Metadata } from "next";
import { getCustomers } from "@/features/customers/actions";
import { CustomersView } from "@/features/customers/components/CustomersView";

export const metadata: Metadata = {
  title: "Khách hàng | SpaFlow AI",
  description: "Quản lý hồ sơ khách hàng và lịch sử liệu trình Spa.",
};

export default async function CustomersPage() {
  const result = await getCustomers();
  const customers = result.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold leading-8 text-foreground">
          Khách hàng ({customers.length})
        </h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          Tìm kiếm nhanh theo tên hoặc số điện thoại và theo dõi tình trạng da
          của từng khách.
        </p>
      </div>

      {result.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-[15px] text-spa-error">
          {result.error}
        </div>
      ) : null}

      <CustomersView customers={customers} />
    </div>
  );
}
