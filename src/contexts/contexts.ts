import { createContext, useContext } from "react";

export interface DevelopmentContextType {
  prod: boolean;
  setProd: (data: boolean) => void;
}

export const DevelopmentContext = createContext<DevelopmentContextType | null>(
  null
);

export function useDevelopmentContext() {
  const context = useContext(DevelopmentContext);
  if (!context) throw new Error("App context not initialized.");
  return context;
}
