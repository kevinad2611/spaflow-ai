import type { AppointmentStatus } from "@/types/database.types";

export interface AppointmentServiceDetail {
  service_id: string;
  price_at_booking: number;
  services: {
    name: string;
    duration_minutes: number;
  } | null;
}

export interface AppointmentItem {
  id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  total_price: number;
  notes: string | null;
  customer: {
    id: string;
    full_name: string;
    phone: string;
  } | null;
  staff: {
    id: string;
    full_name: string;
  } | null;
  appointment_services: AppointmentServiceDetail[];
}

export interface AppointmentFormOptions {
  customers: { id: string; full_name: string; phone: string }[];
  services: {
    id: string;
    name: string;
    category: string;
    price: number;
    duration_minutes: number;
  }[];
  staff: { id: string; full_name: string; role: string }[];
}

export interface DashboardSummary {
  todayCount: number;
  inProgressCount: number;
  sentMessagesCount: number;
  expectedRevenue: number;
  todayAppointments: AppointmentItem[];
}

export type AppointmentDateFilter = "today" | "tomorrow" | "week" | "all";

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  in_progress: "Đang làm",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

export const APPOINTMENT_STATUS_STYLES: Record<AppointmentStatus, string> = {
  pending: "bg-orange-50 text-spa-warning border-orange-200",
  confirmed: "bg-secondary text-primary border-teal-200",
  in_progress: "bg-amber-50 text-spa-accent border-amber-200",
  completed: "bg-green-50 text-spa-success border-green-200",
  cancelled: "bg-red-50 text-spa-error border-red-200",
};
