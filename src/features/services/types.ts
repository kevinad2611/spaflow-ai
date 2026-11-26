import type { Tables } from "@/types/database.types";

export type ServiceRow = Tables<"services">;

export const SERVICE_CATEGORIES = [
  "Chăm sóc da",
  "Body",
  "Triệt lông",
  "Phun xăm",
  "Gội đầu dưỡng sinh",
  "Khác",
] as const;
