"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { softDeleteCustomer } from "@/features/customers/actions";
import { CustomerFormSheet } from "@/features/customers/components/CustomerFormSheet";
import { CustomerList } from "@/features/customers/components/CustomerList";
import type { CustomerRow } from "@/features/customers/types";

interface CustomersViewProps {
  customers: CustomerRow[];
}

/** Interactive customer CRM view with instant name/phone search, Sheet form, and soft-delete modal. */
export function CustomersView({ customers }: CustomersViewProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerRow | null>(
    null
  );
  const [deletingCustomer, setDeletingCustomer] = useState<CustomerRow | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredCustomers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.full_name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.zalo_phone ?? "").toLowerCase().includes(q)
    );
  }, [customers, searchTerm]);

  function handleAddClick() {
    setEditingCustomer(null);
    setSheetOpen(true);
  }

  function handleEditClick(customer: CustomerRow) {
    setEditingCustomer(customer);
    setSheetOpen(true);
  }

  async function handleConfirmDelete() {
    if (!deletingCustomer) return;
    setIsDeleting(true);
    const result = await softDeleteCustomer({ id: deletingCustomer.id });
    setIsDeleting(false);

    if (!result.success) {
      toast.error(result.error ?? "Không thể xóa khách hàng.");
      return;
    }

    toast.success(`Đã xóa khách hàng "${deletingCustomer.full_name}"`);
    setDeletingCustomer(null);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên hoặc số điện thoại..."
            className="min-h-[44px] rounded-lg bg-card pl-10 text-[15px]"
          />
        </div>

        <Button
          type="button"
          onClick={handleAddClick}
          className="min-h-[44px] rounded-lg px-5 text-[15px]"
        >
          <UserPlus className="h-4 w-4" />
          Thêm khách hàng
        </Button>
      </div>

      <CustomerList
        customers={filteredCustomers}
        hasSearchQuery={searchTerm.trim().length > 0}
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={setDeletingCustomer}
      />

      <CustomerFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        editingCustomer={editingCustomer}
        onSaved={() => router.refresh()}
      />

      <ConfirmDialog
        open={Boolean(deletingCustomer)}
        onOpenChange={(open) => {
          if (!open) setDeletingCustomer(null);
        }}
        title="Xác nhận xóa khách hàng"
        description={`Bạn có chắc muốn ẩn hồ sơ của khách hàng "${deletingCustomer?.full_name ?? ""}" khỏi danh sách? Lịch sử giao dịch trước đây vẫn được bảo toàn.`}
        confirmLabel="Xóa khách hàng"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
