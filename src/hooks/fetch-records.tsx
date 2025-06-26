import { useQuery } from "@tanstack/react-query";

export const useFetchRecords = (data: { module: string; fields: string[] }) =>
  useQuery({
    queryKey: [data.module],
    queryFn: async () => {
      try {
        const res = await window.ZOHO.CRM.CONNECTOR.invokeAPI(
          "zohogooglemaps.googlemapsoauth.getrecords",
          {
            module: data.module,
            fields: data.fields?.join(","),
            page: 1,
            per_page: 200,
          }
        );
        if (res.status_code === 200) {
          const results = JSON.parse(res.response)?.data;
          return results;
        }
        throw new Error(JSON.stringify(JSON.parse(res.response)));
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Error");
      }
    },
  });
