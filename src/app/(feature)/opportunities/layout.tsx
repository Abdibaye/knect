import { OpportunitiesProvider } from "@/components/opportunity/OpportunitiesProvider";
import { OpportunitiesFilters } from "@/components/opportunity/OpportunitiesFilters";
import { NewOpportunityButton } from "@/components/opportunity/NewOpportunityButton";

export default function OpportunityLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <OpportunitiesProvider>
      <div className="flex flex-col p-6 gap-4 px-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 max-w-4xl">
          <OpportunitiesFilters />
        </div>
        <NewOpportunityButton buttonClassName="w-full sm:w-auto" />
      </div>
      <main className="flex-1 px-4">
        {children}
      </main>
    </OpportunitiesProvider>
  );
}
