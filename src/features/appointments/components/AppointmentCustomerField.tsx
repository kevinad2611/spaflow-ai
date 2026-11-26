"use client";

import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreateAppointmentValues } from "@/features/appointments/schemas";
import type { AppointmentFormOptions } from "@/features/appointments/types";

interface AppointmentCustomerFieldProps {
  customers: AppointmentFormOptions["customers"];
  register: UseFormRegister<CreateAppointmentValues>;
  errors: FieldErrors<CreateAppointmentValues>;
  watch: UseFormWatch<CreateAppointmentValues>;
  setValue: UseFormSetValue<CreateAppointmentValues>;
}

/** Customer selector with one-click switch to quick-create a new customer inline. */
export function AppointmentCustomerField({
  customers,
  register,
  errors,
  watch,
  setValue,
}: AppointmentCustomerFieldProps) {
  const customerMode = watch("customer_mode");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Khách hàng *</Label>
        <button
          type="button"
          onClick={() =>
            setValue(
              "customer_mode",
              customerMode === "existing" ? "quick_new" : "existing"
            )
          }
          className="text-[13px] font-medium text-primary hover:underline"
        >
          {customerMode === "existing"
            ? "+ Tạo nhanh khách mới"
            : "Chọn từ danh sách có sẵn"}
        </button>
      </div>

      {customerMode === "existing" ? (
        <div>
          <Select
            value={watch("customer_id") ?? ""}
            onValueChange={(val) =>
              setValue("customer_id", val, { shouldValidate: true })
            }
          >
            <SelectTrigger className="min-h-[44px] rounded-lg">
              <SelectValue placeholder="Chọn khách hàng" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.full_name} ({c.phone})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.customer_id ? (
            <p className="mt-1 text-[13px] text-spa-error">
              {errors.customer_id.message}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-secondary/40 p-3 sm:grid-cols-2">
          <div>
            <Input
              placeholder="Tên khách hàng *"
              className="min-h-[44px] rounded-lg bg-card"
              {...register("quick_customer_name")}
            />
            {errors.quick_customer_name ? (
              <p className="mt-1 text-[12px] text-spa-error">
                {errors.quick_customer_name.message}
              </p>
            ) : null}
          </div>
          <div>
            <Input
              type="tel"
              placeholder="SĐT (0901234567) *"
              className="min-h-[44px] rounded-lg bg-card"
              {...register("quick_customer_phone")}
            />
            {errors.quick_customer_phone ? (
              <p className="mt-1 text-[12px] text-spa-error">
                {errors.quick_customer_phone.message}
              </p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
