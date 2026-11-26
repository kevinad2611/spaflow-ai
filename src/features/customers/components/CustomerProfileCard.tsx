"use client";

import { Mail, MapPin, MessageCircle, Pencil, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CustomerRow } from "@/features/customers/types";

interface CustomerProfileCardProps {
  customer: CustomerRow;
  onEditClick: () => void;
}

function formatZaloHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("84") ? `0${digits.slice(2)}` : digits;
  return `https://zalo.me/${normalized}`;
}

/** Customer profile summary card with one-tap Call and Zalo quick actions. */
export function CustomerProfileCard({
  customer,
  onEditClick,
}: CustomerProfileCardProps) {
  const zaloTarget = customer.zalo_phone ?? customer.phone;

  return (
    <Card className="rounded-xl border-border bg-card shadow-sm">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="font-heading text-2xl font-bold text-foreground">
            {customer.full_name}
          </CardTitle>
          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 text-foreground">
              <Phone className="h-4 w-4 text-primary" />
              {customer.phone}
            </span>
            {customer.email ? (
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-primary" />
                {customer.email}
              </span>
            ) : null}
            {customer.address ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                {customer.address}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Button
            asChild
            variant="outline"
            className="min-h-[44px] rounded-lg px-4"
          >
            <a href={`tel:${customer.phone}`}>
              <Phone className="h-4 w-4 text-primary" />
              Gọi điện
            </a>
          </Button>
          <Button
            asChild
            variant="secondary"
            className="min-h-[44px] rounded-lg px-4"
          >
            <a
              href={formatZaloHref(zaloTarget)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4 text-primary" />
              Mở Zalo
            </a>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onEditClick}
            className="min-h-[44px] rounded-lg px-4"
          >
            <Pencil className="h-4 w-4" />
            Sửa
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl border border-border bg-background/70 p-4">
          <p className="text-[13px] font-medium text-muted-foreground">
            Ghi chú tình trạng da &amp; lưu ý sức khỏe
          </p>
          <p className="mt-1 text-[15px] leading-6 text-foreground">
            {customer.notes || "Chưa có ghi chú tình trạng da cho khách hàng này."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
