"use client";

import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { AppointmentFormOptions } from "@/features/appointments/types";
import { cn, formatCurrencyVND } from "@/lib/utils";

interface AppointmentServicePickerProps {
  services: AppointmentFormOptions["services"];
  selectedIds: string[];
  errorMessage?: string;
  onToggle: (serviceId: string) => void;
}

/** Multi-select service checklist displaying price and duration per service. */
export function AppointmentServicePicker({
  services,
  selectedIds,
  errorMessage,
  onToggle,
}: AppointmentServicePickerProps) {
  return (
    <div className="space-y-2">
      <Label>Chọn dịch vụ ({selectedIds.length} đã chọn) *</Label>
      <div className="max-h-48 space-y-2 overflow-y-auto rounded-xl border border-border p-2.5">
        {services.length === 0 ? (
          <p className="p-2 text-[14px] text-muted-foreground">
            Chưa có dịch vụ nào đang kinh doanh.
          </p>
        ) : (
          services.map((svc) => {
            const selected = selectedIds.includes(svc.id);
            return (
              <button
                key={svc.id}
                type="button"
                onClick={() => onToggle(svc.id)}
                className={cn(
                  "flex min-h-[44px] w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-[14px] transition-colors",
                  selected
                    ? "border-primary bg-secondary text-foreground"
                    : "border-border bg-card hover:bg-muted"
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded border",
                      selected
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-card"
                    )}
                  >
                    {selected ? <Check className="h-3.5 w-3.5" /> : null}
                  </span>
                  <span className="font-medium">{svc.name}</span>
                </div>
                <span className="text-[13px] text-muted-foreground">
                  {formatCurrencyVND(svc.price)} • {svc.duration_minutes}p
                </span>
              </button>
            );
          })
        )}
      </div>
      {errorMessage ? (
        <p className="text-[13px] text-spa-error">{errorMessage}</p>
      ) : null}
    </div>
  );
}
