"use client";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";

declare global {
  interface Window {
    ZOHO: {
      embeddedApp: any;
      CRM: {
        API: any;
        UI: any;
        META: any;
        CONNECTION: any;
        CONNECTOR: any;
      };
    };
  }
}

export type ModuleConfig = {
  primary_time?: string;
  primary_address?: string;
  max_fetch_limit?: number;
  filterColumns?: string[];
  contentColumns?: string[];
};

export type OrgData = {
  lat: string;
  lng: string;
  apiKey: string;
  orgId: string;
  [key: string]: ModuleConfig | string | number | undefined;
  id: string;
};

export type ZohoData = {
  Entity: string;
  EntityId: string;
  IsButton: boolean;
  org?: OrgData;
  updateOrg?: (data: Partial<OrgData>) => Promise<void>;
};

export type ZohoContextType = {
  zoho: ZohoData | null;
};

const ZohoContext = createContext<ZohoContextType | null>(null);

export default function ZohoContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [zoho, setZoho] = useState<ZohoData | null>(null);
  const zohoRef = useRef<ZohoData | null>(zoho);

  useEffect(() => {
    zohoRef.current = zoho;
  }, [zoho]);

  const updateOrgVariable = useCallback(
    async (dataToUpdate: Partial<OrgData>) => {
      try {
        if (!zohoRef.current?.org) return;
        const { id: orgId, ...prevOrgData } = zohoRef.current.org;

        if (!orgId) {
          console.error(
            "updateOrgVariable: Org Variable ID is null or undefined."
          );
          throw new Error(
            "Org Variable ID not available. Cannot update settings."
          );
        }

        const newOrgVariableValue = JSON.stringify({
          ...prevOrgData,
          ...dataToUpdate,
        });

        const res = await window.ZOHO.CRM.CONNECTOR.invokeAPI(
          "zohogooglemaps.googlemapsoauth.updategooglemaporgvariable",
          {
            data: {
              variables: [{ id: orgId, value: newOrgVariableValue }],
            },
          }
        );

        if (!(res.status_code === 200 || res.status_code === 201)) {
          throw new Error(
            res.response || `API update failed with status: ${res.status_code}`
          );
        }

        setZoho((currentZoho) => {
          if (!currentZoho || !currentZoho.org) return currentZoho;
          return {
            ...currentZoho,
            org: {
              ...currentZoho.org,
              ...dataToUpdate,
            },
          };
        });

        return JSON.parse(res.response);
      } catch (error) {
        console.error("🚀 ~ updateOrgVariable ~ error:", error);
        throw new Error(
          error instanceof Error
            ? error.message
            : "Error updating org variable."
        );
      }
    },
    []
  );

  useEffect(() => {
    const fetchOrgVariables = async () => {
      if (typeof window !== "undefined" && window.ZOHO) {
        try {
          const res1 = await window.ZOHO.CRM.CONNECTOR.invokeAPI(
            "zohogooglemaps.googlemapsoauth.getorgvariables",
            {}
          );
          const content = res1?.status_code === 200;

          if (!content) {
            throw new Error("No org variable data received.");
          }

          const results = JSON.parse(res1?.response);
          const variables = results?.variables?.filter(
            (res: { api_name: string }) =>
              res.api_name === "zohogooglemaps_Zoho_Google_Map"
          )?.[0];

          const orgVariable = JSON.parse(variables?.value);
          if (!orgVariable.apiKey) {
            toast.error("Please provide apiKey in environment variable.");
          }

          setZoho((prevZoho) => {
            if (prevZoho === null) return null;
            return {
              ...prevZoho,
              org: { ...orgVariable, id: variables?.id },
              updateOrg: updateOrgVariable,
            };
          });
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Error");
        }
      }
    };

    if (window.ZOHO) {
      window.ZOHO.embeddedApp.on("PageLoad", (data: ZohoData) => {
        setZoho({
          Entity: data.Entity,
          EntityId: Array.isArray(data.EntityId)
            ? data.EntityId?.[0]
            : data.EntityId,
          IsButton: Array.isArray(data.EntityId),
        });
        const width = window.screen.width;
        const height = window.screen.height;
        window.ZOHO.CRM.UI.Resize({ height: height, width: width });
        fetchOrgVariables();
      });
      window.ZOHO.embeddedApp.init();
    }
  }, []);

  return (
    <ZohoContext.Provider value={{ zoho }}>{children}</ZohoContext.Provider>
  );
}

export const useZohoContext = () => {
  const context = useContext(ZohoContext);
  if (!context) throw new Error("Zoho Context must be initialized.");
  return context;
};
