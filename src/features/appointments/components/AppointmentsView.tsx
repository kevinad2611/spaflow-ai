"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppointmentCalendarView } from "@/features/appointments/components/AppointmentCalendarView";
import { AppointmentFormSheet } from "@/features/appointments/components/AppointmentFormSheet";
import { AppointmentListView } from "@/features/appointments/components/AppointmentListView";
import type {
  AppointmentDateFilter,
  AppointmentFormOptions,
  AppointmentItem,
} from "@/features/appointments/types";
import { addDaysISO } from "@/features/appointments/utils";
import { cn } from "@/lib/utils";

interface AppointmentsViewProps {
  appointments: AppointmentItem[];
  options: AppointmentFormOptions;
  todayISO: string;
}

const DATE_FILTERS: { value: AppointmentDateFilter; label: string }[] = [
  { value: "today", label: "Hôm nay" },
  { value: "tomorrow", label: "Ngày mai" },
  { value: "week", label: "Tuần này" },
  { value: "all", label: "Tất cả" },
];

/** Main Appointments view with date/staff filters, List/Calendar toggle, and booking Sheet. */
export function AppointmentsView({
  appointments,
  options,
  todayISO,
}: AppointmentsViewProps) {
  const router = useRouter();
  const [dateFilter, setDateFilter] = useState<AppointmentDateFilter>("today");
  const [staffFilter, setStaffFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [sheetOpen, setSheetOpen] = useState(false);

  const tomorrowISO = addDaysISO(todayISO, 1);
  const weekEndISO = addDaysISO(todayISO, 6);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      if (dateFilter === "today" && appt.appointment_date !== todayISO) {
        return false;
      }
      if (dateFilter === "tomorrow" && appt.appointment_date !== tomorrowISO) {
        return false;
      }
      if (
        dateFilter === "week" &&
        (appt.appointment_date < todayISO || appt.appointment_date > weekEndISO)
      ) {
        return false;
      }
      if (staffFilter !== "all" && appt.staff?.id !== staffFilter) {
        return false;
      }
      return true;
    });
  }, [appointments, dateFilter, staffFilter, todayISO, tomorrowISO, weekEndISO]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {DATE_FILTERS.map((item) => (
            <Button
              key={item.value}
              type="button"
              variant={dateFilter === item.value ? "default" : "outline"}
              onClick={() => setDateFilter(item.value)}
              className="min-h-[44px] rounded-lg px-4 text-[14px]"
            >
              {item.label}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Select value={staffFilter} onValueChange={setStaffFilter}>
            <SelectTrigger className="min-h-[44px] w-full rounded-lg bg-card sm:w-[190px]">
              <SelectValue placeholder="Lọc nhân viên" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả nhân viên</SelectItem>
              {options.staff.map((st) => (
                <SelectItem key={st.id} value={st.id}>
                  {st.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="inline-flex rounded-lg border border-border bg-card p-1">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "inline-flex min-h-[36px] items-center gap-1.5 rounded-md px-3 text-[13px] font-medium transition-colors",
                viewMode === "list"
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="h-4 w-4" />
              Danh sách
            </button>
            <button
              type="button"
              onClick={() => setViewMode("calendar")}
              className={cn(
                "inline-flex min-h-[36px] items-center gap-1.5 rounded-md px-3 text-[13px] font-medium transition-colors",
                viewMode === "calendar"
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <CalendarDays className="h-4 w-4" />
              Lịch biểu
            </button>
          </div>

          <Button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="min-h-[44px] rounded-lg px-5 text-[15px]"
          >
            <Plus className="h-4 w-4" />
            Tạo lịch hẹn
          </Button>
        </div>
      </div>

      {viewMode === "list" ? (
        <AppointmentListView
          appointments={filteredAppointments}
          onCreateClick={() => setSheetOpen(true)}
        />
      ) : (
        <AppointmentCalendarView
          appointments={filteredAppointments}
          onCreateClick={() => setSheetOpen(true)}
        />
      )}

      <AppointmentFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        options={options}
        defaultDate={dateFilter === "tomorrow" ? tomorrowISO : todayISO}
        onSaved={() => router.refresh()}
      />
    </div>
  );
}
