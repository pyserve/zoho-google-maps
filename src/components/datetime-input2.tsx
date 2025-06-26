"use client";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useEffect, useRef, useState } from "react";

dayjs.extend(utc);
dayjs.extend(timezone);

interface DateTimeInputProps {
  name: string;
  value?: string;
  onChangeValue?: (val: string) => void;
}

export const DateTimeInput = ({
  name,
  value,
  onChangeValue,
}: DateTimeInputProps) => {
  const [localValue, setLocalValue] = useState("");
  const hasSyncedInitial = useRef(false);

  const userTimeZone =
    typeof Intl !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : "UTC";

  useEffect(() => {
    if (value && userTimeZone) {
      const parsed = dayjs.utc(value).tz(userTimeZone);
      if (parsed.isValid()) {
        const display = parsed.format("YYYY-MM-DDTHH:mm");
        setLocalValue(display);

        const formatted = parsed.format("YYYY-MM-DDTHH:mm:ssZ");

        if (!hasSyncedInitial.current && value !== formatted) {
          onChangeValue?.(formatted);
          hasSyncedInitial.current = true;
        }
      }
    }
  }, [value, userTimeZone]);

  const handleChange = (newLocalValue: string) => {
    setLocalValue(newLocalValue);

    const zoned = dayjs.tz(newLocalValue, userTimeZone);
    const formatted = zoned.format("YYYY-MM-DDTHH:mm:ssZ");

    onChangeValue?.(formatted);
  };

  return (
    <input
      type="datetime-local"
      name={name}
      value={localValue}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        handleChange(e.target.value)
      }
      className="border p-2 rounded-md text-sm"
    />
  );
};
