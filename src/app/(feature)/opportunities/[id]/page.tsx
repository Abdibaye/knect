import { Suspense } from "react";
import OpportunityDetail from "@/components/opportunity/OpportunityDetail";

export default function OpportunityDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="p-6">Loading opportunity…</div>}>
      <OpportunityDetail id={params.id} />
    </Suspense>
  );
}
