import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(
  dateString: string,
  mode?: "date" | "time"
): string {
  const date = dayjs(dateString);

  if (mode === "date") {
    return date.format("MMM D, YYYY");
  } else if (mode === "time") {
    return date.format("h:mm A");
  } else {
    return date.format("MMM D, YYYY [at] h:mm A");
  }
}
