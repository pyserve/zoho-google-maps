"use client";
import { useQuery } from "@tanstack/react-query";

export const useFetchUsers = () =>
  useQuery({
    queryKey: ["Users"],
    queryFn: async () => {
      try {
        const res = await window.ZOHO.CRM.CONNECTOR.invokeAPI(
          "zohogooglemaps.googlemapsoauth.getallusers",
          {}
        );
        const status = res.status_code;
        if (status !== 200) {
          if (status === 204) return [];
          const responseData = JSON.parse(res?.response);
          throw new Error(JSON.stringify(responseData, null, 4));
        }
        const responseData = JSON.parse(res?.response);
        return responseData?.users ?? [];
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Server Error"
        );
      }
    },
  });
