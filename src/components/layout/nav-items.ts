import type { LucideIcon } from "lucide-react";
import {
  BellRing,
  CalendarDays,
  LayoutDashboard,
  Scissors,
  Users,
  Wand2,
} from "lucide-react";

export interface DashboardNavItem {
  label: string;
  shortLabel: string;
  href: string;
  icon: LucideIcon;
  showInMobileBar: boolean;
}

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  {
    label: "Tổng quan",
    shortLabel: "Tổng quan",
    href: "/dashboard",
    icon: LayoutDashboard,
    showInMobileBar: true,
  },
  {
    label: "Lịch hẹn",
    shortLabel: "Lịch hẹn",
    href: "/dashboard/appointments",
    icon: CalendarDays,
    showInMobileBar: true,
  },
  {
    label: "Khách hàng",
    shortLabel: "Khách",
    href: "/dashboard/customers",
    icon: Users,
    showInMobileBar: true,
  },
  {
    label: "Dịch vụ & Nhân viên",
    shortLabel: "Dịch vụ",
    href: "/dashboard/services",
    icon: Scissors,
    showInMobileBar: false,
  },
  {
    label: "Chăm sóc tự động",
    shortLabel: "Tự động",
    href: "/dashboard/automation",
    icon: BellRing,
    showInMobileBar: false,
  },
  {
    label: "AI Marketing",
    shortLabel: "AI Studio",
    href: "/dashboard/ai-studio",
    icon: Wand2,
    showInMobileBar: true,
  },
];

/** Determine whether a navigation item matches the current pathname. */
export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
