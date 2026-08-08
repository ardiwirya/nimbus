import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from "date-fns";

export function formatDueDate(iso: string | null): string {
  if (!iso) return "No due date";
  const date = new Date(iso);
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "MMM d");
}

export function isOverdue(iso: string | null, done: boolean): boolean {
  if (!iso || done) return false;
  return isPast(new Date(iso)) && !isToday(new Date(iso));
}

export function timeAgo(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}
