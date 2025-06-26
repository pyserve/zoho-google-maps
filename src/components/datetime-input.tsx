"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FieldData, FilterType } from "@/lib/types";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";
import { DatePicker } from "./date-picker";
import DatetimeOperatorSelect from "./datetime-operator-selector";

dayjs.extend(utc);
dayjs.extend(timezone);

interface DatetimeInputProps {
  item: FieldData;
  onChange: (filter: FilterType) => void;
}

export default function DatetimeInput({ item, onChange }: DatetimeInputProps) {
  const [selected, setSelected] = useState(false);
  const [operator, setOperator] = useState("between");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const value =
      operator === "between"
        ? [
            dayjs(startDate).tz(dayjs.tz.guess()).startOf("day").format(),
            dayjs(endDate).tz(dayjs.tz.guess()).endOf("day").format(),
          ]
        : dayjs(startDate).tz(dayjs.tz.guess()).startOf("day").format();

    onChange({
      api_name: item.api_name,
      operator,
      value,
      selected,
      data_type: item.data_type,
      json_type: item.json_type,
    });
  }, [startDate, endDate, operator, selected]);

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
          <DatetimeOperatorSelect value={operator} onChange={setOperator} />

          {operator !== "is_empty" && operator !== "is_not_empty" && (
            <div className="space-y-1">
              <div className="flex ">
                <DatePicker
                  selectedDate={startDate}
                  onChange={setStartDate}
                  placeholder="Select start date"
                />
              </div>

              {operator === "between" && (
                <div className="flex ">
                  <DatePicker
                    selectedDate={endDate}
                    onChange={setEndDate}
                    placeholder="Select end date"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
