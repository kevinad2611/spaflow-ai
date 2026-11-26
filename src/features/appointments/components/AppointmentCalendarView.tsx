"use client";

import { CalendarDays, Clock, UserCheck } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentStatusActions } from "@/features/appointments/components/AppointmentStatusActions";
import type { AppointmentItem } from "@/features/appointments/types";
import { formatCurrencyVND, formatDateVN, formatTimeVN } from "@/lib/utils";

interface AppointmentCalendarViewProps {
  appointments: AppointmentItem[];
  onCreateClick: () => void;
}

/** Calendar agenda view grouping appointments by date in chronological order. */
export function AppointmentCalendarView({
  appointments,
  onCreateClick,
}: AppointmentCalendarViewProps) {
  if (appointments.length === 0) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="Lịch biểu đang trống"
        description="Chưa có lịch hẹn nào trong khoảng thời gian đang chọn."
        actionLabel="+ Tạo lịch hẹn mới"
        onAction={onCreateClick}
      />
    );
  }

  const groupedByDate = appointments.reduce<Record<string, AppointmentItem[]>>(
    (acc, appt) => {
      const key = appt.appointment_date;
      const list = acc[key] ?? [];
      list.push(appt);
      acc[key] = list;
      return acc;
    },
    {}
  );

  const sortedDates = Object.keys(groupedByDate).sort();

  return (
    <div className="space-y-5">
      {sortedDates.map((dateKey) => {
        const items = groupedByDate[dateKey] ?? [];
        return (
          <Card
            key={dateKey}
            className="overflow-hidden rounded-xl border-border bg-card shadow-sm"
          >
            <CardHeader className="border-b border-border bg-secondary/50 px-5 py-3.5">
              <CardTitle className="flex items-center justify-between font-heading text-[16px] font-semibold text-foreground">
                <span>Ngày {formatDateVN(dateKey)}</span>
                <span className="text-[13px] font-medium text-primary">
                  {items.length} lịch hẹn
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border p-0">
              {items.map((appt) => (
                <div
                  key={appt.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-muted px-2.5 py-1.5 text-[13px] font-semibold text-foreground">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      {formatTimeVN(appt.start_time)} -{" "}
                      {formatTimeVN(appt.end_time)}
                    </span>
                    <div>
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
                      <p className="mt-0.5 flex items-center gap-1 text-[13px] text-muted-foreground">
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
      })}
    </div>
  );
}
