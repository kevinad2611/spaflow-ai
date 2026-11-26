"use client";

import { Pencil, Phone, Users } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  STAFF_ROLE_LABELS,
  type StaffRow,
} from "@/features/staff/types";

interface StaffListProps {
  staffList: StaffRow[];
  pendingId: string | null;
  onAddClick: () => void;
  onEditClick: (staff: StaffRow) => void;
  onToggleStatus: (staff: StaffRow) => void;
}

/** Responsive staff roster list (table on Desktop, cards on Mobile). */
export function StaffList({
  staffList,
  pendingId,
  onAddClick,
  onEditClick,
  onToggleStatus,
}: StaffListProps) {
  if (staffList.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Chưa có nhân viên nào"
        description="Thêm kỹ thuật viên, lễ tân hoặc quản lý để dễ dàng phân công khi tạo lịch hẹn."
        actionLabel="+ Thêm nhân viên đầu tiên"
        onAction={onAddClick}
      />
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Họ tên</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead className="text-right">Trạng thái &amp; Sửa</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffList.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium text-foreground">
                  {member.full_name}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {STAFF_ROLE_LABELS[member.role]}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {member.phone ?? "Chưa cập nhật"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={member.is_active}
                        disabled={pendingId === member.id}
                        onCheckedChange={() => onToggleStatus(member)}
                        aria-label={`Đổi trạng thái ${member.full_name}`}
                      />
                      <span className="min-w-[88px] text-[13px] text-muted-foreground">
                        {member.is_active ? "Đang làm việc" : "Tạm nghỉ"}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onEditClick(member)}
                      className="min-h-[44px] rounded-lg px-3"
                    >
                      <Pencil className="h-4 w-4" />
                      Sửa
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {staffList.map((member) => (
          <div
            key={member.id}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-heading text-[16px] font-semibold text-foreground">
                  {member.full_name}
                </h3>
                <Badge variant="secondary" className="mt-1.5">
                  {STAFF_ROLE_LABELS[member.role]}
                </Badge>
              </div>
              <span className="text-[13px] font-medium text-muted-foreground">
                {member.is_active ? "Đang làm việc" : "Tạm nghỉ"}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <div className="flex items-center gap-2 text-[14px] text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{member.phone ?? "Chưa có SĐT"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={member.is_active}
                  disabled={pendingId === member.id}
                  onCheckedChange={() => onToggleStatus(member)}
                  aria-label={`Đổi trạng thái ${member.full_name}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onEditClick(member)}
                  className="min-h-[44px] rounded-lg px-3.5"
                >
                  <Pencil className="h-4 w-4" />
                  Sửa
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
