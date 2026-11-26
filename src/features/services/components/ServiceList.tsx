"use client";

import { Clock, Pencil, Scissors } from "lucide-react";
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
import type { ServiceRow } from "@/features/services/types";
import { formatCurrencyVND } from "@/lib/utils";

interface ServiceListProps {
  services: ServiceRow[];
  pendingId: string | null;
  onAddClick: () => void;
  onEditClick: (service: ServiceRow) => void;
  onToggleStatus: (service: ServiceRow) => void;
}

/** Responsive service catalog list (5-column table on Desktop, cards on Mobile). */
export function ServiceList({
  services,
  pendingId,
  onAddClick,
  onEditClick,
  onToggleStatus,
}: ServiceListProps) {
  if (services.length === 0) {
    return (
      <EmptyState
        icon={Scissors}
        title="Chưa có dịch vụ nào"
        description="Thêm các liệu trình và bảng giá của Spa để bắt đầu đặt lịch hẹn nhanh chóng."
        actionLabel="+ Thêm dịch vụ đầu tiên"
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
              <TableHead>Tên dịch vụ</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Giá tiền</TableHead>
              <TableHead>Thời lượng</TableHead>
              <TableHead className="text-right">Trạng thái &amp; Sửa</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium text-foreground">
                  <p>{service.name}</p>
                  {service.description ? (
                    <p className="line-clamp-1 text-[13px] font-normal text-muted-foreground">
                      {service.description}
                    </p>
                  ) : null}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{service.category}</Badge>
                </TableCell>
                <TableCell className="font-semibold text-foreground">
                  {formatCurrencyVND(service.price)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {service.duration_minutes} phút
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={service.is_active}
                        disabled={pendingId === service.id}
                        onCheckedChange={() => onToggleStatus(service)}
                        aria-label={`Đổi trạng thái ${service.name}`}
                      />
                      <span className="min-w-[96px] text-[13px] text-muted-foreground">
                        {service.is_active ? "Đang kinh doanh" : "Tạm ngưng"}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onEditClick(service)}
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
        {services.map((service) => (
          <div
            key={service.id}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-heading text-[16px] font-semibold text-foreground">
                  {service.name}
                </h3>
                <Badge variant="secondary" className="mt-1.5">
                  {service.category}
                </Badge>
              </div>
              <p className="font-heading text-[16px] font-bold text-primary">
                {formatCurrencyVND(service.price)}
              </p>
            </div>

            {service.description ? (
              <p className="mt-2.5 text-[14px] text-muted-foreground">
                {service.description}
              </p>
            ) : null}

            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{service.duration_minutes} phút</span>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={service.is_active}
                  disabled={pendingId === service.id}
                  onCheckedChange={() => onToggleStatus(service)}
                  aria-label={`Đổi trạng thái ${service.name}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onEditClick(service)}
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
