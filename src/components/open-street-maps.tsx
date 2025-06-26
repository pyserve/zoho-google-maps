"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

import { useZohoContext } from "@/contexts/zoho-context";
import { useStore } from "@/lib/store";
import RecordDetails from "./record-details";

delete (L.Icon.Default as any).prototype._getIconUrl;
const orangeIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
  iconRetinaUrl: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

export default function OpenStreetMap() {
  const { searchResults } = useStore();
  const { zoho } = useZohoContext();

  const center = useMemo<[number, number]>(() => {
    return zoho?.org?.lat && zoho?.org?.lng
      ? [Number(zoho.org.lat), Number(zoho.org.lng)]
      : [43.65107, -79.347015];
  }, [zoho]);

  const [zoomLevel, setZoomLevel] = useState(6);

  function MapEvents() {
    const map = useMapEvents({
      zoomend: () => {
        setZoomLevel(map.getZoom());
      },
    });
    return null;
  }

  return (
    <main className="flex-1">
      <MapContainer
        center={center}
        zoom={zoomLevel}
        style={{ height: "90vh", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {searchResults?.data
          ?.filter((record) => record?.lat && record?.lng)
          ?.map((record, idx) => (
            <Marker
              key={idx}
              position={[Number(record.lat), Number(record.lng)]}
              icon={orangeIcon}
            >
              <Popup>
                <RecordDetails record={record} zoho={zoho} />
              </Popup>
            </Marker>
          ))}
        <MapEvents />
      </MapContainer>
    </main>
  );
}
