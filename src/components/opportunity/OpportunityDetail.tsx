"use client";
import { useEffect, useState } from "react";
import { Opportunity } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bookmark, ExternalLink, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function OpportunityDetail({ id }: { id: string }) {
  const router = useRouter();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Placeholder fetch - replace with API call
    setLoading(true);
    const timer = setTimeout(() => {
      setOpportunity({
        id,
        title: "AI Research Internship",
        provider: { id: "org1", name: "OpenAI Lab" },
        type: "Internship",
        description: "Full description with rich details about the internship responsibilities, research focus, mentorship structure, and expected outcomes.",
        deadline: new Date(Date.now() + 6 * 86400000).toISOString(),
        tags: ["AI", "Research", "ML"],
        university: "MIT",
        department: "Computer Science",
        createdAt: new Date().toISOString(),
        requirements: ["Strong Python skills", "Familiarity with ML frameworks", "Research mindset"],
        eligibility: "Undergraduate or graduate students in CS or related fields",
        benefits: "Stipend, publication support, mentorship, computing resources",
        applicationLink: "https://example.com/apply",
        contactEmail: "hr@example.com",
      });
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) return <div className="p-6">Loading…</div>;
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
