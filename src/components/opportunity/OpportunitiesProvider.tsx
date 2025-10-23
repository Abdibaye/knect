"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Opportunity, OpportunityFilters, defaultFilters } from "./types";

interface OpportunitiesContextValue {
  filters: OpportunityFilters;
  setFilters: React.Dispatch<React.SetStateAction<OpportunityFilters>>;
  loading: boolean;
  error: string | null;
  data: Opportunity[];
  filtered: Opportunity[];
  hasLoadedOnce: boolean;
  skip: number;
  setSkip: React.Dispatch<React.SetStateAction<number>>;
  take: number;
  universities: string[];
  departments: string[];
  refresh: () => void;
}

const OpportunitiesContext = createContext<OpportunitiesContextValue | undefined>(undefined);

export function OpportunitiesProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<OpportunityFilters>(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Opportunity[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const take = 20;

  const refresh = useCallback(() => {
    setRefreshToken((token) => token + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (filters.search) params.set("q", filters.search);
        params.set("take", String(take));
        params.set("skip", String(skip));
        const res = await fetch(`/api/opportunities?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Failed (${res.status})`);
        const items: any[] = await res.json();
        const mapped: Opportunity[] = items.map((o) => ({
          id: o.id,
          title: o.title,
          provider: {
            id: o.postedBy?.id ?? o.postedById ?? "",
            name: o.provider || o.postedBy?.name || "Unknown",
            image: o.providerLogo || o.postedBy?.image,
          },
          type: (o.type as Opportunity["type"]) ?? "Project",
          description: o.description,
          deadline: o.deadline ? new Date(o.deadline).toISOString() : undefined,
          tags: o.tags ?? [],
          university: o.university ?? undefined,
          department: o.department ?? undefined,
          bannerImage: o.bannerImage ?? undefined,
          createdAt: new Date(o.createdAt).toISOString(),
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

    return () => {
      controller.abort();
    };
  }, [filters.search, skip, take, refreshToken]);

  const filtered = useMemo(() => {
    return data.filter((opportunity) => {
      if (
        filters.search &&
        !opportunity.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !opportunity.description.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (filters.types.length && !filters.types.includes(opportunity.type)) {
        return false;
      }
      if (
        filters.universities.length &&
        (!opportunity.university || !filters.universities.includes(opportunity.university))
      ) {
        return false;
      }
      if (
        filters.departments.length &&
        (!opportunity.department || !filters.departments.includes(opportunity.department))
      ) {
        return false;
      }
      return true;
    });
  }, [data, filters]);

  const universities = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.university).filter(Boolean))) as string[];
  }, [data]);

  const departments = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.department).filter(Boolean))) as string[];
  }, [data]);

  const value = useMemo<OpportunitiesContextValue>(
    () => ({
      filters,
      setFilters,
      loading,
      error,
      data,
      filtered,
      hasLoadedOnce,
      skip,
      setSkip,
      take,
      universities,
      departments,
      refresh,
    }),
    [filters, loading, error, data, filtered, hasLoadedOnce, skip, universities, departments, refresh]
  );

  return <OpportunitiesContext.Provider value={value}>{children}</OpportunitiesContext.Provider>;
}

export function useOpportunities() {
  const context = useContext(OpportunitiesContext);
  if (!context) {
    throw new Error("useOpportunities must be used within an OpportunitiesProvider");
  }
  return context;
}
