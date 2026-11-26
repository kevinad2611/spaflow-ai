import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

export default function ServicesLoadingPage() {
  return <LoadingSkeleton variant="table" count={5} />;
}
