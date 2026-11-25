"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ reset }: ErrorBoundaryProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-spa-error">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Đã có sự cố xảy ra
        </h2>
        <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
          Hệ thống đang gặp chút gián đoạn, vui lòng thử lại.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-[15px] font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          <RotateCcw className="h-4 w-4" />
          Tải lại trang
        </button>
      </div>
    </div>
  );
}
