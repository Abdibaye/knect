export function OpportunitySkeleton() {
  return (
    <>
      <article
        role="article"
        tabIndex={-1}
        aria-label="Loading opportunity"
        className="group relative overflow-hidden rounded-2xl border bg-card p-4 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 hover:shadow-md hover:-translate-y-0.5 cursor-pointer animate-pulse"
      >
        {/* Bookmark button placeholder */}
        <div className="absolute right-3 top-3 z-10 p-2 rounded-full border bg-background/70 backdrop-blur">
          <div className="h-5 w-5 bg-muted rounded" />
        </div>

        {/* Banner image placeholder */}
        <div className="mb-3 -mx-4 -mt-4">
          <div className="relative w-full h-36 bg-muted rounded-t-2xl overflow-hidden border-b" />
        </div>

        {/* Main content */}
        <div className="min-w-0 space-y-3">
          <div className="h-5 bg-muted rounded w-3/4" />
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <div className="h-3 bg-muted rounded w-24" />
            <div className="h-3 bg-muted rounded w-16" />
            <div className="h-3 bg-muted rounded w-20" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted/80 rounded w-full" />
            <div className="h-4 bg-muted/70 rounded w-11/12" />
            <div className="h-4 bg-muted/60 rounded w-2/3" />
          </div>
        </div>

        {/* Badges / tags row placeholder */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="h-6 w-16 bg-muted rounded-full" />
          <div className="h-6 w-14 bg-muted rounded-full" />
          <div className="h-6 w-12 bg-muted rounded-full" />
          <div className="h-6 w-20 bg-muted rounded-full" />
        </div>

        {/* Actions row */}
        <div className="mt-4 flex items-center gap-3">
          <div className="h-8 w-20 bg-muted rounded-md" />
          <div className="h-8 w-20 bg-muted rounded-md hidden md:block" />
        </div>
      </article>
    </>
  );
}
