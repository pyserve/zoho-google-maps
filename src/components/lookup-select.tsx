"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ZohoData } from "@/contexts/zoho-context";
import { useFetchRecords } from "@/hooks/fetch-records";
import { useSearchRecords } from "@/hooks/search-records";
import { cn } from "@/lib/utils";

type RecordType = {
  id: string;
  First_Name?: string;
  Last_Name?: string;
  [key: string]: any;
};

type OptionType = { label: string; value: string };

export default function LookupSelect({
  module,
  value,
  onValueChange,
  zoho,
  fields,
}: {
  module: string;
  value: string;
  onValueChange: (value: string) => void;
  zoho: ZohoData | null;
  fields: string[];
}) {
  const { data: records } = useFetchRecords({
    module,
    fields,
  });

  const recordOptions = records?.map((record: RecordType) => ({
    label: `${record.First_Name} ${record.Last_Name}`,
    value: record.id,
  }));

  const [options, setOptions] = React.useState<OptionType[]>([]);
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const searchRecords = useSearchRecords();
  const debounce = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    const filterRecords = async () => {
      const filters = fields.map((field, idx) => ({
        selected: true,
        api_name: field,
        operator: "contains",
        value: search.split(" ")?.[idx] ?? "",
        data_type: "text",
        json_type: "string",
      }));
      if (!zoho) return;
      const results = await searchRecords.mutateAsync({
        filters,
        Entity: module,
        fields,
        mandatoryFields: [],
        limit: 2000,
      });
      setOptions(
        results?.map((result: any) => ({
          label: fields.map((field) => result?.[field]).join(" "),
          value: result.id,
        }))
      );
    };

    if (search && search.trim() !== "") {
      debounce.current = setTimeout(() => {
        filterRecords();
      }, 1000);
    } else {
      setOptions(recordOptions);
    }
    return () => {
      if (debounce.current) {
        clearTimeout(debounce.current);
        debounce.current = null;
      }
    };
  }, [search, records]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? options?.find((option) => option.value === value)?.label
            : "Select option..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search option..."
            value={search}
            onValueChange={setSearch}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
