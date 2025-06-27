"use client";
import { useAppContext } from "@/contexts/app-context";
import { useDevelopmentContext } from "@/contexts/contexts";
import { ModuleConfig, useZohoContext } from "@/contexts/zoho-context";
import { useSearchRecords } from "@/hooks/search-records";
import { useUpdateRecord } from "@/hooks/update-record";
import { geocodeRecords } from "@/lib/geocode";
import { useStore } from "@/lib/store";
import { FieldData } from "@/lib/types";
import _, { round } from "lodash";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CheckboxInput from "./checkbox-input";
import DatetimeInput from "./datetime-input";
import NumberInput from "./number-input";
import OwnerLookup from "./owner-lookup";
import Picklist from "./picklist";
import TextInput from "./text-input";
import { Button } from "./ui/button";

export default function SidebarFilters({ items }: { items: FieldData[] }) {
  const {
    filters,
    fetchTrigger,
    setSearchResults,
    updateFilter,
    triggerFetch,
    selectedContentColumns,
    offset,
  } = useStore();
  const searchRecords = useSearchRecords();
  const updateRecords = useUpdateRecord();
  const { zoho } = useZohoContext();
  const { settings } = useAppContext();
  const { prod } = useDevelopmentContext();
  const [IsSubmitting, setISSubmitting] = useState<boolean>(false);

  const hasSelectedFilters = _.some(filters, "selected");
  const sortedItems = _.sortBy(items, "api_name");

  const handleApplyFilters = () => {
    const isValid = _.every(filters, (f) => {
      if (!f.selected) return true;
      const { operator, value } = f;
      if (operator === "is_empty" || operator === "is_not_empty") {
        return true;
      }
      return !(
        _.isNil(value) ||
        (_.isString(value) && _.trim(value) === "") ||
        (_.isArray(value) && _.isEmpty(value))
      );
    });

    if (isValid) {
      triggerFetch();
    } else {
      toast.error("Some selected filters have empty or invalid values");
    }
  };

  useEffect(() => {
    const submitSearch = async () => {
      setISSubmitting(true);
      try {
        if (!zoho?.Entity) throw new Error("Zoho entity not found!");
        const settingsValues: ModuleConfig = JSON.parse(
          settings?.[0]?.[prod ? "zohogooglemaps__Value" : "Value"] ?? "[]"
        );

        if (!(settingsValues.primary_address && settingsValues.primary_time)) {
          toast.error(
            "Please set up your primary address and time fields from settings."
          );
          return;
        }

        const data = await searchRecords.mutateAsync({
          filters,
          Entity: zoho?.Entity,
          fields: selectedContentColumns
            .filter((col) => col.selected)
            .map((col) => col.api_name),
          mandatoryFields: [
            settingsValues?.primary_address,
            settingsValues?.primary_time,
            ...(prod
              ? ["zohogooglemaps__Latitude0", "zohogooglemaps__Longitude0"]
              : ["Latitude", "Longitude"]),
          ],
          limit: settingsValues.max_fetch_limit,
          offset: offset,
        });

        if (data?.length === 0) {
          toast.error("No matching records found for the applied filters.");
          return;
        }

        const geocodedData = await geocodeRecords(data.data ?? []);
        console.log("🚀 ~ submitSearch ~ geocodedData:", geocodedData);
        setSearchResults({ data: geocodedData ?? [], info: data?.info });

        const missingLatLngRecords = geocodedData.filter((geoRecord) => {
          const originalRecord = (data.data ?? []).find(
            (rec: { id: string }) => rec.id === geoRecord.id
          );
          const originalHasNoCoords =
            !originalRecord?.zohogooglemaps__Latitude0 ||
            !originalRecord?.zohogooglemaps__Longitude0;
          const geoHasCoords = geoRecord?.lat != null && geoRecord?.lng != null;
          return originalHasNoCoords && geoHasCoords;
        });

        if (missingLatLngRecords.length === 0) return;
        console.log(
          "🚀 ~ missingLatLngRecords ~ missingLatLngRecords:",
          missingLatLngRecords
        );
        if (!prod) return;
        const updatePromise = updateRecords.mutateAsync({
          data: missingLatLngRecords.map((record) => ({
            id: record.id,
            zohogooglemaps__Latitude0: round(record.lat, 4),
            zohogooglemaps__Longitude0: round(record.lng, 4),
          })),
          Entity: zoho.Entity,
        });
        updatePromise.then((updatedData) => console.log(updatedData));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Error");
      } finally {
        setISSubmitting(false);
      }
    };
    if (fetchTrigger && filters.length > 0) submitSearch();
  }, [fetchTrigger]);

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto flex-1 pr-1">
        {sortedItems.map((item: FieldData) => (
          <div key={item.id} className="mb-2">
            {["text", "email", "phone", "lookup"].includes(item.data_type) && (
              <TextInput item={item} onChange={updateFilter} />
            )}
            {item.data_type === "picklist" && (
              <Picklist item={item} onChange={updateFilter} />
            )}
            {(item.data_type === "ownerlookup" ||
              item.data_type === "userlookup") && (
              <OwnerLookup item={item} onChange={updateFilter} />
            )}
            {["datetime", "date"].includes(item.data_type) && (
              <DatetimeInput item={item} onChange={updateFilter} />
            )}
            {["integer", "double"].includes(item.data_type) && (
              <NumberInput item={item} onChange={updateFilter} />
            )}
            {item.data_type === "boolean" && (
              <CheckboxInput item={item} onChange={updateFilter} />
            )}
          </div>
        ))}
      </div>

      {hasSelectedFilters && (
        <div className="p-3 border-t bg-white sticky bottom-0">
          <Button
            onClick={handleApplyFilters}
            className="w-full"
            disabled={IsSubmitting}
          >
            <span className="flex items-center gap-1">
              <span>
                {IsSubmitting && <Loader2 className="animate-spin" />}
              </span>
              <span>Apply Filters</span>
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
