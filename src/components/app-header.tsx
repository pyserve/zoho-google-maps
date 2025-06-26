import { ContentColumnsSelector } from "@/components/content-columns-selector";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useStore } from "@/lib/store";
import { Calendar, Map } from "lucide-react";
import { RecordPagination } from "./record-pagination";
import AppSettings from "./settings";

export default function AppHeader() {
  const { mode, toggleMode } = useStore((s) => s);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <div className="flex items-center gap-1">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <RecordPagination />
      </div>
      <div className="ms-auto flex items-center space-x-2">
        <div className="flex space-x-1 border rounded-md bg-muted">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={mode === "map" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => toggleMode()}
                >
                  <Map />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Map View</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={mode === "calendar" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => toggleMode()}
                >
                  <Calendar />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Calendar View</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <ContentColumnsSelector />
        <AppSettings />
      </div>
    </header>
  );
}
