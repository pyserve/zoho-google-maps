import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettingsForm } from "./general-settings-form";
import ModuleSettingsForm from "./module-settings-form";

export default function AppSettings() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"sm"} variant="outline">
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onWheel={(e) => e.stopPropagation()}
      >
        <DialogTitle>Application Settings</DialogTitle>
        <DialogDescription>
          Manage the settings for <b>Zoho Google Map</b> application.
        </DialogDescription>
        <div className="flex w-full max-w-sm flex-col gap-6 mt-4">
          <Tabs defaultValue="general">
            <TabsList className="w-full">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="module">Module</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <GeneralSettingsForm />
            </TabsContent>
            <TabsContent value="module">
              <ModuleSettingsForm />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
