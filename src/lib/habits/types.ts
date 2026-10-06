export const HABIT_COLOR_IDS = [
  "sage",
  "teal",
  "slate",
  "olive",
  "clay",
  "rose",
  "sky",
  "ink",
] as const;

export type HabitColorId = (typeof HABIT_COLOR_IDS)[number];

export const HABIT_ICON_IDS = [
  "leaf",
  "book",
  "dumbbell",
  "droplet",
  "brain",
  "moon",
  "sun",
  "heart",
  "coffee",
  "footprints",
  "pen",
  "music",
] as const;

export type HabitIconId = (typeof HABIT_ICON_IDS)[number];

export type HabitKind = "boolean" | "count";

/** `days` uses JS getDay() values: 0 = Sunday … 6 = Saturday. */
export type Habit = {
  id: string;
  name: string;
  note: string;
  color: HabitColorId;
  icon: HabitIconId;
  days: number[];
  kind: HabitKind;
  target: number;
  createdAt: number;
};

export type HabitDraft = Omit<Habit, "id" | "createdAt">;

/** Keyed `${habitId}:${yyyy-mm-dd}` → completion count for that day. */
export type Checkins = Record<string, number>;

export const HABIT_COLOR_LABELS: Record<HabitColorId, string> = {
  sage: "Шалфей",
  teal: "Ива",
  slate: "Сланец",
  olive: "Олива",
  clay: "Глина",
  rose: "Пион",
  sky: "Небо",
  ink: "Чернила",
};

export const WEEKDAY_SHORT = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"] as const;
export const WEEKDAY_JS = [1, 2, 3, 4, 5, 6, 0] as const;

export const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
export const WEEKDAYS = [1, 2, 3, 4, 5];
