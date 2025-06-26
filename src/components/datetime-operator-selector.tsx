"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DatetimeOperatorSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DatetimeOperatorSelect({
  value,
  onChange,
}: DatetimeOperatorSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm">
        <SelectValue placeholder="Select operator" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="between">Between</SelectItem>
        <SelectItem value="before">Before</SelectItem>
        <SelectItem value="after">After</SelectItem>
        <SelectItem value="is_empty">Is Empty</SelectItem>
        <SelectItem value="is_not_empty">Is Not Empty</SelectItem>
      </SelectContent>
    </Select>
  );
}
