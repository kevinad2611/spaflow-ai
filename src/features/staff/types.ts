import type { StaffRole, Tables } from "@/types/database.types";

export type StaffRow = Tables<"staff">;

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  manager: "Quản lý",
  technician: "Kỹ thuật viên",
  receptionist: "Lễ tân",
};

export const STAFF_ROLES: StaffRole[] = [
  "technician",
  "receptionist",
  "manager",
];
