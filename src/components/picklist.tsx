"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { FieldData, FilterType } from "@/lib/types";
import { useEffect, useState } from "react";
import ListOperatorSelect from "./picklist-operator-select";

interface PicklistProps {
  item: FieldData;
  onChange: (filter: FilterType) => void;
}

export default function Picklist({ item, onChange }: PicklistProps) {
  const [selected, setSelected] = useState(false);
  const [value, setValue] = useState<string[]>([]);
  const [operator, setOperator] = useState("is");

  useEffect(() => {
    onChange({
      api_name: item.api_name,
      operator,
      value,
      selected,
      data_type: item.data_type,
      json_type: item.json_type,
    });
  }, [value, selected, operator]);

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
          <ListOperatorSelect value={operator} onChange={setOperator} />
          {(operator === "is" || operator === "is_not") && (
            <MultiSelect
              options={(item.pick_list_values || []).map((val) => ({
                label: val?.display_value,
                value: val?.actual_value,
              }))}
              onValueChange={setValue}
              value={value}
            />
          )}
        </div>
      )}
    </div>
  );
}
