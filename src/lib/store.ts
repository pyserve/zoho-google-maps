import { FieldData, FilterType, SelectedFilterItem } from "@/lib/types";
import _ from "lodash";
import { create } from "zustand";

interface SearchResults {
  data: Record<string, string>[];
  info?: {
    count: number;
    more_records: boolean;
  };
}

interface ViewModeType {
  mode: "calendar" | "map";
  setCalendarMode: () => void;
  setMapMode: () => void;
  toggleMode: () => void;
  filters: FilterType[];
  setFilters: (filters: FilterType[]) => void;
  updateFilter: (updated: FilterType) => void;
  clearFilter: (api_name: string) => void;
  fetchTrigger: number;
  triggerFetch: () => void;
  fields: FieldData[];
  setFields: (fields: FieldData[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResults;
  setSearchResults: (results: SearchResults) => void;
  selectedFilterColumns: SelectedFilterItem[];
  setSelectedFilterColumns: (items: SelectedFilterItem[]) => void;
  toggleSelectedFilterColumns: (api_name: string) => void;
  selectedContentColumns: SelectedFilterItem[];
  setSelectedContentColumns: (items: SelectedFilterItem[]) => void;
  toggleSelectedContentColumns: (api_name: string) => void;
  offset: number;
  setOffset: (offset: number) => void;
}

export const useStore = create<ViewModeType>((set, get) => ({
  mode: "map",
  setCalendarMode: () => set({ mode: "calendar" }),
  setMapMode: () => set({ mode: "map" }),
  toggleMode: () =>
    set((state) => ({ mode: state.mode === "calendar" ? "map" : "calendar" })),
  filters: [],
  setFilters: (filters) => set({ filters }),
  updateFilter: (updated) => {
    set((state) => {
      const index = _.findIndex(state.filters, { api_name: updated.api_name });

      if (!updated.selected) {
        return {
          filters:
            index !== -1
              ? _.filter(state.filters, (f) => f.api_name !== updated.api_name)
              : state.filters,
        };
      }

      if (index !== -1) {
        const newFilters = _.clone(state.filters);
        newFilters[index] = updated;
        return { filters: newFilters };
      }

      return { filters: [...state.filters, updated] };
    });
  },
  clearFilter: (api_name) =>
    set((state) => ({
      filters: _.reject(state.filters, { api_name }),
    })),
  fetchTrigger: 0,
  triggerFetch: () =>
    set((state) => ({ fetchTrigger: state.fetchTrigger + 1 })),
  fields: [],
  setFields: (fields) => set({ fields }),
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  searchResults: { data: [] },
  setSearchResults: (results) => set({ searchResults: results }),
  selectedFilterColumns: [],
  setSelectedFilterColumns: (items) => set({ selectedFilterColumns: items }),
  toggleSelectedFilterColumns: (api_name) => {
    const exists = get().selectedFilterColumns.find(
      (item) => item.api_name === api_name
    );
    let updated;
    if (exists) {
      updated = get().selectedFilterColumns.map((item) =>
        item.api_name === api_name
          ? { ...item, selected: !item.selected }
          : item
      );
    } else {
      updated = [...get().selectedFilterColumns, { api_name, selected: true }];
    }
    set({ selectedFilterColumns: updated });
  },
  selectedContentColumns: [],
  setSelectedContentColumns: (items) => set({ selectedContentColumns: items }),
  toggleSelectedContentColumns: (api_name) => {
    const exists = get().selectedContentColumns.find(
      (item) => item.api_name === api_name
    );
    let updated;
    if (exists) {
      updated = get().selectedContentColumns.map((item) =>
        item.api_name === api_name
          ? { ...item, selected: !item.selected }
          : item
      );
    } else {
      updated = [...get().selectedContentColumns, { api_name, selected: true }];
    }
    set({ selectedContentColumns: updated });
  },
  offset: 0,

  setOffset: (offset) => set({ offset }),
}));
