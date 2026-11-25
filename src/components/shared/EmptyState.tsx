import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

/** Standard empty-state panel with dashed border, icon, friendly Vietnamese copy, and primary CTA. */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card px-6 py-12 text-center",
        className
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="font-heading text-[18px] font-semibold leading-7 text-foreground">
        {title}
      </h3>
      {description ? (
        <p className="mt-1.5 max-w-md text-[15px] leading-6 text-muted-foreground">
          {description}
        </p>
      ) : null}
      {actionLabel && actionHref ? (
        <Button asChild className="mt-5 min-h-[44px] rounded-lg px-5 text-[15px]">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
      {actionLabel && !actionHref && onAction ? (
        <Button
          type="button"
          onClick={onAction}
          className="mt-5 min-h-[44px] rounded-lg px-5 text-[15px]"
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
