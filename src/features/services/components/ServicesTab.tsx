"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleServiceStatus } from "@/features/services/actions";
import { ServiceFormSheet } from "@/features/services/components/ServiceFormSheet";
import { ServiceList } from "@/features/services/components/ServiceList";
import type { ServiceRow } from "@/features/services/types";

interface ServicesTabProps {
  services: ServiceRow[];
}

/** Tab container managing Service list, add/edit Sheet, and active status toggling. */
export function ServicesTab({ services }: ServicesTabProps) {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceRow | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  function handleAddClick() {
    setEditingService(null);
    setSheetOpen(true);
  }

  function handleEditClick(service: ServiceRow) {
    setEditingService(service);
    setSheetOpen(true);
  }

  async function handleToggleStatus(service: ServiceRow) {
    setPendingId(service.id);
    const nextStatus = !service.is_active;
    const result = await toggleServiceStatus({
      id: service.id,
      is_active: nextStatus,
    });
    setPendingId(null);

    if (!result.success) {
      toast.error(result.error ?? "Không thể cập nhật trạng thái dịch vụ.");
      return;
    }

    toast.success(
      nextStatus
        ? `Đã bật kinh doanh "${service.name}"`
        : `Đã tạm ngưng "${service.name}"`
    );
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[15px] text-muted-foreground">
          Quản lý bảng giá, thời lượng và bật/tắt dịch vụ hiển thị khi đặt lịch.
        </p>
        <Button
          type="button"
          onClick={handleAddClick}
          className="min-h-[44px] rounded-lg px-5 text-[15px]"
        >
          <Plus className="h-4 w-4" />
          Thêm dịch vụ
        </Button>
      </div>

      <ServiceList
        services={services}
        pendingId={pendingId}
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
        onToggleStatus={handleToggleStatus}
      />

      <ServiceFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        editingService={editingService}
        onSaved={() => router.refresh()}
      />
    </div>
  );
}
