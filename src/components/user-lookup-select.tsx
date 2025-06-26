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
import { useFetchUsers } from "@/hooks/fetch-users";
import { cn } from "@/lib/utils";

type RecordType = {
  id: string;
  First_Name?: string;
  Last_Name?: string;
  [key: string]: any;
};

type OptionType = { label: string; value: string };

export default function UserLookupSelect({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  const { data: records } = useFetchUsers();

  const recordOptions = records?.map((record: RecordType) => ({
    label: `${record.full_name}`,
    value: record.id,
  }));

  const [options, setOptions] = React.useState<OptionType[]>([]);
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const filterRecords = async () => {
      const results = recordOptions.filter((option: OptionType) =>
        option.label?.toLowerCase().includes(search.toLowerCase())
      );
      setOptions(results);
    };

    if (search && search.trim() !== "") {
      filterRecords();
    } else {
      setOptions(recordOptions);
    }
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
