"use client";
import QueryProvider from "@/contexts/query-provider";
import { useZohoContext } from "@/contexts/zoho-context";
import { useStore } from "@/lib/store";
import { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import RecordDetails from "./record-details";

declare global {
  interface Window {
    google: typeof google;
  }
}

export default function GoogleMaps() {
  const [zoomLevel, setZoomLevel] = useState(7);
  const [markers, setMarkers] = useState<any[]>([]);
  const curWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const { searchResults } = useStore();
  const { zoho } = useZohoContext();

  const center = useMemo(() => {
    return {
      lat: Number(zoho?.org?.lat ?? 43.65107),
      lng: Number(zoho?.org?.lng ?? -79.347015),
    };
  }, [zoho]);

  useEffect(() => {
    const mapElement = document.getElementById("map");
    if (mapElement) {
      const map = new window.google.maps.Map(mapElement as HTMLElement, {
        zoom: zoomLevel,
        center: center,
        mapTypeId: "roadmap",
      });

      const zoomChanged = map.addListener("zoom_changed", () => {
        setZoomLevel(map.getZoom() ?? zoomLevel);
      });

      searchResults.data?.map((record: any) => {
        if (record?.lat && record?.lng) {
          const marker = new window.google.maps.Marker({
            position: record,
            map: map,
            icon: {
              url: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
              scaledSize: new window.google.maps.Size(32, 32),
            },
          });
          setMarkers((mks: any) => [...mks, marker]);
          const container: HTMLDivElement = document.createElement("div");
          const root = createRoot(container);
          root.render(
            <QueryProvider>
              <RecordDetails record={record} zoho={zoho} />
            </QueryProvider>
          );
          const infoWindow = new window.google.maps.InfoWindow({
            content: container,
          });
          marker.addListener("click", function () {
            if (curWindowRef?.current) {
              curWindowRef.current.close();
            }
            infoWindow.open(map, marker);
            curWindowRef.current = infoWindow;
          });
        }
      });

      return () => {
        window.google.maps.event.removeListener(zoomChanged);

        if (markers.length) {
          markers.map((marker) => {
            marker.setMap(null);
            return null;
          });
        }
        setMarkers([]);
      };
    }
  }, [zoomLevel, center, searchResults]);

  return (
    <main className="flex-1 ">
      <div id="map" className="w-[100%] h-[90vh]"></div>
    </main>
  );
}
