import { clsx, type ClassValue } from "clsx";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind CSS classes cleanly. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format a numeric amount into Vietnamese Dong (VNĐ). */
export function formatCurrencyVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format an ISO date string or Date object into Vietnamese dd/MM/yyyy format. */
export function formatDateVN(dateInput: Date | string): string {
  const date = typeof dateInput === "string" ? parseISO(dateInput) : dateInput;
  return format(date, "dd/MM/yyyy", { locale: vi });
}

/** Format a time string (HH:mm or HH:mm:ss) into HH:mm display format. */
export function formatTimeVN(timeString: string): string {
  return timeString.slice(0, 5);
}
