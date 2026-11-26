"use client";

import Link from "next/link";
import { CalendarDays, Clock, Phone, UserCheck } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AppointmentStatusActions } from "@/features/appointments/components/AppointmentStatusActions";
import type { AppointmentItem } from "@/features/appointments/types";
import { formatCurrencyVND, formatDateVN, formatTimeVN } from "@/lib/utils";

interface AppointmentListViewProps {
  appointments: AppointmentItem[];
  onCreateClick: () => void;
}

/** List view displaying appointment cards with customer, services, staff, and quick actions. */
export function AppointmentListView({
  appointments,
  onCreateClick,
}: AppointmentListViewProps) {
  if (appointments.length === 0) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="Không có lịch hẹn nào trong bộ lọc này"
        description="Bấm nút bên dưới để tạo lịch hẹn mới cho khách hàng."
        actionLabel="+ Tạo lịch hẹn đầu tiên"
        onAction={onCreateClick}
      />
    );
  }

  return (
    <div className="space-y-3">
      {appointments.map((appt) => (
        <Card
          key={appt.id}
          className="rounded-xl border-border bg-card shadow-sm"
        >
          <CardContent className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="flex shrink-0 flex-col items-start rounded-xl bg-secondary px-3.5 py-2.5 text-primary sm:min-w-[126px]">
                <span className="flex items-center gap-1.5 font-heading text-[16px] font-bold">
                  <Clock className="h-4 w-4" />
                  {formatTimeVN(appt.start_time)} -{" "}
                  {formatTimeVN(appt.end_time)}
                </span>
                <span className="text-[13px] text-secondary-foreground">
                  {formatDateVN(appt.appointment_date)}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {appt.customer ? (
                    <Link
                      href={`/dashboard/customers/${appt.customer.id}`}
                      className="font-heading text-[17px] font-semibold text-foreground hover:text-primary hover:underline"
                    >
                      {appt.customer.full_name}
                    </Link>
                  ) : (
                    <span className="font-heading text-[17px] font-semibold">
                      Khách lẻ
                    </span>
                  )}
                  {appt.customer?.phone ? (
                    <a
                      href={`tel:${appt.customer.phone}`}
                      className="inline-flex items-center gap-1 text-[14px] text-muted-foreground hover:text-primary"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {appt.customer.phone}
                    </a>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {appt.appointment_services.map((item, idx) => (
                    <Badge key={idx} variant="outline" className="font-normal">
                      {item.services?.name ?? "Dịch vụ Spa"}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-primary" />
                    {appt.staff?.full_name ?? "Chưa phân công nhân viên"}
                  </span>
                  <span className="font-semibold text-foreground">
                    {formatCurrencyVND(appt.total_price)}
                  </span>
                </div>
              </div>
            </div>

            <AppointmentStatusActions
              appointmentId={appt.id}
              status={appt.status}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
