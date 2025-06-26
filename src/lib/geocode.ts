import axios from "axios";

export const geocodeAddress = (address: string) => {
  return new Promise((resolve) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results: any, status: any) => {
      if (
        status === window.google.maps.GeocoderStatus.OK &&
        results.length > 0 &&
        results[0].geometry
      ) {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        resolve({ lat, lng });
      } else {
        resolve({ lat: null, lng: null });
      }
    });
  });
};

export async function geocodeRecords(records: any[]) {
  const result = await Promise.all(
    records.map(async (record) => {
      const { Full_Address, Street, City, Province, Zip_Code } = record;

      const address =
        Full_Address ||
        `${Street || ""} ${City || ""} ${Province || ""} ${
          Zip_Code || ""
        }`.trim();

      if (!Full_Address && !Street && !Zip_Code) {
        return {
          ...record,
          lat: null,
          lng: null,
        };
      }

      try {
        if (
          record.zohogooglemaps__latitude &&
          record.zohogooglemaps__longitude
        ) {
          return {
            ...record,
            lat: record.zohogooglemaps__latitude,
            lng: record.zohogooglemaps__longitude,
          };
        } else {
          // const { lat, lng }: any = await geocodeAddress(address);
          const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            address
          )}`;
          const res = await axios.get(url);
          return {
            ...record,
            lat: res.data?.[0]?.lat ? parseFloat(res.data[0].lat) : null,
            lng: res.data?.[0]?.lon ? parseFloat(res.data[0].lon) : null,
          };
        }
      } catch {
        return { ...record, lat: null, lng: null };
      }
    })
  );

  return result;
}
