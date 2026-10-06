import { addDays, addWeeks } from "date-fns";
import type { Checkins, Habit } from "./types";
import { checkinKey, parseDateKey, toDateKey, weekKeys } from "./dates";

export function isDueOn(habit: Habit, dateKey: string): boolean {
  return habit.days.includes(parseDateKey(dateKey).getDay());
}

export function targetOf(habit: Habit): number {
  return habit.kind === "count" ? Math.max(1, habit.target) : 1;
}

export function isDone(habit: Habit, value: number): boolean {
  return value >= targetOf(habit);
}

export function getValue(checkins: Checkins, habitId: string, dateKey: string): number {
  return checkins[checkinKey(habitId, dateKey)] ?? 0;
}

export function dueOnDay(habits: Habit[], dateKey: string): Habit[] {
  return habits.filter((h) => isDueOn(h, dateKey));
}

function createdKey(habit: Habit): string {
  return toDateKey(new Date(habit.createdAt));
}

export function dueDaysBetween(habit: Habit, fromKey: string, toKey: string): string[] {
  const created = createdKey(habit);
  const start = fromKey > created ? fromKey : created;
  const days: string[] = [];
  let d = parseDateKey(start);
  const end = parseDateKey(toKey);
  while (d <= end) {
    const key = toDateKey(d);
    if (isDueOn(habit, key)) days.push(key);
    d = addDays(d, 1);
  }
  return days;
}

export function currentStreak(habit: Habit, checkins: Checkins, todayKey: string): number {
  let cursor = parseDateKey(todayKey);
  const todayDue = isDueOn(habit, todayKey);
  const todayDone = isDone(habit, getValue(checkins, habit.id, todayKey));
  if (todayDue && !todayDone) {
    cursor = addDays(cursor, -1);
  }

  const created = createdKey(habit);
  let streak = 0;
  for (let i = 0; i < 800; i++) {
    const key = toDateKey(cursor);
    if (key < created) break;
    if (!isDueOn(habit, key)) {
      cursor = addDays(cursor, -1);
      continue;
    }
    if (!isDone(habit, getValue(checkins, habit.id, key))) break;
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function bestStreak(habit: Habit, checkins: Checkins, todayKey: string): number {
  const days = dueDaysBetween(habit, createdKey(habit), todayKey);
  let best = 0;
  let run = 0;
  for (const key of days) {
    if (isDone(habit, getValue(checkins, habit.id, key))) {
      run += 1;
      if (run > best) best = run;
    } else {
      run = 0;
    }
  }
  return best;
}

export function completionRate(habit: Habit, checkins: Checkins, fromKey: string, toKey: string): number {
  const days = dueDaysBetween(habit, fromKey, toKey);
  if (days.length === 0) return 0;
  const done = days.filter((key) => isDone(habit, getValue(checkins, habit.id, key))).length;
  return done / days.length;
}

export function completionsInRange(habit: Habit, checkins: Checkins, fromKey: string, toKey: string): number {
  return dueDaysBetween(habit, fromKey, toKey).filter((key) =>
    isDone(habit, getValue(checkins, habit.id, key)),
  ).length;
}

export function dayCompletion(
  habits: Habit[],
  checkins: Checkins,
  dateKey: string,
): { due: number; done: number } {
  const due = dueOnDay(habits, dateKey);
  const done = due.filter((h) => isDone(h, getValue(checkins, h.id, dateKey))).length;
  return { due: due.length, done };
}

export type WeekPoint = {
  weekStart: string;
  label: string;
  rate: number;
  done: number;
  due: number;
};

export function weeklyRates(
  habits: Habit[],
  checkins: Checkins,
  today: Date,
  weeks = 8,
): WeekPoint[] {
  const thisMonday = weekKeys(today)[0]!;
  const points: WeekPoint[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const start = addWeeks(parseDateKey(thisMonday), -i);
    const keys = weekKeys(start);
    const endKey = keys[6]!;
    const startKey = keys[0]!;
    let due = 0;
    let done = 0;
    for (const habit of habits) {
      const days = dueDaysBetween(habit, startKey, endKey > toDateKey(today) ? toDateKey(today) : endKey);
      due += days.length;
      done += days.filter((k) => isDone(habit, getValue(checkins, habit.id, k))).length;
    }
    points.push({
      weekStart: startKey,
      label: `${start.getDate()}.${String(start.getMonth() + 1).padStart(2, "0")}`,
      rate: due === 0 ? 0 : Math.round((done / due) * 100),
      done,
      due,
    });
  }
  return points;
}

export type HeatCell = {
  dateKey: string;
  due: boolean;
  value: number;
  done: boolean;
  future: boolean;
};

export function heatmapWeeks(habit: Habit, checkins: Checkins, todayKey: string, weeks = 16): HeatCell[][] {
  const today = parseDateKey(todayKey);
  const thisMonday = parseDateKey(weekKeys(today)[0]!);
  const start = addWeeks(thisMonday, -(weeks - 1));
  const columns: HeatCell[][] = [];
  for (let w = 0; w < weeks; w++) {
    const col: HeatCell[] = [];
    for (let d = 0; d < 7; d++) {
      const date = addDays(start, w * 7 + d);
      const dateKey = toDateKey(date);
      const value = getValue(checkins, habit.id, dateKey);
      col.push({
        dateKey,
        due: isDueOn(habit, dateKey) && dateKey >= createdKey(habit),
        value,
        done: isDone(habit, value),
        future: dateKey > todayKey,
      });
    }
    columns.push(col);
  }
  return columns;
}
