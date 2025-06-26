"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { FieldData, FilterType } from "@/lib/types";
import { useEffect, useState } from "react";
import NumericOperatorSelect from "./numeric-operator-select";

interface NumberInputProps {
  item: FieldData;
  onChange: (filter: FilterType) => void;
}

export default function NumberInput({ item, onChange }: NumberInputProps) {
  const [selected, setSelected] = useState(false);
  const [operator, setOperator] = useState("equals");
  const [value, setValue] = useState("");

  useEffect(() => {
    const val =
      operator === "is_empty" || operator === "is_not_empty" ? null : value;
    onChange({
      api_name: item.api_name,
      operator,
      value: val,
      selected,
      data_type: item.data_type,
      json_type: item.json_type,
    });
  }, [operator, value, selected]);

  const requiresValue = !["is_empty", "is_not_empty"].includes(operator);

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
        <div className="space-y-2 ms-6">
          <NumericOperatorSelect value={operator} onChange={setOperator} />

          {requiresValue && (
            <Input
              type="number"
              inputMode="decimal"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full"
              placeholder="Enter value"
            />
          )}
        </div>
      )}
    </div>
  );
}
