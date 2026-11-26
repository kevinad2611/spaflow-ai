import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

export default function AppointmentsLoadingPage() {
  return <LoadingSkeleton variant="table" count={5} />;
}
