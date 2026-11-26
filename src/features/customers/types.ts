import type { AppointmentStatus, Tables } from "@/types/database.types";

export type CustomerRow = Tables<"customers">;

export interface CustomerAppointmentServiceItem {
  price_at_booking: number;
  services: {
    name: string;
    duration_minutes: number;
  } | null;
}

export interface CustomerAppointmentItem {
  id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  total_price: number;
  notes: string | null;
  staff: {
    full_name: string;
  } | null;
  appointment_services: CustomerAppointmentServiceItem[];
}

export interface CustomerDetailData {
  customer: CustomerRow;
  appointments: CustomerAppointmentItem[];
}

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  in_progress: "Đang làm",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};
