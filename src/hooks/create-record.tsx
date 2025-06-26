import { useMutation } from "@tanstack/react-query";

export const useCreateRecord = () => {
  return useMutation({
    mutationKey: ["createRecord"],
    mutationFn: async (data: {
      data: Record<string, string>;
      Entity: string;
    }) => {
      try {
        const res = await window.ZOHO.CRM.CONNECTOR.invokeAPI(
          "zohogooglemaps.googlemapsoauth.createrecord",
          {
            module: data.Entity,
            data: [data.data],
          }
        );
        if (res.status_code === 201) return JSON.parse(res.response)?.data;
        throw new Error(JSON.stringify(JSON.parse(res.response)));
      } catch (error) {
        console.log("🚀 ~ error:", error);
        throw new Error(error instanceof Error ? error.message : "Error");
      }
    },
  });
};
