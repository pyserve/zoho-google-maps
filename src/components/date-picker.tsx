"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

interface DatePickerProps {
  selectedDate: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DatePicker({
  selectedDate,
  onChange,
  placeholder,
}: DatePickerProps) {
  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formattedDate || placeholder || "Select date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <Calendar mode="single" selected={selectedDate} onSelect={onChange} />
      </PopoverContent>
    </Popover>
  );
}
