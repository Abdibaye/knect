"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import OpportunityCard from "./OpportunityCard";
import { FilterBar } from "./FilterBar";
import { EmptyState } from "./EmptyState";
import { Opportunity, OpportunityFilters, defaultFilters } from "./types";
import { OpportunitySkeleton } from "./OpportunitySkeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { OpportunityCreateForm } from "./OpportunityCreateForm";

export default function OpportunitiesPage() {
  const { data: session } = authClient.useSession();
  const [filters, setFilters] = useState<OpportunityFilters>(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Opportunity[]>([]);
  const [take] = useState(20);
  const [skip, setSkip] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Fetch from API with filters
  useEffect(() => {
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (filters.search) params.set("q", filters.search);
        params.set("take", String(take));
        params.set("skip", String(skip));
        const res = await fetch(`/api/opportunities?${params.toString()}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`Failed (${res.status})`);
        const items: any[] = await res.json();
        // Map API shape to UI type
        const mapped: Opportunity[] = items.map((o) => ({
          id: o.id,
          title: o.title,
          provider: { id: o.postedBy?.id ?? o.postedById ?? "", name: o.provider || o.postedBy?.name || "Unknown", image: o.providerLogo || o.postedBy?.image },
          type: (o.type as Opportunity["type"]) ?? "Project",
          description: o.description,
          deadline: o.deadline ? new Date(o.deadline).toISOString() : undefined,
          tags: o.tags ?? [],
          university: o.university ?? undefined,
          department: o.department ?? undefined,
          bannerImage: o.bannerImage ?? undefined,
          createdAt: new Date(o.createdAt).toISOString(),
          // optional fields not in schema are left undefined
        }));
        setData(mapped);
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          setError(e?.message || "Failed to load opportunities");
        }
      } finally {
        setLoading(false);
        setHasLoadedOnce(true);
      }
    }
    load();
    return () => controller.abort();
  }, [filters.search, skip, take]);

  const filtered = useMemo(() => {
    return data.filter(o => {
      if (filters.search && !o.title.toLowerCase().includes(filters.search.toLowerCase()) && !o.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.types.length && !filters.types.includes(o.type)) return false;
      if (filters.universities.length && (!o.university || !filters.universities.includes(o.university))) return false;
      if (filters.departments.length && (!o.department || !filters.departments.includes(o.department))) return false;
      return true;
    });
  }, [data, filters]);

  const universities = Array.from(new Set(data.map(d => d.university).filter(Boolean))) as string[];
  const departments = Array.from(new Set(data.map(d => d.department).filter(Boolean))) as string[];

  return (
      <div className="mx-auto w-full px-3 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 p-3 rounded-md">
          <div className="flex-1 max-w-4xl">
            <FilterBar value={filters} onChange={setFilters} available={{ universities, departments }} />
          </div>
          {session?.user && (
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="shrink-0 bg-accent/20 w-full sm:w-auto mb-7">
                  <Plus className="mr-1 h-4 w-4" /> New Opportunity
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Post Opportunity</DialogTitle>
                </DialogHeader>
                <OpportunityCreateForm onCreated={() => { setCreateOpen(false); /* trigger reload */ setSkip(0); /* reset */ setFilters(f => ({ ...f })); }} />
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {(loading || !hasLoadedOnce) && Array.from({ length: 10 }).map((_, i) => <OpportunitySkeleton key={i} />)}
          {!loading && hasLoadedOnce && !error && filtered.map(o => <OpportunityCard key={o.id} opportunity={o} />)}
        </div>
        {!loading && hasLoadedOnce && (error ? (
          <div className="text-sm text-destructive py-12 text-center">{error}</div>
        ) : (
          filtered.length === 0 && <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 10 }).map((_, i) => <OpportunitySkeleton key={i} />)}
        </div>
        ))}
      </div>
  );
}
