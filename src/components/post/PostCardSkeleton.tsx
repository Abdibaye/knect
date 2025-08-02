import { Skeleton } from "@/components/ui/skeleton";

export default function PostCardSkeleton() {
  return (
    <div className="rounded-xl border lg:ml-15 bg-white dark:bg-zinc-900 shadow-sm p-4 w-full">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>
      {/* Title */}
      <Skeleton className="h-5 w-3/4 mt-4" />
      {/* Content */}
      <div className="space-y-2 mt-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      {/* Image */}
      <Skeleton className="mt-4 h-80 w-full rounded-xl" />
      {/* Footer Icons */}
      <div className="flex justify-around mt-4">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  );
}
