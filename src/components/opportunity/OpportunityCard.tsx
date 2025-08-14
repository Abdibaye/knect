"use client";
import { Opportunity } from "./types";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, CalendarDays } from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

function getDeadlineInfo(deadline?: string) {
  if (!deadline) return { days: null as number | null, status: "none" as "none" | "open" | "soon" | "past" };
  const now = new Date();
  const end = new Date(deadline);
  const diffDays = Math.ceil((end.getTime() - now.getTime()) / 86400000);
  if (diffDays < 0) return { days: diffDays, status: "past" };
  if (diffDays <= 7) return { days: diffDays, status: "soon" };
  return { days: diffDays, status: "open" };
}

const typeColors: Record<string, string> = {
  Internship: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  Job: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
  Scholarship: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
  Grant: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  Conference: "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300",
  Project: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",
};

export default function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const router = useRouter();
  const { days, status } = getDeadlineInfo(opportunity.deadline || undefined) as { days: number | null; status: DeadlineState };
  const [saved, setSaved] = useState(false);
  const shortDesc = useMemo(() => {
    const base = opportunity.description.trim();
    if (base.length <= 180) return base;
    return base.slice(0, 180) + "…";
  }, [opportunity.description]);

  type DeadlineState = "past" | "soon" | "open" | "none";
  const deadlineBadgeStyles: Record<DeadlineState, string> = {
    past: "bg-destructive/10 text-destructive border-destructive/30",
    soon: "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30",
    open: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30",
    none: "hidden",
  };

  return (
    <article
      role="article"
      tabIndex={0}
      aria-label={opportunity.title}
      onClick={() => router.push(`/opportunities/${opportunity.id}`)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); router.push(`/opportunities/${opportunity.id}`); } }}
      className="group relative overflow-hidden rounded-2xl border bg-card p-4 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
    >
      {/* Bookmark button */}
      <button
        onClick={(e) => { e.stopPropagation(); setSaved(s => !s); }}
        aria-pressed={saved}
        aria-label={saved ? "Remove bookmark" : "Bookmark opportunity"}
        className={cn("absolute right-3 top-3 z-10 p-2 rounded-full border bg-background/70 backdrop-blur text-muted-foreground hover:text-foreground hover:bg-accent transition shadow-sm", saved && "bg-primary text-primary-foreground border-primary shadow")}
      >
        <Bookmark className="size-4" />
      </button>

      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center overflow-hidden ring-4 ring-background group-hover:ring-primary/20 transition">
            {opportunity.provider.image ? (
              <Image src={opportunity.provider.image} alt={opportunity.provider.name} width={56} height={56} className="object-cover" />
            ) : (
              <span className="text-base font-semibold">{opportunity.provider.name[0]}</span>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base md:text-lg leading-snug pr-8 group-hover:underline group-hover:underline-offset-2">
            {opportunity.title}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
            <span>{opportunity.provider.name}</span>
            {opportunity.university && <span className="inline-flex items-center">• {opportunity.university}</span>}
            {opportunity.department && <span className="inline-flex items-center">• {opportunity.department}</span>}
          </div>

          <p className="mt-2 text-sm text-foreground/90 line-clamp-3 leading-relaxed">
            {shortDesc}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge className={cn("rounded-full text-xs font-medium px-2 py-0.5", typeColors[opportunity.type])}>{opportunity.type}</Badge>
            {opportunity.tags?.slice(0, 4).map(tag => (
              <Badge key={tag} variant="outline" className="rounded-full text-[11px] px-2 py-0.5">#{tag}</Badge>
            ))}
            {opportunity.deadline && (
              <span
                className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium", deadlineBadgeStyles[status])}
                title={`Deadline: ${new Date(opportunity.deadline).toLocaleDateString()}`}
              >
                <CalendarDays className="size-3" />
                {status === "past" ? "Closed" : new Date(opportunity.deadline).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                {days !== null && days >= 0 && status !== "past" && <span>({days}d)</span>}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <Button size="sm" variant="secondary" className="h-8 px-3" onClick={(e) => { e.stopPropagation(); router.push(`/opportunities/${opportunity.id}`); }}>Details</Button>
        <Button
          size="sm"
          className="h-8 px-3 hidden md:inline-flex"
          variant="outline"
          onClick={(e) => { e.stopPropagation(); setSaved(s => !s); }}
          aria-pressed={saved}
        >
          {saved ? "Saved" : "Save"}
        </Button>
      </div>
    </article>
  );
}
