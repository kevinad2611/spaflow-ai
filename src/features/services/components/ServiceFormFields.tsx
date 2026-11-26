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
import type { ServiceFormValues } from "@/features/services/schemas";
import { SERVICE_CATEGORIES } from "@/features/services/types";

interface ServiceFormFieldsProps {
  register: UseFormRegister<ServiceFormValues>;
  errors: FieldErrors<ServiceFormValues>;
  watch: UseFormWatch<ServiceFormValues>;
  setValue: UseFormSetValue<ServiceFormValues>;
  isSubmitting: boolean;
  onCancel: () => void;
}

/** Form fields and submit controls for creating or editing a Spa service. */
export function ServiceFormFields({
  register,
  errors,
  watch,
  setValue,
  isSubmitting,
  onCancel,
}: ServiceFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="svc-name">Tên dịch vụ</Label>
        <Input
          id="svc-name"
          placeholder="VD: Trị mụn chuẩn Y khoa"
          className="min-h-[44px] rounded-lg"
          {...register("name")}
        />
        {errors.name ? (
          <p className="text-[13px] text-spa-error">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label>Danh mục</Label>
        <Select
          value={watch("category")}
          onValueChange={(val) =>
            setValue("category", val as (typeof SERVICE_CATEGORIES)[number], {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger className="min-h-[44px] rounded-lg">
            <SelectValue placeholder="Chọn danh mục" />
          </SelectTrigger>
          <SelectContent>
            {SERVICE_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="svc-price">Giá tiền (VNĐ)</Label>
          <Input
            id="svc-price"
            type="number"
            min={0}
            step={1000}
            className="min-h-[44px] rounded-lg"
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price ? (
            <p className="text-[13px] text-spa-error">{errors.price.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="svc-duration">Thời lượng (phút)</Label>
          <Input
            id="svc-duration"
            type="number"
            min={5}
            step={5}
            className="min-h-[44px] rounded-lg"
            {...register("duration_minutes", { valueAsNumber: true })}
          />
          {errors.duration_minutes ? (
            <p className="text-[13px] text-spa-error">
              {errors.duration_minutes.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="svc-desc">Mô tả liệu trình (tùy chọn)</Label>
        <Textarea
          id="svc-desc"
          rows={3}
          placeholder="Các bước thực hiện chính hoặc lưu ý cho khách..."
          className="rounded-lg"
          {...register("description")}
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
            "Lưu dịch vụ"
          )}
        </Button>
      </div>
    </div>
  );
}
