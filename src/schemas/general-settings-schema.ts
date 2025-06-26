import { z } from "zod";

export const generalSettingSchema = z.object({
  lat: z.string().min(1, "Latitude is required."),
  lng: z.string().min(1, "Longitude is required."),
  apiKey: z.string().min(1, "API Key is required."),
  orgId: z.string().min(1, "Organization Id is required"),
});

export type GeneralSettingsSchema = z.infer<typeof generalSettingSchema>;
