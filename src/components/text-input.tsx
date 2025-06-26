"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldData, FilterType } from "@/lib/types";
import { useEffect, useState } from "react";
import TextOperatorSelect from "./text-operator-select";

interface TextInputProps {
  item: FieldData;
  onChange: (filter: FilterType) => void;
}

export default function TextInput({ item, onChange }: TextInputProps) {
  const [value, setValue] = useState("");
  const [operator, setOperator] = useState("equals");
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    onChange({
      api_name: item.api_name,
      operator,
      value,
      selected,
      data_type: item.data_type,
      json_type: item.json_type,
    });
  }, [value, operator, selected]);

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
          <TextOperatorSelect value={operator} onChange={setOperator} />
          {operator !== "is_empty" && operator !== "is_not_empty" && (
            <Input
              placeholder={`Enter ${item.field_label || item.api_name}`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          )}
        </div>
      )}
    </div>
  );
}
