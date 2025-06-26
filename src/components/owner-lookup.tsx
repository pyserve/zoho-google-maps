"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFetchUsers } from "@/hooks/fetch-users";
import { FieldData, FilterType } from "@/lib/types";
import { useEffect, useState } from "react";
import ListOperatorSelector from "./picklist-operator-select";
import { Combobox } from "./ui/combobox";

interface OwnerLookupProps {
  item: FieldData;
  onChange: (filter: FilterType) => void;
}

export default function OwnerLookup({ item, onChange }: OwnerLookupProps) {
  const [selected, setSelected] = useState(false);
  const [operator, setOperator] = useState("is");
  const [value, setValue] = useState("");
  const { data: userOptions } = useFetchUsers();

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
          <ListOperatorSelector value={operator} onChange={setOperator} />

          {(operator === "is" || operator === "is_not") && (
            <Combobox
              options={
                userOptions.map((user: { full_name: string; id: string }) => ({
                  label: user.full_name,
                  value: user.id,
                })) ?? []
              }
              value={value}
              onValueChange={setValue}
            />
          )}
        </div>
      )}
    </div>
  );
}
