"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { createStaff, updateStaff } from "@/features/staff/actions";
import { staffSchema, type StaffFormValues } from "@/features/staff/schemas";
import {
  STAFF_ROLE_LABELS,
  STAFF_ROLES,
  type StaffRow,
} from "@/features/staff/types";
import type { StaffRole } from "@/types/database.types";

interface StaffFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingStaff: StaffRow | null;
  onSaved: () => void;
}

/** Slide-over Sheet form to create or edit a Spa staff member. */
export function StaffFormSheet({
  open,
  onOpenChange,
  editingStaff,
  onSaved,
}: StaffFormSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      role: "technician",
    },
  });

  useEffect(() => {
    if (editingStaff) {
      reset({
        full_name: editingStaff.full_name,
        phone: editingStaff.phone ?? "",
        role: editingStaff.role,
      });
    } else {
      reset({
        full_name: "",
        phone: "",
        role: "technician",
      });
    }
  }, [editingStaff, open, reset]);

  async function onSubmit(values: StaffFormValues) {
    setIsSubmitting(true);
    const result = editingStaff
      ? await updateStaff({ ...values, id: editingStaff.id })
      : await createStaff(values);
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.error ?? "Không thể lưu thông tin nhân viên.");
      return;
    }

    toast.success(
      editingStaff ? "Đã cập nhật nhân viên!" : "Đã thêm nhân viên mới!"
    );
    onOpenChange(false);
    onSaved();
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto bg-card sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle className="font-heading text-xl">
            {editingStaff ? "Cập nhật nhân viên" : "Thêm nhân viên mới"}
          </SheetTitle>
          <SheetDescription className="text-[14px]">
            Nhập họ tên, số điện thoại và phân vai trò tại Spa.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="staff-name">Họ tên nhân viên</Label>
            <Input
              id="staff-name"
              placeholder="VD: Nguyễn Ngọc Mai"
              className="min-h-[44px] rounded-lg"
              {...register("full_name")}
            />
            {errors.full_name ? (
              <p className="text-[13px] text-spa-error">
                {errors.full_name.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label>Vai trò</Label>
            <Select
              value={watch("role")}
              onValueChange={(val) =>
                setValue("role", val as StaffRole, { shouldValidate: true })
              }
            >
              <SelectTrigger className="min-h-[44px] rounded-lg">
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                {STAFF_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {STAFF_ROLE_LABELS[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="staff-phone">Số điện thoại (tùy chọn)</Label>
            <Input
              id="staff-phone"
              type="tel"
              placeholder="0901234567"
              className="min-h-[44px] rounded-lg"
              {...register("phone")}
            />
            {errors.phone ? (
              <p className="text-[13px] text-spa-error">
                {errors.phone.message}
              </p>
            ) : null}
          </div>

          <div className="flex gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
                "Lưu nhân viên"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
