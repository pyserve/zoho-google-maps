"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldData, FilterType } from "@/lib/types";
import { useEffect, useState } from "react";
import BooleanOperatorSelect from "./boolean-operator-select";

interface CheckboxInputProps {
  item: FieldData;
  onChange: (filter: FilterType) => void;
}

export default function CheckboxInput({ item, onChange }: CheckboxInputProps) {
  const [selected, setSelected] = useState(false);
  const [operator, setOperator] = useState("is");
  const [value, setValue] = useState(true);

  useEffect(() => {
    onChange({
      api_name: item.api_name,
      operator,
      value,
      selected,
      data_type: item.data_type,
      json_type: item.json_type,
    });
  }, [operator, value, selected]);

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`check-${item.api_name}`}
          checked={selected}
          onCheckedChange={(val) => setSelected(!!val)}
        />
        <Label htmlFor={`check-${item.api_name}`}>
          {item.field_label || item.api_name}
        </Label>
      </div>

      {selected && (
        <div className="flex items-center gap-1 ms-6">
          <BooleanOperatorSelect value={operator} onChange={setOperator} />
          <Select
            value={value.toString()}
            onValueChange={(val) => setValue(val === "true")}
          >
            <SelectTrigger className="h-8 text-sm px-2 w-[140px]">
              <SelectValue placeholder="Select value" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Selected</SelectItem>
              <SelectItem value="false">Not Selected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
