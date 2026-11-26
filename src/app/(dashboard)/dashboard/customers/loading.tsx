import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

export default function CustomersLoadingPage() {
  return <LoadingSkeleton variant="table" count={5} />;
}
