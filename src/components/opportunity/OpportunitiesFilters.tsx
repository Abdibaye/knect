"use client";

import { FilterBar } from "./FilterBar";
import { useOpportunities } from "./OpportunitiesProvider";

export function OpportunitiesFilters() {
  const { filters, setFilters, universities, departments } = useOpportunities();

  return (
    <FilterBar value={filters} onChange={setFilters} available={{ universities, departments }} />
  );
}
