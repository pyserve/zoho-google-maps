"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import { EXCLUDE_FIELDS, generateSchema } from "@/schemas/update-record-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import _ from "lodash";
import { Edit, Loader2 } from "lucide-react";
import { ReactNode, useEffect, useMemo } from "react";
import { UseControllerReturn, useForm } from "react-hook-form";
import { z } from "zod";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ZohoData } from "@/contexts/zoho-context";
import { useUpdateRecord } from "@/hooks/update-record";
import { FieldData } from "@/lib/types";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { DateTimeInput } from "./datetime-input2";
import LookupSelect from "./lookup-select";
import { Combobox } from "./ui/combobox";
import UserLookupSelect from "./user-lookup-select";

interface UpdateRecordProps {
  children?: ReactNode;
  record?: any;
  zoho: ZohoData | null;
}

export function preprocessRecordDefaults(
  record: Record<string, any>,
  fields: FieldData[]
) {
  return Object.fromEntries(
    fields.map((field) => {
      const key = field.api_name;
      const type = field.data_type;
      const value = record?.[key];

      if (value === null || value === undefined) {
        return [key, null];
      }

      if (typeof value === "object" && "id" in value) {
        return [key, value.id];
      }

      if (type === "datetime") {
        const date = dayjs(value);
        return [key, date.isValid() ? date.format("YYYY-MM-DDTHH:mm") : null];
      }

      return [key, value];
    })
  );
}

export default function UpdateRecord({
  children,
  record,
  zoho,
}: UpdateRecordProps) {
  const { fields, selectedContentColumns } = useStore();
  const schema = generateSchema(fields);
  type FormData = z.infer<typeof schema>;
  const updateRecord = useUpdateRecord();

  const fieldsToDisplayInForm = useMemo(
    () =>
      _.sortBy(fields, "api_name").filter(
        (field) =>
          !EXCLUDE_FIELDS?.includes(field.api_name) &&
          selectedContentColumns.some(
            (col) => col.api_name === field.api_name && col.selected
          )
      ),
    [fields, selectedContentColumns]
  );

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const newDefaults = preprocessRecordDefaults(record, fieldsToDisplayInForm);
    form.reset(newDefaults);
  }, [record?.id, fieldsToDisplayInForm]);

  useEffect(() => {
    if (form.formState.isSubmitting) console.log(form.formState.errors);
  }, [form.formState.errors, form.formState.isSubmitting]);

  const onSubmit = async (data: FormData) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    try {
      const res = await updateRecord.mutateAsync({
        Entity: zoho?.Entity ?? "",
        data: [
          {
            ...data,
            id: record?.id,
          },
        ],
      });
      toast.success(`${res?.[0].code}: Record updated sucessfully!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error");
    }
  };

  const renderInput = (
    field: (typeof fields)[0],
    formField: UseControllerReturn["field"]
  ) => {
    const name = field.api_name;

    switch (field.data_type) {
      case "picklist":
        return (
          <Combobox
            options={field.pick_list_values?.map((pl) => ({
              label: pl.display_value,
              value: pl.actual_value,
            }))}
            value={formField.value}
            onValueChange={formField.onChange}
          />
        );
      case "ownerlookup":
      case "userlookup":
        return (
          <UserLookupSelect
            value={formField.value}
            onValueChange={formField.onChange}
          />
        );
      case "lookup":
        return (
          <LookupSelect
            value={formField.value}
            onValueChange={formField.onChange}
            module={field.lookup?.module?.api_name}
            zoho={zoho}
            fields={["First_Name", "Last_Name"]}
          />
        );

      case "boolean":
        return (
          <FormControl>
            <Checkbox
              checked={!!form.getValues(name)}
              {...form.register(name)}
            />
          </FormControl>
        );
      case "textarea":
        return (
          <FormControl>
            <Textarea {...form.register(name)} />
          </FormControl>
        );
      case "integer":
      case "double":
        return (
          <FormControl>
            <Input
              type="number"
              step={field.data_type === "integer" ? "1" : "any"}
              {...form.register(name, { valueAsNumber: true })}
            />
          </FormControl>
        );
      case "email":
        return (
          <FormControl>
            <Input type="email" {...form.register(name)} />
          </FormControl>
        );
      case "date":
        return (
          <FormControl>
            <Input type="date" {...form.register(name)} />
          </FormControl>
        );
      case "datetime":
        return (
          <FormControl>
            <DateTimeInput
              name={field.api_name}
              value={formField.value}
              onChangeValue={formField.onChange}
            />
          </FormControl>
        );
      default:
        return (
          <FormControl>
            <Input type="text" {...form.register(name)} />
          </FormControl>
        );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          type="button"
          className="flex items-center justify-center gap-1"
        >
          <Edit className="w-4 h-4" />
          Update
        </Button>
      </DialogTrigger>

      <DialogContent
        onWheel={(e) => e.stopPropagation()}
        className="max-h-[90vh] flex flex-col overflow-hidden"
      >
        <DialogHeader className="shrink-0">
          <DialogTitle>Update Record</DialogTitle>
          <DialogDescription>Edit the record details below.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto space-y-4 py-2 px-1"
          >
            {children ?? (
              <>
                {_.sortBy(fieldsToDisplayInForm, "api_name").map((field) => (
                  <FormField
                    key={field.api_name}
                    control={form.control}
                    name={field.api_name}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <span>{field.display_label || formField.name}</span>
                          {field.system_mandatory && (
                            <span className="text-red-500 ">*</span>
                          )}
                        </FormLabel>
                        {renderInput(field, formField)}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </>
            )}
          </form>

          <DialogFooter className="shrink-0 border-t pt-4 mt-2 bg-white sticky bottom-0 z-10">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              onClick={() => form.handleSubmit(onSubmit)()}
            >
              {form.formState.isSubmitting ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="animate-spin" />
                  <span>Updating..</span>
                </span>
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
