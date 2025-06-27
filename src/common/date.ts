import { format } from "date-fns";

export function formatDate(date: string) {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'");
}
