"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NumericOperatorSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function NumericOperatorSelect({
  value,
  onChange,
}: NumericOperatorSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 text-sm px-2">
        <SelectValue placeholder="Select operator" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="equals">Equals</SelectItem>
        <SelectItem value="not_equal">Not Equal</SelectItem>
        <SelectItem value="lt">Less Than</SelectItem>
        <SelectItem value="lte">Less Than or Equal</SelectItem>
        <SelectItem value="gt">Greater Than</SelectItem>
        <SelectItem value="gte">Greater Than or Equal</SelectItem>
        <SelectItem value="is_empty">Is Empty</SelectItem>
        <SelectItem value="is_not_empty">Is Not Empty</SelectItem>
      </SelectContent>
    </Select>
  );
}
