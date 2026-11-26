"use client";

import { Loader2 } from "lucide-react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AppointmentCustomerField } from "@/features/appointments/components/AppointmentCustomerField";
import { AppointmentServicePicker } from "@/features/appointments/components/AppointmentServicePicker";
import type { CreateAppointmentValues } from "@/features/appointments/schemas";
import type { AppointmentFormOptions } from "@/features/appointments/types";
import { calculateEndTime } from "@/features/appointments/utils";
import { formatCurrencyVND } from "@/lib/utils";

interface AppointmentFormFieldsProps {
  options: AppointmentFormOptions;
  register: UseFormRegister<CreateAppointmentValues>;
  errors: FieldErrors<CreateAppointmentValues>;
  watch: UseFormWatch<CreateAppointmentValues>;
  setValue: UseFormSetValue<CreateAppointmentValues>;
  isSubmitting: boolean;
  onCancel: () => void;
}

/** Form fields for booking an appointment, supporting quick customer creation and multi-service pricing. */
export function AppointmentFormFields({
  options,
  register,
  errors,
  watch,
  setValue,
  isSubmitting,
  onCancel,
}: AppointmentFormFieldsProps) {
  const selectedServiceIds = watch("service_ids");
  const startTime = watch("start_time");

  const chosenServices = options.services.filter((s) =>
    selectedServiceIds.includes(s.id)
  );
  const totalPrice = chosenServices.reduce((sum, s) => sum + s.price, 0);
  const totalMinutes = chosenServices.reduce(
    (sum, s) => sum + s.duration_minutes,
    0
  );
  const estimatedEnd =
    chosenServices.length > 0 && startTime
      ? calculateEndTime(startTime, totalMinutes)
      : "--:--";

  function toggleService(serviceId: string) {
    const exists = selectedServiceIds.includes(serviceId);
    const next = exists
      ? selectedServiceIds.filter((id) => id !== serviceId)
      : [...selectedServiceIds, serviceId];
    setValue("service_ids", next, { shouldValidate: true });
  }

  return (
    <div className="space-y-4">
      <AppointmentCustomerField
        customers={options.customers}
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
      />

      <AppointmentServicePicker
        services={options.services}
        selectedIds={selectedServiceIds}
        errorMessage={errors.service_ids?.message}
        onToggle={toggleService}
      />

      <div className="space-y-1.5">
        <Label>Nhân viên phụ trách</Label>
        <Select
          value={watch("staff_id") ?? "unassigned"}
          onValueChange={(val) =>
            setValue("staff_id", val, { shouldValidate: true })
          }
        >
          <SelectTrigger className="min-h-[44px] rounded-lg">
            <SelectValue placeholder="Chọn nhân viên" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Chưa phân công cụ thể</SelectItem>
            {options.staff.map((st) => (
              <SelectItem key={st.id} value={st.id}>
                {st.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="appt-date">Ngày hẹn *</Label>
          <Input
            id="appt-date"
            type="date"
            className="min-h-[44px] rounded-lg"
            {...register("appointment_date")}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="appt-time">Giờ bắt đầu *</Label>
          <Input
            id="appt-time"
            type="time"
            className="min-h-[44px] rounded-lg"
            {...register("start_time")}
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-secondary/70 px-4 py-3 text-[14px]">
        <span className="text-muted-foreground">
          Dự kiến xong: <strong className="text-foreground">{estimatedEnd}</strong>
        </span>
        <span className="font-heading text-base font-bold text-primary">
          {formatCurrencyVND(totalPrice)}
        </span>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="appt-notes">Ghi chú (tùy chọn)</Label>
        <Textarea
          id="appt-notes"
          rows={2}
          placeholder="VD: Khách yêu cầu phòng riêng..."
          className="rounded-lg"
          {...register("notes")}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="min-h-[44px] flex-1 rounded-lg"
        >
          Hủy bỏ
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-h-[44px] flex-1 rounded-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            "Lưu lịch hẹn"
          )}
        </Button>
      </div>
    </div>
  );
}
