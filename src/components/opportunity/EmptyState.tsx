import Image from "next/image";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Image src="/file.svg" alt="Empty" width={96} height={96} className="opacity-70" />
      <h3 className="mt-6 text-lg font-semibold">No opportunities found</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-md">Try adjusting your filters or check back later for new opportunities.</p>
    </div>
  );
}
