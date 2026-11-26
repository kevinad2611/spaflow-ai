import {
  CalendarCheck,
  MessageSquareCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardSummary } from "@/features/appointments/actions";
import { DashboardTodayList } from "@/features/appointments/components/DashboardTodayList";
import { getCurrentSpaContext } from "@/lib/supabase/spa";
import { formatCurrencyVND } from "@/lib/utils";

export default async function DashboardPage() {
  const [context, summaryRes] = await Promise.all([
    getCurrentSpaContext(),
    getDashboardSummary(),
  ]);

  const summary = summaryRes.data ?? {
    todayCount: 0,
    inProgressCount: 0,
    sentMessagesCount: 0,
    expectedRevenue: 0,
    todayAppointments: [],
  };

  const kpiCards = [
    {
      label: "Lịch hẹn hôm nay",
      value: String(summary.todayCount),
      icon: CalendarCheck,
    },
    {
      label: "Khách đang phục vụ",
      value: String(summary.inProgressCount),
      icon: Users,
    },
    {
      label: "Tin nhắc đã gửi",
      value: String(summary.sentMessagesCount),
      icon: MessageSquareCheck,
    },
    {
      label: "Doanh thu dự kiến",
      value: formatCurrencyVND(summary.expectedRevenue),
      icon: Sparkles,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold leading-8 text-foreground">
          Tổng quan {context.data?.spaName ? `— ${context.data.spaName}` : ""}
        </h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          Theo dõi nhanh lịch hẹn hôm nay và hoạt động chăm sóc khách hàng.
        </p>
      </div>

      {summaryRes.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-[15px] text-spa-error">
          {summaryRes.error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="rounded-xl border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[14px] font-medium text-muted-foreground">
                  {kpi.label}
                </CardTitle>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Icon className="h-5 w-5" />
                </span>
              </CardHeader>
              <CardContent>
                <p className="font-heading text-2xl font-bold text-foreground">
                  {kpi.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <DashboardTodayList appointments={summary.todayAppointments} />
    </div>
  );
}
