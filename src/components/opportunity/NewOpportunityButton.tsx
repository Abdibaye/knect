"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { OpportunityCreateForm } from "./OpportunityCreateForm";
import { cn } from "@/lib/utils";
import { useOpportunities } from "./OpportunitiesProvider";

type NewOpportunityButtonProps = {
  onCreated?: () => void;
  buttonClassName?: string;
};

export function NewOpportunityButton({ onCreated, buttonClassName }: NewOpportunityButtonProps) {
  const { refresh, setFilters } = useOpportunities();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className={cn("shrink-0 bg-accent/20", buttonClassName)}>
          <Plus className="mr-1 h-4 w-4" /> New Opportunity
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post Opportunity</DialogTitle>
        </DialogHeader>
        <OpportunityCreateForm
          onCreated={() => {
            setCreateOpen(false);
            onCreated?.();
            setFilters((prev) => ({ ...prev }));
            refresh();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
