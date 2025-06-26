import { z } from "zod";

export const settingSchema = z.object({
  primary_time: z
    .string()
    .optional()
    .refine((val) => val === undefined || val.trim() !== "", {
      message: "Time field cannot be an empty string",
    }),
  primary_address: z
    .string()
    .optional()
    .refine((val) => val === undefined || val.trim() !== "", {
      message: "Primary address cannot be an empty string",
    }),
  max_fetch_limit: z
    .number()
    .int("Must be an integer")
    .positive("Must be greater than 0")
    .max(2000, "Must be less than 2000")
    .optional(),
});

export type SettingsSchema = z.infer<typeof settingSchema>;
