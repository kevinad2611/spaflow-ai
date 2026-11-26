import type { Metadata } from "next";
import { Scissors, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getServices } from "@/features/services/actions";
import { ServicesTab } from "@/features/services/components/ServicesTab";
import { getStaff } from "@/features/staff/actions";
import { StaffTab } from "@/features/staff/components/StaffTab";

export const metadata: Metadata = {
  title: "Dịch vụ & Nhân viên | SpaFlow AI",
  description: "Quản lý bảng giá dịch vụ và đội ngũ nhân viên tại Spa.",
};

export default async function ServicesAndStaffPage() {
  const [servicesRes, staffRes] = await Promise.all([
    getServices(),
    getStaff(),
  ]);

  const services = servicesRes.data ?? [];
  const staffList = staffRes.data ?? [];
  const loadError = servicesRes.error ?? staffRes.error;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold leading-8 text-foreground">
          Dịch vụ &amp; Nhân viên
        </h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          Thiết lập bảng giá liệu trình và danh sách kỹ thuật viên cho Spa của
          bạn.
        </p>
      </div>

      {loadError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-[15px] text-spa-error">
          {loadError}
        </div>
      ) : null}

      <Tabs defaultValue="services" className="space-y-5">
        <TabsList className="grid h-auto w-full max-w-md grid-cols-2 rounded-xl bg-muted p-1">
          <TabsTrigger
            value="services"
            className="min-h-[44px] gap-2 rounded-lg text-[15px] font-medium"
          >
            <Scissors className="h-4 w-4" />
            Dịch vụ ({services.length})
          </TabsTrigger>
          <TabsTrigger
            value="staff"
            className="min-h-[44px] gap-2 rounded-lg text-[15px] font-medium"
          >
            <Users className="h-4 w-4" />
            Nhân viên ({staffList.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="mt-0">
          <ServicesTab services={services} />
        </TabsContent>

        <TabsContent value="staff" className="mt-0">
          <StaffTab staffList={staffList} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
