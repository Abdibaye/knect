import { Skeleton } from "@/components/ui/skeleton";

export default function PostCardSkeleton() {
  return (
    <article className="rounded-xl border bg-card text-card-foreground shadow-sm p-4 w-full">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Skeleton className="h-5 w-14 rounded" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </header>

      {/* Title & Summary */}
      <section className="mt-3 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
      </section>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-3">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>

      {/* Image */}
      <Skeleton className="mt-4 h-64 w-full rounded-xl" />

      {/* Attachments */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3 min-w-0">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3 min-w-0">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        <Skeleton className="h-9 w-full rounded-md" />
        <Skeleton className="h-9 w-full rounded-md" />
        <Skeleton className="h-9 w-full rounded-md" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>

      {/* Footer */}
      <footer className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-14" />
        </div>
        <div className="flex -space-x-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </footer>

      {/* Identifiers */}
      <div className="mt-2 flex items-center gap-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-40" />
      </div>
    </article>
  );
}
