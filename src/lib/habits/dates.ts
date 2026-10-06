import {
  addDays,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  startOfDay as dfStartOfDay,
} from "date-fns";
import { ru } from "date-fns/locale";

export function toDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function startOfLocalDay(date: Date = new Date()): Date {
  return dfStartOfDay(date);
}

export function mondayOf(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

export function weekKeys(anchor: Date): string[] {
  const start = mondayOf(anchor);
  return Array.from({ length: 7 }, (_, i) => toDateKey(addDays(start, i)));
}

export function monthGrid(anchor: Date): (string | null)[] {
  const start = startOfMonth(anchor);
  const end = endOfMonth(anchor);
  const lead = (start.getDay() + 6) % 7;
  const cells: (string | null)[] = Array.from({ length: lead }, () => null);
  for (let d = start; d <= end; d = addDays(d, 1)) {
    cells.push(toDateKey(d));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function eachDateKey(fromKey: string, toKey: string): string[] {
  const keys: string[] = [];
  let d = parseDateKey(fromKey);
  const end = parseDateKey(toKey);
  while (d <= end) {
    keys.push(toDateKey(d));
    d = addDays(d, 1);
  }
  return keys;
}

export function checkinKey(habitId: string, dateKey: string): string {
  return `${habitId}:${dateKey}`;
}

export function formatWeekday(date: Date): string {
  return format(date, "EEEE", { locale: ru });
}

export function formatDayMonth(date: Date): string {
  return format(date, "d MMMM", { locale: ru });
}

export function formatMonthYear(date: Date): string {
  return format(date, "LLLL yyyy", { locale: ru });
}

export function formatWeekRange(anchor: Date): string {
  const start = mondayOf(anchor);
  const end = addDays(start, 6);
  if (start.getMonth() === end.getMonth()) {
    return `${format(start, "d", { locale: ru })}–${format(end, "d MMMM", { locale: ru })}`;
  }
  return `${format(start, "d MMM", { locale: ru })} – ${format(end, "d MMM", { locale: ru })}`;
}

export function hourGreeting(date: Date = new Date()): string {
  const h = date.getHours();
  if (h < 5) return "Доброй ночи";
  if (h < 12) return "Доброе утро";
  if (h < 18) return "Добрый день";
  return "Добрый вечер";
}
