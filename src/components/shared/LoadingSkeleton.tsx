import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonVariant = "cards" | "table" | "detail" | "dashboard";

interface LoadingSkeletonProps {
  variant?: SkeletonVariant;
  count?: number;
  className?: string;
}

/** Shared loading skeleton matching Card, Table, Detail, and Dashboard layouts. */
export function LoadingSkeleton({
  variant = "cards",
  count = 4,
  className,
}: LoadingSkeletonProps) {
  if (variant === "dashboard") {
    return (
      <div className={cn("space-y-5", className)}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-card p-5"
            >
              <Skeleton className="h-4 w-28" />
              <Skeleton className="mt-3 h-8 w-24" />
              <Skeleton className="mt-2 h-3 w-36" />
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <Skeleton className="h-6 w-56" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div
        className={cn(
          "overflow-hidden rounded-xl border border-border bg-card p-5",
          className
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <Skeleton className="h-11 w-64 rounded-lg" />
          <Skeleton className="h-11 w-36 rounded-lg" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-10 w-full rounded-lg" />
          {Array.from({ length: count }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className={cn("space-y-5", className)}>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-11 w-28 rounded-lg" />
              <Skeleton className="h-11 w-28 rounded-lg" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex gap-3">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5",
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="mt-3 h-4 w-28" />
          <Skeleton className="mt-2 h-4 w-full" />
          <div className="mt-4 flex justify-end gap-2">
            <Skeleton className="h-11 w-24 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
