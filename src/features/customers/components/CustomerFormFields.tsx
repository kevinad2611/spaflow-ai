"use client";

import { Loader2 } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CustomerFormValues } from "@/features/customers/schemas";

interface CustomerFormFieldsProps {
  register: UseFormRegister<CustomerFormValues>;
  errors: FieldErrors<CustomerFormValues>;
  isSubmitting: boolean;
  onCancel: () => void;
}

/** Form inputs and submit actions for creating or editing a customer. */
export function CustomerFormFields({
  register,
  errors,
  isSubmitting,
  onCancel,
}: CustomerFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="cust-name">Họ và tên *</Label>
        <Input
          id="cust-name"
          placeholder="VD: Trần Thị Minh Thư"
          className="min-h-[44px] rounded-lg"
          {...register("full_name")}
        />
        {errors.full_name ? (
          <p className="text-[13px] text-spa-error">
            {errors.full_name.message}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="cust-phone">Số điện thoại *</Label>
          <Input
            id="cust-phone"
            type="tel"
            placeholder="0901234567"
            className="min-h-[44px] rounded-lg"
            {...register("phone")}
          />
          {errors.phone ? (
            <p className="text-[13px] text-spa-error">{errors.phone.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cust-zalo">Số Zalo (nếu khác)</Label>
          <Input
            id="cust-zalo"
            type="tel"
            placeholder="0901234567"
            className="min-h-[44px] rounded-lg"
            {...register("zalo_phone")}
          />
          {errors.zalo_phone ? (
            <p className="text-[13px] text-spa-error">
              {errors.zalo_phone.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cust-email">Email (tùy chọn)</Label>
        <Input
          id="cust-email"
          type="email"
          placeholder="khachhang@gmail.com"
          className="min-h-[44px] rounded-lg"
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-[13px] text-spa-error">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cust-address">Địa chỉ (tùy chọn)</Label>
        <Input
          id="cust-address"
          placeholder="Số nhà, đường, quận/huyện..."
          className="min-h-[44px] rounded-lg"
          {...register("address")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cust-notes">Ghi chú tình trạng da / sức khỏe</Label>
        <Textarea
          id="cust-notes"
          rows={3}
          placeholder="VD: Da nhạy cảm, dị ứng vitamin C, đang theo liệu trình trị mụn..."
          className="rounded-lg"
          {...register("notes")}
        />
      </div>

      <div className="flex gap-3 pt-3">
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
            "Lưu khách hàng"
          )}
        </Button>
      </div>
    </div>
  );
}
