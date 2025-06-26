"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppContext } from "@/contexts/app-context";
import { useDevelopmentContext } from "@/contexts/contexts";
import { useZohoContext } from "@/contexts/zoho-context";
import { useCreateRecord } from "@/hooks/create-record";
import { useUpdateRecord } from "@/hooks/update-record";
import { useStore } from "@/lib/store";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import _ from "lodash";
import { GripVertical, Loader2, Menu, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Input } from "./ui/input";

export function ContentColumnsSelector() {
  const { zoho } = useZohoContext();
  const { prod } = useDevelopmentContext();
  const { contentColumns: results } = useAppContext();
  const createRecord = useCreateRecord();
  const updateRecord = useUpdateRecord();
  const [IsSubmitting, setIsSubmitting] = useState(false);
  const { selectedContentColumns, setSelectedContentColumns, fields } =
    useStore();

  const sortedColumns = useMemo(() => {
    return _.orderBy(selectedContentColumns, ["selected"], ["desc"]);
  }, [selectedContentColumns]);
  const [changed, setChanged] = useState(false);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

      setSelectedContentColumns(
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = selectedContentColumns.findIndex(
        (i) => i.api_name === active.id
      );
      const newIndex = selectedContentColumns.findIndex(
        (i) => i.api_name === over!.id
      );
      const reordered = arrayMove(selectedContentColumns, oldIndex, newIndex);
      setSelectedContentColumns(reordered);
      setChanged(true);
    }
  }

  const toggle = (api_name: string) => {
    const updated = selectedContentColumns.map((item) =>
      item.api_name === api_name ? { ...item, selected: !item.selected } : item
    );
    setSelectedContentColumns(updated);
    setChanged(true);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const filterColumns = selectedContentColumns
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
        toast.success(`Content filter settings updated sucessfully.`);
      } else {
        const res = await createRecord.mutateAsync({
          Entity: prod ? "zohogooglemaps__Map_Variables" : "Map_Variables",
          data: {
            Name: "Content Columns",
            [prod ? "zohogooglemaps__Entity" : "Entity"]: zoho?.Entity ?? "",
            [prod ? "zohogooglemaps__Value" : "Value"]:
              JSON.stringify(filterColumns),
          },
        });
        console.log("🚀 ~ handleSave ~ res:", res);
        toast.success(`Content filter settings created sucessfully.`);
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
        <Button variant="outline" size="sm">
          <Menu className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-full max-h-96 overflow-hidden p-0"
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
        <div className="sticky top-0 z-10 bg-white px-3 py-2 border-b">
          <DropdownMenuLabel className="flex items-center flex-grow transition-all duration-300">
            {!showSearch ? (
              <>
                <p className="text-sm font-medium flex-grow">Select Columns</p>
                <Checkbox
                  checked={selectedContentColumns.every(
                    (item) => item.selected
                  )}
                  onCheckedChange={(checked) => {
                    const allChecked = checked === true;
                    const updated = selectedContentColumns.map((item) => ({
                      ...item,
                      selected: allChecked,
                    }));
                    setSelectedContentColumns(updated);
                    setChanged(true);
                  }}
                  aria-label="Select or deselect all columns"
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
        </div>

        <div className="max-h-72 overflow-y-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={selectedContentColumns.map((i) => i.api_name)}
              strategy={verticalListSortingStrategy}
            >
              {(search.trim().length > 0
                ? sortedColumns.filter(({ api_name }) =>
                    api_name.toLowerCase().includes(search.trim().toLowerCase())
                  )
                : sortedColumns
              ).map((item) => (
                <SortableItem
                  key={item.api_name}
                  id={item.api_name}
                  label={item.api_name}
                  checked={item.selected}
                  onToggle={() => toggle(item.api_name)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <div className="sticky bottom-0 bg-white border-t px-3 py-2">
          <Button
            onClick={handleSave}
            disabled={!changed || IsSubmitting}
            className="w-full text-sm"
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
}

function SortableItem({
  id,
  label,
  checked,
  onToggle,
}: {
  id: string;
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition
      ? `${transition}, box-shadow 200ms ease`
      : "transform 200ms ease, box-shadow 200ms ease",
    boxShadow: isDragging ? "0 4px 12px rgba(0, 0, 0, 0.15)" : undefined,
    zIndex: isDragging ? 999 : undefined,
    backgroundColor: isDragging ? "white" : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between px-2 py-1 border-b last:border-b-0"
    >
      <div className="flex items-center gap-2">
        <GripVertical
          className="w-4 h-4 cursor-move"
          {...attributes}
          {...listeners}
        />
        <Checkbox checked={checked} onCheckedChange={onToggle} />
        <span className="truncate text-sm">{label}</span>
      </div>
    </div>
  );
}
