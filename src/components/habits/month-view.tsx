import { ChevronLeft, ChevronRight } from "lucide-react";
import { CheckControl } from "@/components/habits/check-control";
import { Button } from "@/components/ui/button";
import { monthGrid, parseDateKey } from "@/lib/habits/dates";
import { dayCompletion, dueOnDay, getValue, isDone } from "@/lib/habits/stats";
import type { Checkins, Habit } from "@/lib/habits/types";
import { WEEKDAY_SHORT } from "@/lib/habits/types";
import { cn } from "@/lib/utils";

type MonthViewProps = {
  month: Date;
  todayKey: string;
  selectedKey: string;
  habits: Habit[];
  checkins: Checkins;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (dateKey: string) => void;
  onToggle: (habitId: string, dateKey: string) => void;
  onBump: (habitId: string, dateKey: string, delta: number) => void;
  label: string;
};

export function MonthView({
  month,
  todayKey,
  selectedKey,
  habits,
  checkins,
  onPrev,
  onNext,
  onSelect,
  onToggle,
  onBump,
  label,
}: MonthViewProps) {
  const cells = monthGrid(month);
  const selectedDue = dueOnDay(habits, selectedKey);
  const selectedDate = parseDateKey(selectedKey);
  const future = selectedKey > todayKey;

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[0.8125rem] font-medium tracking-wide text-fg-muted uppercase">
            Месяц
          </p>
          <h1 className="font-display text-3xl leading-tight font-medium tracking-[-0.03em] capitalize">
            {label}
          </h1>
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="icon-sm" onClick={onPrev} aria-label="Предыдущий месяц">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="icon-sm" onClick={onNext} aria-label="Следующий месяц">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </header>

      <div className="overflow-hidden rounded-xl bg-bg-elevated p-3 shadow-[var(--shadow-border)] sm:p-4">
        <div className="grid grid-cols-7 gap-1 pb-2 text-center text-[0.6875rem] font-medium uppercase text-fg-subtle">
          {WEEKDAY_SHORT.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((key, i) => {
            if (!key) return <div key={`e-${i}`} className="aspect-square" />;
            const { due, done } = dayCompletion(habits, checkins, key);
            const isToday = key === todayKey;
            const isSelected = key === selectedKey;
            const ratio = due === 0 ? 0 : done / due;
            const dots = habits
              .filter((h) => isDone(h, getValue(checkins, h.id, key)))
              .slice(0, 4);
            const isFuture = key > todayKey;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelect(key)}
                aria-current={isToday ? "date" : undefined}
                aria-pressed={isSelected}
                className={cn(
                  "flex aspect-square flex-col items-center justify-between rounded-md px-0.5 py-1 text-[0.8125rem] tabular-nums transition-colors",
                  isSelected ? "bg-fg text-bg-elevated" : "hover:bg-bg-subtle",
                  isToday && !isSelected && "ring-1 ring-accent",
                  isFuture && "text-fg-subtle",
                )}
              >
                <span className="leading-none">{parseDateKey(key).getDate()}</span>
                <span className="flex h-2.5 items-center justify-center gap-0.5">
                  {due === 0 || isFuture ? null : dots.length > 0 ? (
                    dots.map((h) => (
                      <span
                        key={h.id}
                        data-habit={h.color}
                        className={cn(
                          "size-1.5 rounded-full bg-(--habit)",
                          isSelected && "ring-1 ring-bg-elevated",
                        )}
                      />
                    ))
                  ) : (
                    <span
                      className={cn(
                        "size-1 rounded-full",
                        isSelected ? "bg-bg-elevated/40" : "bg-border-strong",
                      )}
                    />
                  )}
                </span>
                <span className="sr-only">
                  {done} из {due}, заполнение {Math.round(ratio * 100)}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <section className="rounded-xl bg-bg-elevated p-4 shadow-[var(--shadow-border)]">
        <h2 className="font-display text-xl font-medium capitalize">
          {selectedDate.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })}
        </h2>
        {future ? (
          <p className="mt-2 text-sm text-fg-muted">Этот день ещё не наступил.</p>
        ) : selectedDue.length === 0 ? (
          <p className="mt-2 text-sm text-fg-muted">В этот день привычек нет.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-1">
            {selectedDue.map((habit) => {
              const value = getValue(checkins, habit.id, selectedKey);
              return (
                <li
                  key={habit.id}
                  className="flex items-center justify-between gap-3 rounded-md px-1 py-1.5"
                >
                  <span className="min-w-0 truncate text-sm font-medium">{habit.name}</span>
                  <CheckControl
                    habit={habit}
                    value={value}
                    onToggle={() => onToggle(habit.id, selectedKey)}
                    onBump={(d) => onBump(habit.id, selectedKey, d)}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
