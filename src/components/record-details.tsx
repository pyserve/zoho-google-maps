"use client";
import { Button } from "@/components/ui/button";
import { ZohoData } from "@/contexts/zoho-context";
import { useStore } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import { ReactNode } from "react";
import UpdateRecord from "./update-record-details";

export default function RecordDetails({
  record,
  zoho,
}: {
  record: any;
  zoho: ZohoData | null;
}) {
  const { selectedContentColumns } = useStore();
  function renderValue(_: string, value: any): ReactNode {
    if (value === null)
      return <span className="italic text-gray-400">N/A</span>;
    if (Array.isArray(value)) return value.map((v) => v.name || v).join(", ");
    if (isDateString(value)) return formatDateTime(value, "date");
    if (typeof value === "object")
      return value?.name || value?.id || JSON.stringify(value);
    if (typeof value === "string") return value;
    if (typeof value === "number") return value.toString();
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return <span className="italic text-gray-400">N/A</span>;
  }

  const isDateString = (value: string | unknown) => {
    return typeof value === "string" && !isNaN(Date.parse(value));
  };

  const recordUrl = `https://crm.zoho.com/crm/org${zoho?.org?.orgId}/tab/${zoho?.Entity}/${record?.id}`;

  return (
    <div className="w-full mx-auto h-[400px] flex flex-col gap-0 py-2 ">
      <div className="">
        <div className="text-xl">Record Details</div>
        <div className="">
          <a
            className="font-medium text-sm text-sky-600 dark:text-sky-500 hover:underline"
            href={recordUrl}
            target="_blank"
          >
            {record.id}
          </a>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 py-2">
        <div className="space-y-2 text-sm">
          {selectedContentColumns
            .filter((col) => col.selected)
            ?.map((col, idx) => {
              return (
                <div key={idx} className="text-sm text-gray-800 leading-snug">
                  <span className="font-semibold capitalize text-gray-700">
                    {col.api_name?.replace(/_/g, " ")}:
                  </span>{" "}
                  <span className="break-words">
                    {renderValue(col.api_name, record?.[col.api_name])}
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      <div className="shrink-0 grid grid-cols-2 gap-2 border-gray-200 py-1">
        <Button
          type="button"
          className="flex items-center justify-center gap-1"
          onClick={() => window.open(recordUrl)}
        >
          <EyeIcon className="w-4 h-4" />
          View
        </Button>
        <UpdateRecord record={record} zoho={zoho} />
      </div>
    </div>
  );
}
