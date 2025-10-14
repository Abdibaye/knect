"use client";
import { useState, useEffect } from "react";
import { OpportunityFilters, OpportunityType } from "./types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  value: OpportunityFilters;
  onChange: (v: OpportunityFilters) => void;
  available: {
    universities: string[];
    departments: string[];
  };
}

const TYPE_OPTIONS: OpportunityType[] = [
  "Internship",
  "Job",
  "Scholarship",
  "Grant",
  "Conference",
  "Project",
];

export function FilterBar({ value, onChange, available }: FilterBarProps) {
  const [open, setOpen] = useState<string | null>(null);

  const toggleItem = <T extends string>(key: keyof OpportunityFilters, item: T) => {
    const arr = (value[key] as T[]) || [];
    const exists = arr.includes(item);
    const next = exists ? arr.filter(i => i !== item) : [...arr, item];
    onChange({ ...value, [key]: next });
  };

  const setSearch = (search: string) => onChange({ ...value, search });
  // Reset control removed per request; can be reintroduced if needed.

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Input
          placeholder="Search opportunities, internships, events…"
          value={value.search}
            onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <div className="flex gap-2 flex-wrap">
          <DropdownMenu open={open === 'types'} onOpenChange={(o) => setOpen(o ? 'types' : null)}>
            <DropdownMenuTrigger asChild>
              <Button variant={value.types.length ? "default" : "outline"} size="sm" className="gap-1">
                Types {value.types.length > 0 && <span className="text-xs font-normal">({value.types.length})</span>} <ChevronDown className="size-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-56 max-h-72 overflow-y-auto">
              <DropdownMenuLabel>Select Types</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {TYPE_OPTIONS.map(t => (
                <DropdownMenuCheckboxItem
                  key={t}
                  checked={value.types.includes(t)}
                  onCheckedChange={() => toggleItem("types", t)}
                >{t}</DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu open={open === 'universities'} onOpenChange={(o) => setOpen(o ? 'universities' : null)}>
            <DropdownMenuTrigger asChild>
              <Button variant={value.universities.length ? "default" : "outline"} size="sm" className="gap-1">
                Universities {value.universities.length > 0 && <span className="text-xs font-normal">({value.universities.length})</span>} <ChevronDown className="size-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-56 max-h-72 overflow-y-auto">
              <DropdownMenuLabel>Select Universities</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {available.universities.map(u => (
                <DropdownMenuCheckboxItem
                  key={u}
                  checked={value.universities.includes(u)}
                  onCheckedChange={() => toggleItem("universities", u)}
                >{u}</DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>


          <DropdownMenu open={open === 'date'} onOpenChange={(o) => setOpen(o ? 'date' : null)}>
            <DropdownMenuTrigger asChild>
              <Button variant={value.datePosted ? "default" : "outline"} size="sm" className="gap-1">
                Date Posted {value.datePosted && <span className="text-xs font-normal">({value.datePosted})</span>} <ChevronDown className="size-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-44">
              <DropdownMenuLabel>Date Posted</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {[
                { label: 'Any Time', value: undefined },
                { label: 'Last 24 hours', value: '1' },
                { label: 'Last 7 days', value: '7' },
                { label: 'Last 30 days', value: '30' },
              ].map(opt => (
                <DropdownMenuCheckboxItem
                  key={opt.label}
                  checked={value.datePosted === opt.value}
                  onCheckedChange={() => onChange({ ...value, datePosted: opt.value })}
                >{opt.label}</DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
  <div className="sm:ml-auto flex gap-2" />
      </div>

      {/* Active filters row */}

      <div className="flex flex-wrap gap-2">
        {value.types.map(t => (
          <Badge key={t} className="gap-1" variant="secondary">{t}<X className="size-3 cursor-pointer" onClick={() => toggleItem("types", t)} /></Badge>
        ))}
        {value.universities.map(u => (
          <Badge key={u} className="gap-1" variant="secondary">{u}<X className="size-3 cursor-pointer" onClick={() => toggleItem("universities", u)} /></Badge>
        ))}
  {value.datePosted && (
          <Badge className="gap-1" variant="secondary">Last {value.datePosted}d<X className="size-3 cursor-pointer" onClick={() => onChange({ ...value, datePosted: undefined })} /></Badge>
        )}
  {(value.types.length + value.universities.length === 0) && (
          <span className="text-muted-foreground text-xs">No filters applied</span>
        )}
      </div>
    </div>
  );
}
