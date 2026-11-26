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
import { createService, updateService } from "@/features/services/actions";
import { ServiceFormFields } from "@/features/services/components/ServiceFormFields";
import {
  serviceSchema,
  type ServiceFormValues,
} from "@/features/services/schemas";
import {
  SERVICE_CATEGORIES,
  type ServiceRow,
} from "@/features/services/types";

interface ServiceFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingService: ServiceRow | null;
  onSaved: () => void;
}

/** Slide-over Sheet form to create or edit a Spa service. */
export function ServiceFormSheet({
  open,
  onOpenChange,
  editingService,
  onSaved,
}: ServiceFormSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      category: "Chăm sóc da",
      price: 250000,
      duration_minutes: 60,
      description: "",
    },
  });

  useEffect(() => {
    if (editingService) {
      const matchedCategory = SERVICE_CATEGORIES.includes(
        editingService.category as (typeof SERVICE_CATEGORIES)[number]
      )
        ? (editingService.category as (typeof SERVICE_CATEGORIES)[number])
        : "Khác";
      reset({
        name: editingService.name,
        category: matchedCategory,
        price: editingService.price,
        duration_minutes: editingService.duration_minutes,
        description: editingService.description ?? "",
      });
    } else {
      reset({
        name: "",
        category: "Chăm sóc da",
        price: 250000,
        duration_minutes: 60,
        description: "",
      });
    }
  }, [editingService, open, reset]);

  async function onSubmit(values: ServiceFormValues) {
    setIsSubmitting(true);
    const result = editingService
      ? await updateService({ ...values, id: editingService.id })
      : await createService(values);
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.error ?? "Không thể lưu dịch vụ.");
      return;
    }

    toast.success(
      editingService ? "Đã cập nhật dịch vụ!" : "Đã thêm dịch vụ mới!"
    );
    onOpenChange(false);
    onSaved();
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto bg-card sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle className="font-heading text-xl">
            {editingService ? "Cập nhật dịch vụ" : "Thêm dịch vụ mới"}
          </SheetTitle>
          <SheetDescription className="text-[14px]">
            Nhập thông tin bảng giá và thời lượng thực hiện liệu trình.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <ServiceFormFields
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
