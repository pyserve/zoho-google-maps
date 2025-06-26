import { useMutation } from "@tanstack/react-query";

export const useUpdateRecord = () =>
  useMutation({
    mutationFn: async (data: { data: object[]; Entity: string | null }) => {
      try {
        if (!data.Entity) throw new Error("Entity must be provided.");
        const res = await window.ZOHO.CRM.CONNECTOR.invokeAPI(
          "zohogooglemaps.googlemapsoauth.updaterecord1",
          {
            module: data.Entity,
            data: data.data,
          }
        );
        if (res.status_code === 200) return JSON.parse(res.response)?.data;
        throw new Error(JSON.stringify(res?.response));
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Error");
      }
    },
  });
