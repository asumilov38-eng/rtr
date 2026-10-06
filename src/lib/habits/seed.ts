import { addDays } from "date-fns";
import type { Checkins, Habit } from "./types";
import { ALL_DAYS, WEEKDAYS } from "./types";
import { checkinKey, toDateKey } from "./dates";
import { isDueOn } from "./stats";

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createDemoData(now = new Date()): { habits: Habit[]; checkins: Checkins } {
  const today = toDateKey(now);
  const createdAt = addDays(now, -72).getTime();

  const habits: Habit[] = [
    {
      id: "demo-charge",
      name: "Утренняя зарядка",
      note: "Десять минут, без телефона",
      color: "sage",
      icon: "dumbbell",
      days: ALL_DAYS,
      kind: "boolean",
      target: 1,
      createdAt,
    },
    {
      id: "demo-read",
      name: "Чтение",
      note: "Хотя бы двадцать страниц",
      color: "slate",
      icon: "book",
      days: ALL_DAYS,
      kind: "boolean",
      target: 1,
      createdAt,
    },
    {
      id: "demo-water",
      name: "Вода",
      note: "Восемь стаканов за день",
      color: "teal",
      icon: "droplet",
      days: ALL_DAYS,
      kind: "count",
      target: 8,
      createdAt,
    },
    {
      id: "demo-meditate",
      name: "Медитация",
      note: "Пять минут тишины",
      color: "rose",
      icon: "brain",
      days: WEEKDAYS,
      kind: "boolean",
      target: 1,
      createdAt,
    },
    {
      id: "demo-walk",
      name: "Прогулка",
      note: "На воздухе, без наушников",
      color: "olive",
      icon: "footprints",
      days: [0, 6],
      kind: "boolean",
      target: 1,
      createdAt,
    },
  ];

  const skipChance: Record<string, number> = {
    "demo-charge": 0.18,
    "demo-read": 0.28,
    "demo-water": 0.12,
    "demo-meditate": 0.32,
    "demo-walk": 0.22,
  };

  const rand = mulberry32(20261005);
  const checkins: Checkins = {};
  const createdKey = toDateKey(new Date(createdAt));

  for (let i = 71; i >= 0; i--) {
    const date = addDays(now, -i);
    const key = toDateKey(date);
    if (key > today) continue;
    const recent = i <= 4 && i > 0;

    for (const habit of habits) {
      if (key < createdKey) continue;
      if (!isDueOn(habit, key)) continue;
      if (key === today) {
        if (habit.id === "demo-read") checkins[checkinKey(habit.id, key)] = 1;
        if (habit.id === "demo-water") checkins[checkinKey(habit.id, key)] = 3;
        continue;
      }
      const miss = recent ? false : rand() < (skipChance[habit.id] ?? 0.2);
      if (miss) continue;
      if (habit.kind === "count") {
        const n = 6 + Math.floor(rand() * 3);
        checkins[checkinKey(habit.id, key)] = Math.min(habit.target, n);
      } else {
        checkins[checkinKey(habit.id, key)] = 1;
      }
    }
  }

  return { habits, checkins };
}
