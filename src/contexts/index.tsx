import { ReactNode } from "react";
import AppContextProvider from "./app-context";
import QueryProvider from "./query-provider";
import AppSidebarProvider from "./sidebar-provider";
import ZohoContextProvider from "./zoho-context";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ZohoContextProvider>
        <AppContextProvider>
          <AppSidebarProvider>{children}</AppSidebarProvider>
        </AppContextProvider>
      </ZohoContextProvider>
    </QueryProvider>
  );
}
