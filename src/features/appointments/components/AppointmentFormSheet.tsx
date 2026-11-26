"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { createAppointment } from "@/features/appointments/actions";
import { AppointmentFormFields } from "@/features/appointments/components/AppointmentFormFields";
import {
  createAppointmentSchema,
  type CreateAppointmentValues,
} from "@/features/appointments/schemas";
import type { AppointmentFormOptions } from "@/features/appointments/types";

interface AppointmentFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  options: AppointmentFormOptions;
  defaultDate: string;
  onSaved: () => void;
}

/** Slide-over Sheet modal to create a new Spa appointment. */
export function AppointmentFormSheet({
  open,
  onOpenChange,
  options,
  defaultDate,
  onSaved,
}: AppointmentFormSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateAppointmentValues>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: {
      customer_mode: options.customers.length > 0 ? "existing" : "quick_new",
      customer_id: "",
      quick_customer_name: "",
      quick_customer_phone: "",
      service_ids: [],
      staff_id: "unassigned",
      appointment_date: defaultDate,
      start_time: "09:00",
      notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        customer_mode: options.customers.length > 0 ? "existing" : "quick_new",
        customer_id: "",
        quick_customer_name: "",
        quick_customer_phone: "",
        service_ids: [],
        staff_id: "unassigned",
        appointment_date: defaultDate,
        start_time: "09:00",
        notes: "",
      });
    }
  }, [defaultDate, open, options.customers.length, reset]);

  async function onSubmit(values: CreateAppointmentValues) {
    setIsSubmitting(true);
    const result = await createAppointment(values);
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.error ?? "Không thể tạo lịch hẹn.");
      return;
    }

    toast.success("Đã tạo lịch hẹn thành công!");
    onOpenChange(false);
    onSaved();
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto bg-card sm:max-w-lg">
        <SheetHeader className="text-left">
          <SheetTitle className="font-heading text-xl">
            Tạo lịch hẹn mới
          </SheetTitle>
          <SheetDescription className="text-[14px]">
            Chọn khách hàng, dịch vụ và kỹ thuật viên phụ trách.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6" noValidate>
          <AppointmentFormFields
            options={options}
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            isSubmitting={isSubmitting}
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </SheetContent>
    </Sheet>
  );
}
