"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OperatorSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ListOperatorSelect({
  value,
  onChange,
}: OperatorSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm">
        <SelectValue placeholder="Select operator" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="is">Is</SelectItem>
        <SelectItem value="is_not">Is Not</SelectItem>
        <SelectItem value="is_empty">Is Empty</SelectItem>
        <SelectItem value="is_not_empty">Is Not Empty</SelectItem>
      </SelectContent>
    </Select>
  );
}
