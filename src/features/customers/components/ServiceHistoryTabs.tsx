"use client";

import { CalendarClock, CheckCircle2, Sparkles, UserCheck } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  APPOINTMENT_STATUS_LABELS,
  type CustomerAppointmentItem,
} from "@/features/customers/types";
import { formatCurrencyVND, formatDateVN, formatTimeVN } from "@/lib/utils";

interface ServiceHistoryTabsProps {
  appointments: CustomerAppointmentItem[];
}

function AppointmentHistoryList({
  items,
  emptyTitle,
  emptyDescription,
}: {
  items: CustomerAppointmentItem[];
  emptyTitle: string;
  emptyDescription: string;
}) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={CalendarClock}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="space-y-3">
      {items.map((appt) => (
        <Card key={appt.id} className="rounded-xl border-border bg-card">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-heading text-[16px] font-semibold text-foreground">
                  {formatDateVN(appt.appointment_date)} •{" "}
                  {formatTimeVN(appt.start_time)} - {formatTimeVN(appt.end_time)}
                </span>
                <Badge variant="secondary">
                  {APPOINTMENT_STATUS_LABELS[appt.status]}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {appt.appointment_services.map((item, idx) => (
                  <Badge key={idx} variant="outline" className="font-normal">
                    {item.services?.name ?? "Dịch vụ Spa"}
                  </Badge>
                ))}
              </div>
              <p className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                <UserCheck className="h-3.5 w-3.5 text-primary" />
                Phụ trách: {appt.staff?.full_name ?? "Chưa phân công"}
              </p>
            </div>
            <p className="font-heading text-lg font-bold text-primary">
              {formatCurrencyVND(appt.total_price)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/** Three-tab service history view (In Progress, Completed, Upcoming). */
export function ServiceHistoryTabs({ appointments }: ServiceHistoryTabsProps) {
  const inProgress = appointments.filter((a) => a.status === "in_progress");
  const completed = appointments.filter((a) => a.status === "completed");
  const upcoming = appointments.filter(
    (a) => a.status === "pending" || a.status === "confirmed"
  );

  return (
    <Tabs defaultValue="in_progress" className="space-y-4">
      <TabsList className="grid h-auto w-full grid-cols-1 gap-1 rounded-xl bg-muted p-1 sm:grid-cols-3">
        <TabsTrigger
          value="in_progress"
          className="min-h-[44px] gap-2 rounded-lg text-[14px] font-medium"
        >
          <Sparkles className="h-4 w-4" />
          Đang sử dụng ({inProgress.length})
        </TabsTrigger>
        <TabsTrigger
          value="completed"
          className="min-h-[44px] gap-2 rounded-lg text-[14px] font-medium"
        >
          <CheckCircle2 className="h-4 w-4" />
          Dịch vụ đã sử dụng ({completed.length})
        </TabsTrigger>
        <TabsTrigger
          value="upcoming"
          className="min-h-[44px] gap-2 rounded-lg text-[14px] font-medium"
        >
          <CalendarClock className="h-4 w-4" />
          Lịch hẹn sắp tới ({upcoming.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="in_progress" className="mt-0">
        <AppointmentHistoryList
          items={inProgress}
          emptyTitle="Chưa có liệu trình đang thực hiện"
          emptyDescription="Khi khách check-in và chuyển sang trạng thái Đang làm, liệu trình sẽ hiển thị tại đây."
        />
      </TabsContent>

      <TabsContent value="completed" className="mt-0">
        <AppointmentHistoryList
          items={completed}
          emptyTitle="Chưa có lịch sử dịch vụ hoàn thành"
          emptyDescription="Các dịch vụ khách đã trải nghiệm và hoàn thành sẽ được lưu tại đây."
        />
      </TabsContent>

      <TabsContent value="upcoming" className="mt-0">
        <AppointmentHistoryList
          items={upcoming}
          emptyTitle="Chưa có lịch hẹn sắp tới"
          emptyDescription="Các lịch hẹn đang chờ xác nhận hoặc đã xác nhận sẽ hiển thị tại đây."
        />
      </TabsContent>
    </Tabs>
  );
}
