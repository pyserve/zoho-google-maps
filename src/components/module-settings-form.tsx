import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAppContext } from "@/contexts/app-context";
import { useDevelopmentContext } from "@/contexts/contexts";
import { useZohoContext, ZohoContextType } from "@/contexts/zoho-context";
import { useCreateRecord } from "@/hooks/create-record";
import { useUpdateRecord } from "@/hooks/update-record";
import { useStore } from "@/lib/store";
import { ResultType } from "@/lib/types";
import { settingSchema, SettingsSchema } from "@/schemas/app-settings-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Combobox } from "./ui/combobox";
import { Input } from "./ui/input";

export default function ModuleSettingsForm() {
  const { fields } = useStore();
  const { zoho } = useZohoContext() as ZohoContextType;
  const { settings } = useAppContext();
  const { prod } = useDevelopmentContext();
  const createRecord = useCreateRecord();
  const updateRecord = useUpdateRecord();
  const [results, setResults] = useState<ResultType[]>([]);
  const form = useForm<SettingsSchema>({
    resolver: zodResolver(settingSchema),
  });

  useEffect(() => {
    if (settings) setResults(settings);
  }, [settings]);

  useEffect(() => {
    if (results.length > 0) {
      const initialValue: { key: string; value: string } = JSON.parse(
        results?.[0]?.[prod ? "zohogooglemaps__Value" : "Value"] ?? "{}"
      );
      Object.entries(initialValue).map(([key, value]) => {
        form.setValue(key as keyof SettingsSchema, value);
      });
    }
  }, [results]);

  useEffect(() => {
    console.log("Form Errors:", form.formState.errors);
  }, [form.formState.errors, form.formState.isSubmitting]);

  const fieldOptions =
    fields?.map((f) => ({
      label: f.display_label,
      value: f.api_name,
      data_type: f.data_type,
    })) ?? [];

  const timeFieldOptions = fieldOptions?.filter(
    (f) => f.data_type == "datetime"
  );
  const addressFieldOptions = fieldOptions?.filter(
    (f) => f.data_type == "text"
  );

  const onSubmit = async (data: SettingsSchema) => {
    try {
      if (results.length > 0) {
        const res = await updateRecord.mutateAsync({
          Entity: prod ? "zohogooglemaps__Map_Variables" : "Map_Variables",
          data: [
            {
              id: results?.[0]?.id,
              [prod ? "zohogooglemaps__Value" : "Value"]: JSON.stringify(data),
            },
          ],
        });
        console.log("🚀 ~ handleSave ~ res:", res);
        toast.success(`${zoho?.Entity} settings updated sucessfully.`);
      } else {
        const res = await createRecord.mutateAsync({
          Entity: prod ? "zohogooglemaps__Map_Variables" : "Map_Variables",
          data: {
            Name: "Settings",
            [prod ? "zohogooglemaps__Entity" : "Entity"]: zoho?.Entity ?? "",
            [prod ? "zohogooglemaps__Value" : "Value"]: JSON.stringify(data),
          },
        });
        console.log("🚀 ~ handleSave ~ res:", res);
        toast.success(`${zoho?.Entity} settings created sucessfully.`);
      }
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);
      toast.error(error instanceof Error ? error.message : "Error");
    }
  };

  return (
    <Card className="max-h-[75vh] overflow-auto">
      <CardHeader>
        <CardTitle className="flex gap-1 items-center">
          <Package />
          <span>{zoho?.Entity} Settings</span>
        </CardTitle>
        <CardDescription>
          Make changes to your module settings here. This will be specific to a
          module.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="primary_time"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 items-center">
                    <FormLabel>Time Field For Calendar:</FormLabel>
                    <FormControl>
                      <Combobox
                        options={timeFieldOptions}
                        onValueChange={(val) =>
                          field.onChange(val || undefined)
                        }
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage className="col-span-2 text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="primary_address"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 items-center">
                    <FormLabel>Primary Address Field:</FormLabel>
                    <FormControl>
                      <Combobox
                        options={addressFieldOptions}
                        onValueChange={(val) =>
                          field.onChange(val || undefined)
                        }
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage className="col-span-2 text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_fetch_limit"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 items-center">
                    <FormLabel>Max Records Fetch Limit:</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step={1}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === "" ? undefined : Number(val));
                        }}
                      />
                    </FormControl>
                    <FormMessage className="col-span-2 text-right" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="animate-spin" /> <span>Saving..</span>
                  </span>
                ) : (
                  <span>Save changes</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
