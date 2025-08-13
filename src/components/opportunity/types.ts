export type OpportunityType = "Internship" | "Job" | "Scholarship" | "Grant" | "Conference" | "Project";

export interface Opportunity {
  id: string;
  title: string;
  provider: { id: string; name: string; image?: string };
  type: OpportunityType;
  description: string;
  deadline?: string; // ISO date
  tags?: string[];
  university?: string;
  department?: string;
  createdAt: string; // ISO date
  requirements?: string[];
  eligibility?: string;
  benefits?: string;
  applicationLink?: string;
  contactEmail?: string;
}

export interface OpportunityFilters {
  types: OpportunityType[];
  universities: string[];
  departments: string[];
  datePosted?: string; // e.g. last7,last30
  search?: string;
}

export const defaultFilters: OpportunityFilters = {
  types: [],
  universities: [],
  departments: [],
  datePosted: undefined,
  search: "",
};
