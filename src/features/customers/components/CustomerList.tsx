"use client";

import Link from "next/link";
import { Eye, Pencil, Phone, Trash2, Users } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CustomerRow } from "@/features/customers/types";

interface CustomerListProps {
  customers: CustomerRow[];
  hasSearchQuery: boolean;
  onAddClick: () => void;
  onEditClick: (customer: CustomerRow) => void;
  onDeleteClick: (customer: CustomerRow) => void;
}

/** Responsive customer directory (4-column Desktop table, Mobile cards). */
export function CustomerList({
  customers,
  hasSearchQuery,
  onAddClick,
  onEditClick,
  onDeleteClick,
}: CustomerListProps) {
  if (customers.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title={
          hasSearchQuery
            ? "Không tìm thấy khách hàng phù hợp"
            : "Chưa có khách hàng nào"
        }
        description={
          hasSearchQuery
            ? "Thử tìm bằng tên khác hoặc kiểm tra lại số điện thoại."
            : "Thêm hồ sơ khách hàng đầu tiên để theo dõi liệu trình và nhắc lịch tự động."
        }
        actionLabel={hasSearchQuery ? undefined : "+ Thêm khách hàng đầu tiên"}
        onAction={hasSearchQuery ? undefined : onAddClick}
      />
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Ghi chú tình trạng da</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium text-foreground">
                  <Link
                    href={`/dashboard/customers/${customer.id}`}
                    className="hover:text-primary hover:underline"
                  >
                    {customer.full_name}
                  </Link>
                  {customer.email ? (
                    <p className="text-[13px] font-normal text-muted-foreground">
                      {customer.email}
                    </p>
                  ) : null}
                </TableCell>
                <TableCell className="text-foreground">
                  {customer.phone}
                </TableCell>
                <TableCell className="max-w-xs text-muted-foreground">
                  <p className="line-clamp-2 text-[14px]">
                    {customer.notes ?? "Chưa có ghi chú"}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      asChild
                      variant="secondary"
                      size="sm"
                      className="min-h-[44px] rounded-lg px-3"
                    >
                      <Link href={`/dashboard/customers/${customer.id}`}>
                        <Eye className="h-4 w-4" />
                        Chi tiết
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onEditClick(customer)}
                      className="min-h-[44px] rounded-lg px-3"
                    >
                      <Pencil className="h-4 w-4" />
                      Sửa
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteClick(customer)}
                      aria-label={`Xóa ${customer.full_name}`}
                      className="min-h-[44px] rounded-lg px-3 text-spa-error hover:bg-red-50 hover:text-spa-error"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link
                  href={`/dashboard/customers/${customer.id}`}
                  className="font-heading text-[16px] font-semibold text-foreground hover:text-primary"
                >
                  {customer.full_name}
                </Link>
                <p className="mt-1 flex items-center gap-1.5 text-[14px] text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  {customer.phone}
                </p>
              </div>
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="min-h-[44px] rounded-lg px-3"
              >
                <Link href={`/dashboard/customers/${customer.id}`}>
                  <Eye className="h-4 w-4" />
                  Hồ sơ
                </Link>
              </Button>
            </div>

            {customer.notes ? (
              <p className="mt-2.5 line-clamp-2 text-[14px] text-muted-foreground">
                {customer.notes}
              </p>
            ) : null}

            <div className="mt-4 flex justify-end gap-2 border-t border-border pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onEditClick(customer)}
                className="min-h-[44px] rounded-lg px-3.5"
              >
                <Pencil className="h-4 w-4" />
                Sửa
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onDeleteClick(customer)}
                className="min-h-[44px] rounded-lg px-3.5 text-spa-error hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Xóa
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
