import { format, formatDistanceToNow } from "date-fns"

export function formatDate(date: string | Date): string {
  return format(new Date(date), "PPp")
}

export function formatRelativeDate(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}
