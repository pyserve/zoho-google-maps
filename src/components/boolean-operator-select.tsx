"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BooleanOperatorSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BooleanOperatorSelect({
  value,
  onChange,
}: BooleanOperatorSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 text-sm px-2">
        <SelectValue placeholder="Select operator" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="is">Is</SelectItem>
      </SelectContent>
    </Select>
  );
}
