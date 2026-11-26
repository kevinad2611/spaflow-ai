"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/features/auth/actions";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas";

/** Email/password sign-in form with Zod validation and Vietnamese feedback. */
export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsSubmitting(true);
    const result = await loginAction(values);
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.error ?? "Đăng nhập thất bại.");
      return;
    }

    toast.success("Đăng nhập thành công!");
    router.push(result.data?.redirectTo ?? "/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="login-email" className="text-[15px] font-medium">
          Email
        </Label>
        <Input
          id="login-email"
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

      <div className="space-y-1.5">
        <Label htmlFor="login-password" className="text-[15px] font-medium">
          Mật khẩu
        </Label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder="Nhập mật khẩu của bạn"
          className="min-h-[44px] rounded-lg text-[15px]"
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-[13px] text-spa-error">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="min-h-[44px] w-full rounded-lg text-[15px] font-medium"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang đăng nhập...
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            Đăng nhập
          </>
        )}
      </Button>

      <p className="pt-2 text-center text-[15px] text-muted-foreground">
        Chưa có tài khoản Spa?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:underline"
        >
          Đăng ký dùng thử miễn phí
        </Link>
      </p>
    </form>
  );
}
