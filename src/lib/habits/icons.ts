import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Brain,
  Coffee,
  Droplets,
  Dumbbell,
  Footprints,
  Heart,
  Leaf,
  Moon,
  Music,
  PenLine,
  Sun,
} from "lucide-react";
import type { HabitIconId } from "./types";

export const HABIT_ICONS: Record<HabitIconId, LucideIcon> = {
  leaf: Leaf,
  book: BookOpen,
  dumbbell: Dumbbell,
  droplet: Droplets,
  brain: Brain,
  moon: Moon,
  sun: Sun,
  heart: Heart,
  coffee: Coffee,
  footprints: Footprints,
  pen: PenLine,
  music: Music,
};

export const HABIT_ICON_LABELS: Record<HabitIconId, string> = {
  leaf: "Лист",
  book: "Книга",
  dumbbell: "Зарядка",
  droplet: "Вода",
  brain: "Фокус",
  moon: "Сон",
  sun: "Утро",
  heart: "Забота",
  coffee: "Ритуал",
  footprints: "Шаги",
  pen: "Запись",
  music: "Музыка",
};
