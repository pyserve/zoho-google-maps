"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useZohoContext } from "@/contexts/zoho-context";
import { useFetchFields } from "@/hooks/fetch-fields";
import { useStore } from "@/lib/store";
import { FieldData } from "@/lib/types";
import _ from "lodash";
import { useEffect } from "react";
import { FilterColumnsSelector } from "./filter-columns-selector";
import { SearchForm } from "./search-form";
import SidebarFilters from "./sidebar-filters";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { zoho } = useZohoContext();
  const { fields, setFields, searchQuery, filters, selectedFilterColumns } =
    useStore();

  const { data: fieldsResults } = useFetchFields({
    module: zoho?.Entity ?? "Leads",
  });

  const activeFilters = filters
    .filter((f) => f.selected)
    .map((f) => fields.find((fld) => fld.api_name === f.api_name))
    .filter((f): f is FieldData => f !== undefined);

  const filteredFields = searchQuery.trim()
    ? fields.filter((field) =>
        field.field_label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : fields;

  const mergedFields = _.uniqBy(
    [...activeFilters, ...filteredFields],
    "api_name"
  );

  const data = {
    versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
    navMain: [
      {
        title: "Module Filters",
        url: "#",
        items: mergedFields?.filter((fld) =>
          selectedFilterColumns.some(
            (f) => f.api_name === fld.api_name && f.selected
          )
        ),
      },
    ],
  };

  useEffect(() => {
    if (fieldsResults)
      setFields(
        fieldsResults?.filter((result: FieldData) =>
          [
            "picklist",
            "text",
            "email",
            "phone",
            "date",
            "datetime",
            "integer",
            "double",
            "ownerlookup",
            "userlookup",
            "lookup",
            "boolean",
          ].includes(result.data_type)
        )
      );
  }, [fieldsResults]);

  return (
    <Sidebar {...props}>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="flex items-center justify-between">
              <span>
                {zoho?.Entity} {item.title}
              </span>

              <FilterColumnsSelector />
            </SidebarGroupLabel>

            <SearchForm />

            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarFilters items={item.items} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
