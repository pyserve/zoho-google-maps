import { FilterType } from "./types";

export const buildQueryCondition = (filter: FilterType) => {
  const { api_name, operator, value } = filter;
  switch (operator) {
    case "equals":
      return `${api_name}='${value}'`;
    case "between":
      return `${api_name} between '${value[0]}' and '${value[1]}'`;
    case "before":
      return `${api_name} < '${value}'`;
    case "after":
      return `${api_name} > '${value}'`;
    case "is":
      if (Array.isArray(value)) {
        return `${api_name} in (${value.map((v) => `'${v}'`).join(", ")})`;
      } else {
        return `${api_name}='${value}'`;
      }
    case "is_not":
      if (Array.isArray(value)) {
        return `${api_name} not in (${value.map((v) => `'${v}'`).join(", ")})`;
      } else {
        return `${api_name}!='${value}'`;
      }
    case "contains":
      return `${api_name} like '%${value}%'`;
    case "starts_with":
      return `${api_name} like '${value}%'`;
    case "ends_with":
      return `${api_name} like '%${value}'`;
    case "is_empty":
      return `${api_name} is null`;
    case "is_not_empty":
      return `${api_name} is not null`;
    case "gte":
      return `${api_name} >= ${value}`;
    case "lte":
      return `${api_name} <= ${value}`;
    case "gt":
      return `${api_name} > ${value}`;
    case "lt":
      return `${api_name} < ${value}`;
    default:
      return null;
  }
};
