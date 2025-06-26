import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppContext } from "@/contexts/app-context";
import { useDevelopmentContext } from "@/contexts/contexts";
import { useZohoContext } from "@/contexts/zoho-context";
import { useCreateRecord } from "@/hooks/create-record";
import { useUpdateRecord } from "@/hooks/update-record";
import { useStore } from "@/lib/store";
import { Loader2, MoreHorizontal, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";

export const FilterColumnsSelector = () => {
  const { zoho } = useZohoContext();
  const { prod } = useDevelopmentContext();
  const { filterColumns: results } = useAppContext();
  const createRecord = useCreateRecord();
  const updateRecord = useUpdateRecord();
  const [IsSubmitting, setIsSubmitting] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [changed, setChanged] = useState(false);
  const {
    fields,
    selectedFilterColumns,
    setSelectedFilterColumns,
    toggleSelectedFilterColumns,
  } = useStore();

  useEffect(() => {
    if (showSearch && inputRef.current) {
      const id = requestAnimationFrame(() => {
        setTimeout(() => {
          inputRef?.current?.focus();
        }, 10);
      });
      return () => cancelAnimationFrame(id);
    }
  }, [showSearch]);

  useEffect(() => {
    if (fields.length === 0) return;
    try {
      const columns = JSON.parse(
        results?.[0]?.[prod ? "zohogooglemaps__Value" : "Value"] || "[]"
      );

      setSelectedFilterColumns(
        fields.map((field) => ({
          api_name: field.api_name,
          selected: columns.includes(field.api_name),
        }))
      );

      setChanged(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error parsing filter columns"
      );
    }
  }, [fields, results]);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const filterColumns = selectedFilterColumns
        .filter((col) => col.selected)
        .map((col) => col.api_name);

      if (results.length > 0) {
        const res = await updateRecord.mutateAsync({
          Entity: prod ? "zohogooglemaps__Map_Variables" : "Map_Variables",
          data: [
            {
              id: results?.[0]?.id,
              [prod ? "zohogooglemaps__Value" : "Value"]:
                JSON.stringify(filterColumns),
            },
          ],
        });
        console.log("🚀 ~ handleSave ~ res:", res);
        toast.success(`Filter settings updated sucessfully.`);
      } else {
        const res = await createRecord.mutateAsync({
          Entity: prod ? "zohogooglemaps__Map_Variables" : "Map_Variables",
          data: {
            Name: "Filter Columns",
            [prod ? "zohogooglemaps__Entity" : "Entity"]: zoho?.Entity ?? "",
            [prod ? "zohogooglemaps__Value" : "Value"]:
              JSON.stringify(filterColumns),
          },
        });
        console.log("🚀 ~ handleSave ~ res:", res);
        toast.success(`Filter settings created sucessfully.`);
      }
    } catch (error) {
      console.error("🚀 ~ handleSave ~ error:", error);
      toast.error(
        error instanceof Error ? error.message : "Error updating settings."
      );
    } finally {
      setIsSubmitting(false);
    }
    setChanged(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded hover:bg-muted">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-full max-h-96 mx-1 p-0 z-10 flex flex-col"
        onCloseAutoFocus={(e) => e.preventDefault()}
        onFocusOutside={(e) => {
          if (!showSearch) {
            e.preventDefault();
          }
        }}
        onKeyDown={(e) => {
          if (showSearch) {
            e.stopPropagation();
          }
        }}
      >
        <DropdownMenuLabel className="flex items-center justify-between sticky top-0 bg-white z-10 px-3 py-2 border-b">
          <div className="flex items-center gap-2 flex-grow transition-all duration-300">
            {!showSearch ? (
              <>
                <p className="text-sm font-medium flex-grow">Select Columns</p>
                <Checkbox
                  id="filter-columns-selector"
                  checked={selectedFilterColumns.every((item) => item.selected)}
                  onCheckedChange={(checked) => {
                    const updated = fields.map((field) => ({
                      api_name: field.api_name,
                      selected: !!checked,
                    }));
                    setSelectedFilterColumns(updated);
                    setChanged(true);
                  }}
                />
              </>
            ) : (
              <Input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="text-sm w-full ps-3 py-1 border rounded-full focus:outline-none"
                onKeyDown={(e) => e.stopPropagation()}
              />
            )}
          </div>
          <button
            onClick={() => {
              setSearch("");
              setShowSearch((prev) => !prev);
            }}
            className="ml-2 p-1 text-muted-foreground hover:text-black"
          >
            {showSearch ? (
              <X className="w-4 h-4" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </button>
        </DropdownMenuLabel>

        <div className="py-1 overflow-y-auto flex-grow">
          {(search.trim().length > 0
            ? selectedFilterColumns.filter(({ api_name }) =>
                api_name.toLowerCase().includes(search.trim().toLowerCase())
              )
            : selectedFilterColumns
          ).map(({ api_name, selected }) => (
            <DropdownMenuCheckboxItem
              key={api_name}
              checked={selected}
              onCheckedChange={() => {
                toggleSelectedFilterColumns(api_name);
                setChanged(true);
              }}
              onSelect={(e) => e.preventDefault()}
              className="flex items-center gap-2"
            >
              <span className="truncate">{api_name}</span>
            </DropdownMenuCheckboxItem>
          ))}
        </div>

        <div className="sticky bottom-0 bg-white border-t px-2 py-2">
          <Button
            onClick={handleSave}
            className="w-full rounded bg-primary text-white text-sm py-1 hover:opacity-90"
            disabled={!changed || IsSubmitting}
          >
            {IsSubmitting ? (
              <span className="flex gap-1 items-center">
                <span>
                  <Loader2 className="animate-spin" />
                </span>
                <span>Saving..</span>
              </span>
            ) : (
              <span>Save Changes</span>
            )}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
