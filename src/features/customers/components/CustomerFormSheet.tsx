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
import { createCustomer, updateCustomer } from "@/features/customers/actions";
import { CustomerFormFields } from "@/features/customers/components/CustomerFormFields";
import {
  customerSchema,
  type CustomerFormValues,
} from "@/features/customers/schemas";
import type { CustomerRow } from "@/features/customers/types";

interface CustomerFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCustomer: CustomerRow | null;
  onSaved: () => void;
}

/** Slide-over Sheet modal to create or update a customer profile. */
export function CustomerFormSheet({
  open,
  onOpenChange,
  editingCustomer,
  onSaved,
}: CustomerFormSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      zalo_phone: "",
      email: "",
      address: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (editingCustomer) {
      reset({
        full_name: editingCustomer.full_name,
        phone: editingCustomer.phone,
        zalo_phone: editingCustomer.zalo_phone ?? "",
        email: editingCustomer.email ?? "",
        address: editingCustomer.address ?? "",
        notes: editingCustomer.notes ?? "",
      });
    } else {
      reset({
        full_name: "",
        phone: "",
        zalo_phone: "",
        email: "",
        address: "",
        notes: "",
      });
    }
  }, [editingCustomer, open, reset]);

  async function onSubmit(values: CustomerFormValues) {
    setIsSubmitting(true);
    const result = editingCustomer
      ? await updateCustomer({ ...values, id: editingCustomer.id })
      : await createCustomer(values);
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.error ?? "Không thể lưu thông tin khách hàng.");
      return;
    }

    toast.success(
      editingCustomer
        ? "Đã cập nhật thông tin khách hàng!"
        : "Đã thêm khách hàng mới!"
    );
    onOpenChange(false);
    onSaved();
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto bg-card sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle className="font-heading text-xl">
            {editingCustomer ? "Cập nhật khách hàng" : "Thêm khách hàng mới"}
          </SheetTitle>
          <SheetDescription className="text-[14px]">
            Lưu thông tin liên hệ và ghi chú tình trạng da để tư vấn tốt hơn.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6" noValidate>
          <CustomerFormFields
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </SheetContent>
    </Sheet>
  );
}
