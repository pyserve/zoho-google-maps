import { CalendarView } from "@/components/calendar-view";
import { useStore } from "@/lib/store";
import { Toaster } from "react-hot-toast";
import OpenStreetMap from "./components/open-street-maps";

export default function App() {
  const { mode } = useStore((s) => s);

  return (
    <div className="flex flex-1 flex-col">
      {mode === "map" ? <OpenStreetMap /> : <CalendarView />}
      <Toaster />
    </div>
  );
}
