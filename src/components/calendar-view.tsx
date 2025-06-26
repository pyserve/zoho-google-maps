import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppContext } from "@/contexts/app-context";
import { useDevelopmentContext } from "@/contexts/contexts";
import { useZohoContext } from "@/contexts/zoho-context";
import { useStore } from "@/lib/store";
import { DialogDescription } from "@radix-ui/react-dialog";
import dayjs from "dayjs";
import { Calendar1, X } from "lucide-react";
import { useCallback, useState } from "react";
import { Calendar, dayjsLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import RecordDetails from "./record-details";
import { Button } from "./ui/button";

const localizer = dayjsLocalizer(dayjs);

interface EventType {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

type CalendarView = "month" | "week" | "day" | "agenda";

export const CalendarView = () => {
  const { zoho } = useZohoContext();
  const { settings } = useAppContext();
  const { prod } = useDevelopmentContext();
  const [currentView, setCurrentView] = useState<CalendarView>(Views.MONTH);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const { searchResults } = useStore();
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);

  const defaultValues = JSON.parse(
    settings?.[0]?.[prod ? "zohogooglemaps__Value" : "Value"] ?? "{}"
  );

  const events: EventType[] = searchResults.data?.map((r) => ({
    id: r.id,
    title: r[defaultValues.primary_address],
    start: new Date(r[defaultValues.primary_time]),
    end: dayjs(r[defaultValues.primary_time]).add(30, "minute").toDate(),
  }));

  const handleViewChange = useCallback((view: string) => {
    setCurrentView(view as CalendarView);
  }, []);

  const handleNavigate = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  const handleSelectEvent = useCallback((event: EventType) => {
    setSelectedEvent(event);
  }, []);

  const selectedRecord =
    searchResults?.data?.find((r) => r.id === selectedEvent?.id) ?? null;

  return (
    <div className="p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={currentView}
        date={currentDate}
        onView={handleViewChange}
        onNavigate={handleNavigate}
        onSelectEvent={handleSelectEvent}
        views={["month", "week", "day", "agenda"]}
        style={{ height: 600 }}
      />

      <Dialog
        open={!!selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
      >
        <DialogContent className="gap-0 space-y-1">
          <DialogHeader className="py-2">
            <div className="flex items-start gap-2">
              <Calendar1 className="mt-1 text-muted-foreground" />
              <div className="">
                <DialogTitle className="text-base">
                  {selectedRecord?.[
                    defaultValues?.primary_address ?? "Full_Name"
                  ] || "Event"}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Event Details
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div>
            {selectedRecord && (
              <RecordDetails record={selectedRecord} zoho={zoho} />
            )}
          </div>

          <DialogClose asChild>
            <Button variant="outline" className="w-full mt-4 gap-1">
              <X />
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};
