"use client";

import Link from "next/link";
import { CalendarCheck, Clock, Plus, UserCheck } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentStatusActions } from "@/features/appointments/components/AppointmentStatusActions";
import type { AppointmentItem } from "@/features/appointments/types";
import { formatCurrencyVND, formatTimeVN } from "@/lib/utils";

interface DashboardTodayListProps {
  appointments: AppointmentItem[];
}

/** Today's appointment queue on the Dashboard with quick Check-in and Complete actions. */
export function DashboardTodayList({ appointments }: DashboardTodayListProps) {
  if (appointments.length === 0) {
    return (
      <EmptyState
        icon={CalendarCheck}
        title="Hôm nay chưa có lịch hẹn nào"
        description="Bấm nút bên dưới để đặt lịch hẹn đầu tiên trong ngày cho khách."
        actionLabel="+ Tạo lịch hẹn đầu tiên"
        actionHref="/dashboard/appointments"
      />
    );
  }

  return (
    <Card className="rounded-xl border-border bg-card shadow-sm">
      <CardHeader className="flex flex-col gap-3 border-b border-border sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="font-heading text-[18px] font-semibold text-foreground">
            Lịch hẹn diễn ra trong hôm nay ({appointments.length})
          </CardTitle>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Bấm Check-in khi khách tới hoặc Hoàn thành sau khi làm xong liệu
            trình.
          </p>
        </div>
        <Button asChild className="min-h-[44px] rounded-lg px-4 text-[14px]">
          <Link href="/dashboard/appointments">
            <Plus className="h-4 w-4" />
            Quản lý lịch hẹn
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="divide-y divide-border p-0">
        {appointments.map((appt) => (
          <div
            key={appt.id}
            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-[14px] font-semibold text-primary">
                <Clock className="h-4 w-4" />
                {formatTimeVN(appt.start_time)}
              </span>
              <div className="space-y-1">
                <p className="font-medium text-foreground">
                  {appt.customer?.full_name ?? "Khách lẻ"} •{" "}
                  <span className="text-primary">
                    {formatCurrencyVND(appt.total_price)}
                  </span>
                </p>
                <p className="text-[13px] text-muted-foreground">
                  {appt.appointment_services
                    .map((s) => s.services?.name)
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p className="flex items-center gap-1 text-[13px] text-muted-foreground">
                  <UserCheck className="h-3.5 w-3.5 text-primary" />
                  {appt.staff?.full_name ?? "Chưa phân công"}
                </p>
              </div>
            </div>

            <AppointmentStatusActions
              appointmentId={appt.id}
              status={appt.status}
              compact
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
