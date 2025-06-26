import { buildQueryCondition } from "@/lib/query-builder";
import { FilterType } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";

export const useSearchRecords = () => {
  return useMutation({
    mutationFn: async (data: {
      filters: FilterType[];
      Entity: string;
      fields: string[];
      mandatoryFields?: string[];
      limit?: number;
      offset?: number;
    }) => {
      try {
        const queryConditions = data.filters
          ?.filter((f) => f.selected)
          ?.map(buildQueryCondition)
          ?.filter(Boolean);

        const condition = queryConditions.reduce(
          (acc, curr) => (acc ? `(${acc} and ${curr})` : `(${curr})`),
          ""
        );

        const uniqueColumns = Array.from(
          new Set([...(data.fields ?? []), ...(data.mandatoryFields ?? [])])
        );

        const query = `Select ${uniqueColumns} from ${
          data.Entity
        } where ${condition} limit ${data?.limit || 5} offset ${
          data.offset || 0
        }`;
        console.log("🚀 ~ query:", query);

        const res = await window.ZOHO.CRM.CONNECTOR.invokeAPI(
          "zohogooglemaps.googlemapsoauth.searchquery0",
          {
            query,
          }
        );

        const status = res.status_code;
        if (status !== 200) {
          if (status === 204) return [];
          const responseData = JSON.parse(res?.response);
          throw new Error(JSON.stringify(responseData, null, 4));
        }
        const responseData = JSON.parse(res?.response);
        return responseData ?? [];
      } catch (error) {
        console.log("🚀 ~ error:", error);
        throw new Error(error instanceof Error ? error.message : "Error");
      }
    },
  });
};

export const useFilteredSearchRecords = () => {
  const searchRecords = useSearchRecords();
  return useMutation({
    mutationKey: ["filterSearchRecords"],
    mutationFn: async (data: {
      Entity: string;
      fields?: string[];
      col_name: string;
    }) => {
      try {
        const results = await searchRecords.mutateAsync({
          filters: [
            {
              selected: true,
              api_name: "Name",
              operator: "equals",
              value: data.col_name,
              data_type: "text",
              json_type: "string",
            },
            {
              selected: true,
              api_name: "Entity",
              operator: "equals",
              value: data?.Entity,
              data_type: "text",
              json_type: "string",
            },
          ],
          Entity: "Map_Variables",
          fields: data?.fields ?? [],
        });
        return results?.data;
      } catch (error) {
        console.log("🚀 ~ error:", error);
        throw new Error(error instanceof Error ? error.message : "Error");
      }
    },
  });
};
