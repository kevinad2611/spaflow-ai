"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleStaffStatus } from "@/features/staff/actions";
import { StaffFormSheet } from "@/features/staff/components/StaffFormSheet";
import { StaffList } from "@/features/staff/components/StaffList";
import type { StaffRow } from "@/features/staff/types";

interface StaffTabProps {
  staffList: StaffRow[];
}

/** Tab container managing Staff roster, add/edit Sheet, and active working status. */
export function StaffTab({ staffList }: StaffTabProps) {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffRow | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  function handleAddClick() {
    setEditingStaff(null);
    setSheetOpen(true);
  }

  function handleEditClick(staff: StaffRow) {
    setEditingStaff(staff);
    setSheetOpen(true);
  }

  async function handleToggleStatus(staff: StaffRow) {
    setPendingId(staff.id);
    const nextStatus = !staff.is_active;
    const result = await toggleStaffStatus({
      id: staff.id,
      is_active: nextStatus,
    });
    setPendingId(null);

    if (!result.success) {
      toast.error(result.error ?? "Không thể cập nhật trạng thái nhân viên.");
      return;
    }

    toast.success(
      nextStatus
        ? `${staff.full_name} đã chuyển sang Đang làm việc`
        : `${staff.full_name} đã chuyển sang Tạm nghỉ`
    );
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[15px] text-muted-foreground">
          Quản lý đội ngũ kỹ thuật viên, lễ tân và trạng thái làm việc tại Spa.
        </p>
        <Button
          type="button"
          onClick={handleAddClick}
          className="min-h-[44px] rounded-lg px-5 text-[15px]"
        >
          <UserPlus className="h-4 w-4" />
          Thêm nhân viên
        </Button>
      </div>

      <StaffList
        staffList={staffList}
        pendingId={pendingId}
        onAddClick={handleAddClick}
        onEditClick={handleEditClick}
        onToggleStatus={handleToggleStatus}
      />

      <StaffFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        editingStaff={editingStaff}
        onSaved={() => router.refresh()}
      />
    </div>
  );
}
