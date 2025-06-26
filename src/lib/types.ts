type JsonType = "jsonobject" | "integer" | "double" | "string" | "boolean";
type DataType =
  | "ownerlookup"
  | "userlookup"
  | "lookup"
  | "datetime"
  | "text"
  | "integer"
  | "double"
  | "picklist"
  | "phone"
  | "profileimage"
  | "textarea"
  | "boolean"
  | "email"
  | "date";

export interface FieldData {
  system_mandatory: boolean;
  blueprint_supported: boolean;
  webhook: boolean;
  json_type: JsonType;
  crypt: any;
  field_label: string;
  tooltip: string | null;
  created_source: string;
  field_read_only: boolean;
  display_label: string;
  ui_type: number;
  read_only: boolean;
  association_details: any;
  businesscard_supported: boolean;
  currency: object;
  id: string;
  custom_field: boolean;
  lookup: {
    api_name: string;
    module: {
      api_name: string;
    };
  };
  convert_mapping: {
    Contacts: any;
    Deals: any;
    Accounts: any;
  };
  visible: boolean;
  refer_from_field: any;
  rollup_summary: object;
  length: number;
  column_name: string;
  view_type: {
    view: boolean;
    edit: boolean;
    quick_create: boolean;
    create: boolean;
  };
  subform: any;
  show_type: number;
  external: any;
  api_name: string;
  unique: object;
  history_tracking: boolean;
  data_type: DataType;
  formula: object;
  additional_column: any;
  category: number;
  decimal_place: number | null;
  mass_update: boolean;
  multiselectlookup: object;
  pick_list_values: {
    display_value: string;
    actual_value: string;
    id: string;
  }[];
  auto_number: object;
}

export type FilterType = {
  selected: boolean;
  api_name: string;
  operator: string;
  value: any;
  data_type: string;
  json_type: string;
};

export type SelectedFilterItem = {
  api_name: string;
  selected: boolean;
};

export type ResultType = {
  id: string;
  Name: string;
  Value: string;
  Entity: string;
};
