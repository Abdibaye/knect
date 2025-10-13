"use client";
import { useEffect, useState } from "react";
import { Opportunity } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bookmark, ExternalLink, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

function OpportunityDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-6 px-3 sm:px-4 pb-24 animate-pulse">
      {/* Back button */}
      <div className="mb-4 inline-flex items-center gap-1">
        <div className="h-4 w-4 bg-muted rounded" />
        <div className="h-4 w-12 bg-muted rounded" />
      </div>

      <div className="rounded-xl border p-5 sm:p-6 bg-card">
        {/* Header section */}
        <div className="flex flex-col gap-5 md:gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3 flex-1 min-w-0">
            {/* Title */}
            <div className="h-8 bg-muted rounded w-3/4 md:h-9" />
            {/* Provider info */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <div className="h-4 bg-muted rounded w-32" />
              <div className="h-4 bg-muted rounded w-16" />
              <div className="h-4 bg-muted rounded w-20" />
            </div>
            {/* Badges */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
              <div className="h-6 w-20 bg-muted rounded-full" />
              <div className="h-6 w-16 bg-muted rounded-full" />
              <div className="h-6 w-18 bg-muted rounded-full" />
            </div>
          </div>
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="h-8 w-24 bg-muted rounded" />
            <div className="h-8 w-20 bg-muted rounded" />
          </div>
        </div>

        {/* Deadline */}
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border">
          <div className="h-4 w-4 bg-muted rounded" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>

        {/* Banner image */}
        <div className="mt-6 -mx-5 -mb-5">
          <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden border-b" />
        </div>

        {/* Description section */}
        <section className="mt-6 space-y-4">
          <div className="h-6 bg-muted rounded w-24" />
          <div className="space-y-2">
            <div className="h-4 bg-muted/80 rounded w-full" />
            <div className="h-4 bg-muted/70 rounded w-11/12" />
            <div className="h-4 bg-muted/60 rounded w-4/5" />
            <div className="h-4 bg-muted/50 rounded w-3/4" />
          </div>

          <div className="h-5 bg-muted rounded w-20 mt-4" />
          <ul className="space-y-1">
            <li><div className="h-4 bg-muted/70 rounded w-2/3" /></li>
            <li><div className="h-4 bg-muted/70 rounded w-3/4" /></li>
            <li><div className="h-4 bg-muted/70 rounded w-1/2" /></li>
          </ul>

          <div className="h-5 bg-muted rounded w-16 mt-4" />
          <div className="h-4 bg-muted/70 rounded w-full" />

          <div className="h-5 bg-muted rounded w-14 mt-4" />
          <div className="h-4 bg-muted/70 rounded w-3/4" />
        </section>
      </div>

      {/* Mobile bottom action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 sm:hidden border-t bg-background/95 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 flex-1 bg-muted rounded" />
          <div className="h-8 flex-1 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}

export default function OpportunityDetail({ id }: { id: string }) {
  const router = useRouter();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchOpportunity() {
      setLoading(true);
      try {
        const res = await fetch(`/api/opportunities/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setOpportunity(null);
          } else {
            throw new Error(`Failed to fetch opportunity: ${res.status}`);
          }
          return;
        }
        const data = await res.json();
        // Map API shape to UI type
        const mapped: Opportunity = {
          id: data.id,
          title: data.title,
          provider: { 
            id: data.postedBy?.id ?? data.postedById ?? "", 
            name: data.provider || data.postedBy?.name || "Unknown", 
            image: data.providerLogo || data.postedBy?.image 
          },
          type: (data.type as Opportunity["type"]) ?? "Project",
          description: data.description,
          deadline: data.deadline ? new Date(data.deadline).toISOString() : undefined,
          tags: data.tags ?? [],
          university: data.university ?? undefined,
          department: data.department ?? undefined,
          bannerImage: data.bannerImage ?? undefined,
          createdAt: new Date(data.createdAt).toISOString(),
          // optional fields not in schema are left undefined
        };
        setOpportunity(mapped);
      } catch (error: any) {
        console.error('Failed to fetch opportunity:', error);
        setOpportunity(null);
      } finally {
        setLoading(false);
      }
    }
    fetchOpportunity();
  }, [id]);

  if (loading) return <OpportunityDetailSkeleton />;
  if (!opportunity) return <div className="p-6">Not found.</div>;

  const deadlineDate = opportunity.deadline ? new Date(opportunity.deadline) : null;
  const daysLeft = deadlineDate ? Math.ceil((deadlineDate.getTime() - Date.now()) / 86400000) : null;

  return (
    <div className="max-w-4xl mx-auto py-6 px-3 sm:px-4 pb-24">
      <button onClick={() => router.back()} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back
      </button>
      <div className="rounded-xl border p-5 sm:p-6 bg-card">
        <div className="flex flex-col gap-5 md:gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3 flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight break-words">{opportunity.title}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground/90">{opportunity.provider.name}</span>
              {opportunity.university && <span className="shrink-0">• {opportunity.university}</span>}
              {opportunity.department && <span className="shrink-0">• {opportunity.department}</span>}
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
              <Badge className="shrink-0">{opportunity.type}</Badge>
              {opportunity.tags?.map(tag => <Badge key={tag} variant="outline" className="shrink-0">#{tag}</Badge>)}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={() => setSaved(s => !s)} className={cn("justify-center", saved && "bg-primary text-primary-foreground border-primary")}> <Bookmark className="size-4" /> {saved ? "Saved" : "Save"}</Button>
            {opportunity.applicationLink && (
              <Button size="sm" className="justify-center" onClick={() => window.open(opportunity.applicationLink!, "_blank")}>Apply <ExternalLink className="size-4 ml-1" /></Button>
            )}
          </div>
        </div>

        {deadlineDate && (
          <div className={cn("mt-4 inline-flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full border", daysLeft !== null && daysLeft <= 7 && "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 border-red-200 dark:border-red-500/40")}> 
            <CalendarDays className="size-4" /> Deadline: {deadlineDate.toLocaleDateString()} {daysLeft !== null && daysLeft >= 0 && <span className="ml-1">({daysLeft} days left)</span>}
          </div>
        )}

        {/* Banner image */}
        {opportunity.bannerImage && (
          <div className="mt-6 -mx-5 -mb-5">
            <div className="relative w-full overflow-hidden border-b">
              <img
                src={opportunity.bannerImage}
                alt={opportunity.title}
                className="w-full h-auto max-h-64 object-contain"
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  img.onerror = null;
                  img.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjE2QzE0IDE3LjEgMTMuMSAxOCA xMiAxOEgxMEM4LjkxOCAxOCA4IDE3LjEgOCA xNiA4VjRDOCA yLjkgOC45MiAyIDEwIDJDMTAgMiAxMC45MiAyIDEyIDJaTTEyIDIwQzEzLjEwNCAyMCAxNCAxOS4xMDQgMTQgMThIMTAuMDAxQzEwLjAwMSAxOS4xMDQgMTAuODk2IDIwIDEyIDIwWiIgZmlsbD0iIzY5NzM4NSIvPgo8L3N2Zz4K";
                }}
              />
            </div>
          </div>
        )}

        <section className="prose dark:prose-invert max-w-none mt-6 leading-relaxed text-sm sm:text-base">
          <h2>Description</h2>
          <p>{opportunity.description}</p>
          {opportunity.requirements && (
            <><h3>Requirements</h3><ul>{opportunity.requirements.map(r => <li key={r}>{r}</li>)}</ul></>
          )}
          {opportunity.eligibility && (
            <><h3>Eligibility</h3><p>{opportunity.eligibility}</p></>
          )}
          {opportunity.benefits && (
            <><h3>Benefits</h3><p>{opportunity.benefits}</p></>
          )}
          {opportunity.contactEmail && (
            <><h3>Contact</h3><p><a href={`mailto:${opportunity.contactEmail}`} className="text-primary hover:underline">{opportunity.contactEmail}</a></p></>
          )}
        </section>
      </div>

      {/* Mobile bottom action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 sm:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 px-4 py-3 flex items-center gap-3">
        <Button variant="outline" size="sm" className={cn("flex-1", saved && "bg-primary text-primary-foreground border-primary")}
          onClick={() => setSaved(s => !s)}>
          <Bookmark className="size-4" /> {saved ? "Saved" : "Save"}
        </Button>
        {opportunity.applicationLink && (
          <Button size="sm" className="flex-1" onClick={() => window.open(opportunity.applicationLink!, "_blank")}>Apply</Button>
        )}
      </div>
    </div>
  );
}
