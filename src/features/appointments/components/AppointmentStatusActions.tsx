"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Play, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateAppointmentStatus } from "@/features/appointments/actions";
import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_STYLES,
} from "@/features/appointments/types";
import { cn } from "@/lib/utils";
import type { AppointmentStatus } from "@/types/database.types";

interface AppointmentStatusActionsProps {
  appointmentId: string;
  status: AppointmentStatus;
  compact?: boolean;
}

/** Status badge and one-tap transition buttons for an appointment. */
export function AppointmentStatusActions({
  appointmentId,
  status,
  compact = false,
}: AppointmentStatusActionsProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleStatusChange(nextStatus: AppointmentStatus) {
    setIsUpdating(true);
    const result = await updateAppointmentStatus({
      id: appointmentId,
      status: nextStatus,
    });
    setIsUpdating(false);

    if (!result.success) {
      toast.error(result.error ?? "Không thể cập nhật trạng thái.");
      return;
    }

    toast.success(
      `Đã chuyển trạng thái sang "${APPOINTMENT_STATUS_LABELS[nextStatus]}"`
    );
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-1 text-[12px] font-medium",
          APPOINTMENT_STATUS_STYLES[status]
        )}
      >
        {APPOINTMENT_STATUS_LABELS[status]}
      </span>

      {status === "pending" ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={isUpdating}
          onClick={() => handleStatusChange("confirmed")}
          className="min-h-[44px] rounded-lg px-3 text-[13px]"
        >
          <Check className="h-3.5 w-3.5 text-primary" />
          Xác nhận
        </Button>
      ) : null}

      {status === "pending" || status === "confirmed" ? (
        <Button
          type="button"
          size="sm"
          disabled={isUpdating}
          onClick={() => handleStatusChange("in_progress")}
          className="min-h-[44px] rounded-lg px-3 text-[13px]"
        >
          <Play className="h-3.5 w-3.5" />
          Check-in
        </Button>
      ) : null}

      {status === "in_progress" ? (
        <Button
          type="button"
          size="sm"
          disabled={isUpdating}
          onClick={() => handleStatusChange("completed")}
          className="min-h-[44px] rounded-lg bg-spa-success px-3 text-[13px] text-white hover:bg-green-700"
        >
          <Check className="h-3.5 w-3.5" />
          Hoàn thành
        </Button>
      ) : null}

      {!compact && status !== "completed" && status !== "cancelled" ? (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={isUpdating}
          onClick={() => handleStatusChange("cancelled")}
          aria-label="Hủy lịch hẹn"
          className="min-h-[44px] rounded-lg px-2.5 text-[13px] text-spa-error hover:bg-red-50"
        >
          <X className="h-4 w-4" />
          Hủy
        </Button>
      ) : null}
    </div>
  );
}
