export function OpportunitySkeleton() {
  return (
    <>
      {/* Header section with avatar + title + meta */}
      <article
        role="article"
        tabIndex={-1}
        aria-label="Loading opportunity"
        className="group relative w-full overflow-hidden rounded-2xl border bg-card p-4 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 hover:shadow-md hover:-translate-y-0.5 cursor-pointer animate-pulse"
      >
        {/* Bookmark button placeholder */}
        <div className="absolute top-4 right-4 rounded-full p-2 hover:bg-accent/50 transition">
          <div className="h-5 w-5 bg-muted rounded" />
        </div>

        {/* Main content */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-muted shrink-0" />
          <div className="flex-1 min-w-0 space-y-3">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="flex flex-wrap gap-2">
              <div className="h-2.5 bg-muted rounded w-24" />
              <div className="h-2.5 bg-muted rounded w-16" />
              <div className="h-2.5 bg-muted rounded w-20" />
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-muted/80 rounded w-full" />
              <div className="h-3 bg-muted/70 rounded w-11/12" />
              <div className="h-3 bg-muted/60 rounded w-2/3" />
            </div>
          </div>
        </div>

        {/* Badges / tags row placeholder */}
        <div className="flex flex-wrap gap-2">
          <div className="h-5 w-16 bg-muted rounded-full" />
          <div className="h-5 w-14 bg-muted rounded-full" />
          <div className="h-5 w-12 bg-muted rounded-full" />
          <div className="h-5 w-20 bg-muted rounded-full" />
        </div>

        {/* Actions row */}
        <div className="flex items-center gap-3 pt-1">
          <div className="h-8 w-20 bg-muted rounded-md" />
          <div className="h-8 w-20 bg-muted rounded-md hidden md:block" />
        </div>
      </article>
    </>
  );
}
