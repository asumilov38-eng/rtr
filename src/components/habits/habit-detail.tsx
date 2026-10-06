import { addDays } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { HabitHeatmap } from "@/components/habits/heatmap";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HABIT_ICONS } from "@/lib/habits/icons";
import { toDateKey } from "@/lib/habits/dates";
import { streakCopy } from "@/lib/habits/quotes";
import {
  bestStreak,
  completionRate,
  completionsInRange,
  currentStreak,
  dueDaysBetween,
} from "@/lib/habits/stats";
import type { Checkins, Habit } from "@/lib/habits/types";
import { WEEKDAY_JS, WEEKDAY_SHORT } from "@/lib/habits/types";

type HabitDetailProps = {
  habit: Habit | null;
  checkins: Checkins;
  todayKey: string;
  today: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function HabitDetail({
  habit,
  checkins,
  todayKey,
  today,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: HabitDetailProps) {
  if (!habit) return null;
  const Icon = HABIT_ICONS[habit.icon];
  const weekStart = toDateKey(addDays(today, -((today.getDay() + 6) % 7)));
  const monthStart = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
  const created = toDateKey(new Date(habit.createdAt));
  const streak = currentStreak(habit, checkins, todayKey);
  const best = bestStreak(habit, checkins, todayKey);
  const week = Math.round(completionRate(habit, checkins, weekStart, todayKey) * 100);
  const month = Math.round(completionRate(habit, checkins, monthStart, todayKey) * 100);
  const allDue = dueDaysBetween(habit, created, todayKey).length;
  const allDone = completionsInRange(habit, checkins, created, todayKey);
  const allPct = allDue ? Math.round((allDone / allDue) * 100) : 0;
  const encourage = streakCopy(habit.name, streak);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(92dvh,760px)] overflow-y-auto" data-habit={habit.color}>
        <DialogHeader>
          <div className="flex items-center gap-2 text-fg-muted">
            <Icon className="size-4" />
            <span className="h-1.5 w-1.5 rounded-full bg-(--habit)" />
          </div>
          <DialogTitle>{habit.name}</DialogTitle>
          <DialogDescription>{habit.note || "Статистика привычки"}</DialogDescription>
        </DialogHeader>

        {encourage ? (
          <p className="font-display text-base italic text-fg">{encourage}</p>
        ) : null}

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <MiniStat label="Серия" value={String(streak)} />
          <MiniStat label="Рекорд" value={String(best)} />
          <MiniStat label="Неделя" value={`${week}%`} />
          <MiniStat label="Месяц" value={`${month}%`} />
        </div>

        <div>
          <p className="mb-2 text-[0.75rem] font-medium text-fg-muted">Шестнадцать недель</p>
          <HabitHeatmap habit={habit} checkins={checkins} todayKey={todayKey} weeks={16} />
        </div>

        <p className="text-sm text-fg-muted tabular-nums">
          Всего {allDone} из {allDue} дней по расписанию · {allPct}%
        </p>

        <div className="flex flex-wrap gap-1">
          {WEEKDAY_JS.map((day, i) => (
            <span
              key={day}
              className={
                habit.days.includes(day)
                  ? "rounded-full bg-fg px-2 py-1 text-[0.6875rem] font-medium text-bg-elevated uppercase"
                  : "rounded-full bg-bg-subtle px-2 py-1 text-[0.6875rem] font-medium text-fg-subtle uppercase"
              }
            >
              {WEEKDAY_SHORT[i]}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onEdit}>
            <Pencil className="size-4" />
            Изменить
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="size-4" />
            Удалить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-bg-subtle px-3 py-2.5">
      <p className="text-[0.6875rem] font-medium text-fg-muted">{label}</p>
      <p className="font-display text-xl font-medium tabular-nums">{value}</p>
    </div>
  );
}
