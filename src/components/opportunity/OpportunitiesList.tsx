"use client";

import OpportunityCard from "./OpportunityCard";
import { OpportunitySkeleton } from "./OpportunitySkeleton";
import { useOpportunities } from "./OpportunitiesProvider";
import NoInternetFallback from "../ui/no-internet";

export function OpportunitiesList() {
  const { loading, hasLoadedOnce, error, filtered } = useOpportunities();

  return (
    <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {(loading || !hasLoadedOnce) && Array.from({ length: 10 }).map((_, i) => <OpportunitySkeleton key={i} />)}
      {!loading && hasLoadedOnce && !error && filtered.length === 0 &&
        Array.from({ length: 10 }).map((_, i) => <OpportunitySkeleton key={`empty-${i}`} />)
      }
      {!loading && hasLoadedOnce && !error && filtered.map((opportunity) => (
        <OpportunityCard key={opportunity.id} opportunity={opportunity} />
      ))}
      {!loading && hasLoadedOnce && error && (
        <div className="col-span-full text-sm text-destructive py-12 text-center">
            <NoInternetFallback onRetry={() => window.location.reload()} />
        </div>
      )}
    </div>
  );
}
