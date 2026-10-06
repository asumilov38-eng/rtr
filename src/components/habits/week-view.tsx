import { ChevronLeft, ChevronRight } from "lucide-react";
import { CheckControl } from "@/components/habits/check-control";
import { Button } from "@/components/ui/button";
import { HABIT_ICONS } from "@/lib/habits/icons";
import { parseDateKey } from "@/lib/habits/dates";
import { getValue, isDueOn } from "@/lib/habits/stats";
import type { Checkins, Habit } from "@/lib/habits/types";
import { WEEKDAY_SHORT } from "@/lib/habits/types";
import { cn } from "@/lib/utils";

type WeekViewProps = {
  keys: string[];
  label: string;
  todayKey: string;
  habits: Habit[];
  checkins: Checkins;
  onPrev: () => void;
  onNext: () => void;
  onToggle: (habitId: string, dateKey: string) => void;
  onOpen: (habit: Habit) => void;
};

export function WeekView({
  keys,
  label,
  todayKey,
  habits,
  checkins,
  onPrev,
  onNext,
  onToggle,
  onOpen,
}: WeekViewProps) {
  const dueThisWeek = habits.filter((h) => keys.some((k) => isDueOn(h, k)));

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[0.8125rem] font-medium tracking-wide text-fg-muted uppercase">
            Неделя
          </p>
          <h1 className="font-display text-3xl leading-tight font-medium tracking-[-0.03em]">
            {label}
          </h1>
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="icon-sm" onClick={onPrev} aria-label="Предыдущая неделя">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="icon-sm" onClick={onNext} aria-label="Следующая неделя">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </header>

      {dueThisWeek.length === 0 ? (
        <p className="rounded-xl bg-bg-elevated px-5 py-8 text-center text-sm text-fg-muted shadow-[var(--shadow-border)]">
          На эту неделю привычек нет.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl bg-bg-elevated shadow-[var(--shadow-border)]">
          <div className="grid grid-cols-[minmax(4.5rem,1fr)_repeat(7,minmax(2.25rem,1fr))] gap-x-1 px-2 py-2 text-center text-[0.6875rem] font-medium uppercase text-fg-subtle sm:px-3">
            <span className="text-left"> </span>
            {keys.map((key, i) => {
              const isToday = key === todayKey;
              const dayNum = parseDateKey(key).getDate();
              return (
                <span
                  key={key}
                  className={cn(
                    "flex flex-col items-center gap-0.5 tabular-nums",
                    isToday && "text-accent",
                  )}
                >
                  {WEEKDAY_SHORT[i]}
                  <span className={cn(isToday && "font-semibold text-fg")}>{dayNum}</span>
                </span>
              );
            })}
          </div>
          <ul>
            {dueThisWeek.map((habit) => {
              const Icon = HABIT_ICONS[habit.icon];
              return (
                <li
                  key={habit.id}
                  data-habit={habit.color}
                  className="grid grid-cols-[minmax(4.5rem,1fr)_repeat(7,minmax(2.25rem,1fr))] items-center gap-x-1 border-t border-border px-2 py-2 sm:px-3"
                >
                  <button
                    type="button"
                    onClick={() => onOpen(habit)}
                    className="flex min-w-0 items-center gap-2 py-1 text-left"
                  >
                    <span className="hidden size-2 shrink-0 rounded-full bg-(--habit) sm:block" />
                    <Icon className="hidden size-3.5 shrink-0 text-fg-subtle sm:block" />
                    <span className="truncate text-[0.8125rem] font-medium">{habit.name}</span>
                  </button>
                  {keys.map((key) => {
                    const due = isDueOn(habit, key);
                    const value = getValue(checkins, habit.id, key);
                    const future = key > todayKey;
                    if (!due) {
                      return (
                        <div key={key} className="flex justify-center">
                          <span className="size-1.5 rounded-full bg-border" />
                        </div>
                      );
                    }
                    return (
                      <div key={key} className="flex justify-center">
                        <CheckControl
                          habit={habit}
                          value={value}
                          compact
                          disabled={future}
                          onToggle={() => {
                            if (!future) onToggle(habit.id, key);
                          }}
                        />
                      </div>
                    );
                  })}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
