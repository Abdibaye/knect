"use client";
import { useEffect, useState, useMemo } from "react";
import { authClient } from "@/lib/auth-client";
import OpportunityCard from "./OpportunityCard";
import { FilterBar } from "./FilterBar";
import { EmptyState } from "./EmptyState";
import { Opportunity, OpportunityFilters, defaultFilters } from "./types";
import { OpportunitySkeleton } from "./OpportunitySkeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function OpportunitiesPage() {
  const { data: session } = authClient.useSession();
  const [filters, setFilters] = useState<OpportunityFilters>(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Opportunity[]>([]);

  // Placeholder fetch - later replace with API route /api/opportunities
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      // mock sample data
      const sample: Opportunity[] = [
        {
          id: "1",
          title: "AI Research Internship",
          provider: { id: "org1", name: "OpenAI Lab" },
          type: "Internship",
          description: "Work on cutting-edge AI research with mentorship and publication opportunities.",
          deadline: new Date(Date.now() + 6 * 86400000).toISOString(),
          tags: ["AI", "Research", "ML"],
          university: "MIT",
          department: "Computer Science",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Engineering Scholarship 2025",
          provider: { id: "org2", name: "Tech Scholars" },
          type: "Scholarship",
          description: "Financial aid for outstanding engineering students with leadership potential.",
          deadline: new Date(Date.now() + 20 * 86400000).toISOString(),
          tags: ["Engineering", "Undergraduate"],
          university: "Stanford",
          department: "Engineering",
          createdAt: new Date().toISOString(),
        },
      ];
      setData(sample);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [filters]);

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
    <div className="w-full">
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-6">
        <FilterBar value={filters} onChange={setFilters} available={{ universities, departments }} />
        <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-5">
          {loading && Array.from({ length: 10 }).map((_, i) => <OpportunitySkeleton key={i} />)}
          {!loading && filtered.map(o => <OpportunityCard key={o.id} opportunity={o} />)}
        </div>
        {!loading && filtered.length === 0 && <EmptyState />}
      </div>
    </div>
  );
}
