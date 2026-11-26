"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomerFormSheet } from "@/features/customers/components/CustomerFormSheet";
import { CustomerProfileCard } from "@/features/customers/components/CustomerProfileCard";
import { ServiceHistoryTabs } from "@/features/customers/components/ServiceHistoryTabs";
import type { CustomerDetailData } from "@/features/customers/types";

interface CustomerDetailViewProps {
  detail: CustomerDetailData;
}

/** Customer detail container combining profile card, edit Sheet, and service history tabs. */
export function CustomerDetailView({ detail }: CustomerDetailViewProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <Button
          asChild
          variant="ghost"
          className="min-h-[44px] -ml-2 rounded-lg px-3 text-[15px] text-muted-foreground"
        >
          <Link href="/dashboard/customers">
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách khách hàng
          </Link>
        </Button>
      </div>

      <CustomerProfileCard
        customer={detail.customer}
        onEditClick={() => setEditOpen(true)}
      />

      <ServiceHistoryTabs appointments={detail.appointments} />

      <CustomerFormSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        editingCustomer={detail.customer}
        onSaved={() => router.refresh()}
      />
    </div>
  );
}
