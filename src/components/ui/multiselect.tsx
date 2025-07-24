"use client";

import * as React from "react";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Option = {
  label: string;
  value: string;
};

type MultiSelectProps = {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  creatable?: boolean;
  className?: string;
};

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder = "Select...",
  creatable = false,
  className,
}) => {
  const [input, setInput] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [filtered, setFiltered] = React.useState<Option[]>(options);

  React.useEffect(() => {
    if (input.length === 0) {
      setFiltered(options);
      return;
    }
    setFiltered(
      options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(input.toLowerCase()) ||
          opt.value.toLowerCase().includes(input.toLowerCase())
      )
    );
  }, [input, options]);

  const handleSelect = (value: string) => {
    if (!selected.includes(value)) {
      onChange([...selected, value]);
      setInput("");
    }
    setOpen(true);
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter((v) => v !== value));
  };

  const handleCreate = () => {
    if (
      input &&
      !selected.includes(input) &&
      !options.find((opt) => opt.value.toLowerCase() === input.toLowerCase())
    ) {
      onChange([...selected, input]);
      setInput("");
      setOpen(true);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "flex flex-wrap items-center rounded-md border border-input bg-background px-2 py-1 min-h-[42px] gap-1 cursor-text focus-within:ring-2 focus-within:ring-ring"
        )}
        onClick={() => setOpen(true)}
        tabIndex={0}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      >
        {selected.map((val) => (
          <Badge
            key={val}
            className="flex items-center gap-1 px-2 py-0.5"
            variant="secondary"
          >
            {val}
            <button
              type="button"
              className="ml-1 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(val);
              }}
              aria-label={`Remove ${val}`}
              tabIndex={-1}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Command className="flex-1 relative bg-transparent border-none shadow-none p-0">
          <CommandInput
            value={input}
            onValueChange={setInput}
            placeholder={selected.length === 0 ? placeholder : ""}
            onFocus={() => setOpen(true)}
            className="bg-transparent border-none outline-none shadow-none h-8"
            onKeyDown={(e) => {
              if (
                creatable &&
                e.key === "Enter" &&
                input &&
                !filtered.length
              ) {
                e.preventDefault();
                handleCreate();
              }
            }}
          />
          {open && (
            <div className="absolute left-0 top-10 z-10 w-full bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-auto">
              <CommandList>
                {filtered.length > 0 &&
                  filtered.map((opt) => (
                    <CommandItem
                      key={opt.value}
                      onSelect={() => handleSelect(opt.value)}
                      className={cn(
                        "cursor-pointer",
                        selected.includes(opt.value) &&
                          "opacity-40 pointer-events-none"
                      )}
                    >
                      {opt.label}
                    </CommandItem>
                  ))}
                {creatable &&
                  input &&
                  !options.find(
                    (opt) => opt.value.toLowerCase() === input.toLowerCase()
                  ) &&
                  !selected.includes(input) && (
                    <CommandItem
                      onSelect={handleCreate}
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create "{input}"
                    </CommandItem>
                  )}
                {!filtered.length &&
                  (!creatable || selected.includes(input) || !input) && (
                    <div className="px-2 py-2 text-sm text-muted-foreground">
                      No options found
                    </div>
                  )}
              </CommandList>
            </div>
          )}
        </Command>
      </div>
    </div>
  );
};