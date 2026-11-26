"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAction } from "@/features/auth/actions";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas";

/** Registration form creating the user account, Spa profile, and default automation rules. */
export function RegisterForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      spaName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setIsSubmitting(true);
    const result = await registerAction(values);
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.error ?? "Đăng ký không thành công.");
      return;
    }

    if (result.data?.requiresEmailConfirmation) {
      toast.success(
        "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận trước khi đăng nhập."
      );
      router.push("/login");
      return;
    }

    toast.success("Tạo tài khoản Spa thành công!");
    router.push(result.data?.redirectTo ?? "/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="reg-spa-name" className="text-[15px] font-medium">
          Tên Spa của bạn
        </Label>
        <Input
          id="reg-spa-name"
          type="text"
          placeholder="VD: Lan Anh Beauty & Spa"
          className="min-h-[44px] rounded-lg text-[15px]"
          {...register("spaName")}
        />
        {errors.spaName ? (
          <p className="text-[13px] text-spa-error">{errors.spaName.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reg-phone" className="text-[15px] font-medium">
          Số điện thoại Spa
        </Label>
        <Input
          id="reg-phone"
          type="tel"
          autoComplete="tel"
          placeholder="0901234567"
          className="min-h-[44px] rounded-lg text-[15px]"
          {...register("phone")}
        />
        {errors.phone ? (
          <p className="text-[13px] text-spa-error">{errors.phone.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reg-email" className="text-[15px] font-medium">
          Email đăng nhập
        </Label>
        <Input
          id="reg-email"
          type="email"
          autoComplete="email"
          placeholder="chuspalan@gmail.com"
          className="min-h-[44px] rounded-lg text-[15px]"
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-[13px] text-spa-error">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="reg-password" className="text-[15px] font-medium">
            Mật khẩu
          </Label>
          <Input
            id="reg-password"
            type="password"
            autoComplete="new-password"
            placeholder="Ít nhất 6 ký tự"
            className="min-h-[44px] rounded-lg text-[15px]"
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-[13px] text-spa-error">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="reg-confirm-password"
            className="text-[15px] font-medium"
          >
            Nhập lại mật khẩu
          </Label>
          <Input
            id="reg-confirm-password"
            type="password"
            autoComplete="new-password"
            placeholder="Nhập lại mật khẩu"
            className="min-h-[44px] rounded-lg text-[15px]"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword ? (
            <p className="text-[13px] text-spa-error">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="min-h-[44px] w-full rounded-lg text-[15px] font-medium"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang tạo tài khoản...
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4" />
            Tạo tài khoản Spa miễn phí
          </>
        )}
      </Button>

      <p className="pt-2 text-center text-[15px] text-muted-foreground">
        Đã có tài khoản?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Đăng nhập ngay
        </Link>
      </p>
    </form>
  );
}
