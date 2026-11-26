import type { Metadata } from "next";
import { getAppointmentFormOptions, getAppointments } from "@/features/appointments/actions";
import { AppointmentsView } from "@/features/appointments/components/AppointmentsView";
import { getVietnamTodayISO } from "@/features/appointments/utils";

export const metadata: Metadata = {
  title: "Lịch hẹn | SpaFlow AI",
  description: "Quản lý lịch hẹn theo ngày, lịch biểu và phân công nhân viên.",
};

export default async function AppointmentsPage() {
  const [appointmentsRes, optionsRes] = await Promise.all([
    getAppointments("all"),
    getAppointmentFormOptions(),
  ]);

  const appointments = appointmentsRes.data ?? [];
  const options = optionsRes.data ?? {
    customers: [],
    services: [],
    staff: [],
  };
  const loadError = appointmentsRes.error ?? optionsRes.error;
  const todayISO = getVietnamTodayISO();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold leading-8 text-foreground">
          Quản lý Lịch hẹn
        </h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          Xem lịch theo ngày/tuần, phân công kỹ thuật viên và cập nhật trạng
          thái 1 chạm.
        </p>
      </div>

      {loadError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-[15px] text-spa-error">
          {loadError}
        </div>
      ) : null}

      <AppointmentsView
        appointments={appointments}
        options={options}
        todayISO={todayISO}
      />
    </div>
  );
}
