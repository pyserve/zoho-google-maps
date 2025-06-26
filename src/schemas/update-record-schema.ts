import { FieldData } from "@/lib/types";
import { z, ZodTypeAny } from "zod";

export const EXCLUDE_FIELDS = [
  "Created_Time",
  "Modified_Time",
  "Created_By",
  "Modified_By",
  "Last_Activity_Time",
  "Unsubscribed_Time",
  "Change_Log_Time__s",
  "Last_Enriched_Time__s",
  "zohogooglemaps__latitude",
  "zohogooglemaps__longitude",
  "Record_Image",
  "Tag",
];

export function generateSchema(fields: FieldData[]) {
  const schemaShape: Record<string, ZodTypeAny> = {};

  for (const field of fields) {
    if (EXCLUDE_FIELDS.includes(field.api_name)) continue;

    let baseType: ZodTypeAny;

    switch (field.data_type) {
      case "text":
      case "textarea":
      case "phone":
      case "email":
      case "picklist":
      case "profileimage":
      case "ownerlookup":
      case "lookup":
        baseType = z.string().nullable();
        break;

      case "boolean":
        baseType = z.boolean().nullable();
        break;

      case "integer":
        baseType = z.union([z.number().nullable(), z.nan()]);
        break;

      case "double":
        baseType = z.union([z.number().nullable(), z.nan()]);
        break;

      case "date":
      case "datetime":
        baseType = z.union([z.string().nullable(), z.date().nullable()]);
        break;

      default:
        baseType = z.any().nullable();
    }

    schemaShape[field.api_name] = field.system_mandatory
      ? baseType
      : baseType.optional();
  }

  return z.object(schemaShape);
}
