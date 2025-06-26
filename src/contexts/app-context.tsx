"use client";
import { useFilteredSearchRecords } from "@/hooks/search-records";
import { ResultType } from "@/lib/types";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useDevelopmentContext } from "./contexts";
import { useZohoContext } from "./zoho-context";

export interface AppContextType {
  filterColumns: ResultType[];
  contentColumns: ResultType[];
  settings: ResultType[];
}

const AppContext = createContext<AppContextType | null>(null);

export default function AppContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { zoho } = useZohoContext();
  const { prod } = useDevelopmentContext();
  const filterSearchRecords = useFilteredSearchRecords();
  const [filterColumns, setFilterColumns] = useState<ResultType[]>([]);
  const [contentColumns, setContentColumns] = useState<ResultType[]>([]);
  const [settings, setSettings] = useState<ResultType[]>([]);

  const fetchData = async (
    col_name: string,
    setData: Dispatch<SetStateAction<ResultType[]>>
  ) => {
    try {
      if (!zoho?.Entity) throw new Error("Zoho entity not found.");
      const results = await filterSearchRecords.mutateAsync({
        Entity: zoho?.Entity,
        fields: prod
          ? ["Name", "zohogooglemaps__Entity", "zohogooglemaps__Value"]
          : ["Name", "Entity", "Value"],
        col_name: col_name,
      });
      setData(results ?? []);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Error");
    }
  };

  useEffect(() => {
    if (zoho?.Entity) {
      fetchData("Filter Columns", setFilterColumns);
      fetchData("Content Columns", setContentColumns);
      fetchData("Settings", setSettings);
    }
  }, [zoho]);

  return (
    <AppContext.Provider value={{ filterColumns, contentColumns, settings }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("App context not initialized.");
  return context;
}
