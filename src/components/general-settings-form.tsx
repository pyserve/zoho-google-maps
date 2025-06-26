import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useZohoContext, ZohoContextType } from "@/contexts/zoho-context";
import {
  generalSettingSchema,
  GeneralSettingsSchema,
} from "@/schemas/general-settings-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Settings2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { DialogFooter } from "./ui/dialog";

export function GeneralSettingsForm() {
  const { zoho } = useZohoContext() as ZohoContextType;
  const form = useForm<GeneralSettingsSchema>({
    resolver: zodResolver(generalSettingSchema),
    defaultValues: {
      lat: "",
      lng: "",
      apiKey: "",
      orgId: "",
    },
  });

  useEffect(() => {
    if (zoho?.org) {
      form.reset({
        lat: zoho.org.lat ?? 43.641,
        lng: zoho.org.lng ?? -79.347,
        apiKey: zoho.org.apiKey,
        orgId: zoho.org.orgId,
      });
    }
  }, [zoho]);

  const onSubmit = async (data: GeneralSettingsSchema) => {
    try {
      if (!zoho?.updateOrg)
        throw new Error("updateOrg function not defined in context.");
      await zoho.updateOrg(data);

      toast.success("General settings updated successfully.");
    } catch (error) {
      console.error("Error updating general settings:", error);
      toast.error(
        error instanceof Error ? error.message : "Error updating settings."
      );
    }
  };

  return (
    <Card className="max-h-[75vh] overflow-auto">
      <CardHeader>
        <CardTitle className="flex gap-1 items-center">
          <Settings2 />
          <span>General Settings</span>
        </CardTitle>
        <CardDescription>
          Make changes to your general settings here. This will be same for all
          modules.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-6 py-4">
              <FormField
                control={form.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 items-center">
                    <FormLabel className="col-span-1">Maps API Key:</FormLabel>
                    <FormControl className="col-span-2">
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-2 text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="orgId"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 items-center">
                    <FormLabel className="col-span-1">Org Id:</FormLabel>
                    <FormControl className="col-span-2">
                      <Input type="text" {...field} placeholder="771781231" />
                    </FormControl>
                    <FormMessage className="col-span-2 text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lat"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 items-center">
                    <FormLabel className="col-span-1">Latitude:</FormLabel>
                    <FormControl className="col-span-2">
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-2 text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lng"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 items-center">
                    <FormLabel className="col-span-1">Longitude:</FormLabel>
                    <FormControl className="col-span-2">
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-2 text-right" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
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
