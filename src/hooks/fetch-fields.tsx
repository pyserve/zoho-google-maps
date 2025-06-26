import { useQuery } from "@tanstack/react-query";

export const useFetchFields = (data: { module: string }) =>
  useQuery({
    queryKey: [data.module],
    queryFn: async () => {
      try {
        const res = await window.ZOHO.CRM.CONNECTOR.invokeAPI(
          "zohogooglemaps.googlemapsoauth.getmetafields",
          {
            module: data.module,
          }
        );
        if (res.status_code === 200) {
          const results = JSON.parse(res.response)?.fields;
          return results;
        }
        throw new Error(JSON.parse(res.response));
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Error");
      }
    },
  });
