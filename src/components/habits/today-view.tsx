import { Flame, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { CheckControl } from "@/components/habits/check-control";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HABIT_ICONS } from "@/lib/habits/icons";
import { quoteForDate, streakCopy, todayCopy } from "@/lib/habits/quotes";
import { currentStreak, dueOnDay, getValue, isDone, targetOf } from "@/lib/habits/stats";
import type { Checkins, Habit } from "@/lib/habits/types";
import { cn } from "@/lib/utils";

type TodayViewProps = {
  dateKey: string;
  habits: Habit[];
  checkins: Checkins;
  greeting: string;
  weekday: string;
  dayMonth: string;
  onToggle: (id: string) => void;
  onBump: (id: string, delta: number) => void;
  onOpen: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
  onCreate: () => void;
};

export function TodayView({
  dateKey,
  habits,
  checkins,
  greeting,
  weekday,
  dayMonth,
  onToggle,
  onBump,
  onOpen,
  onEdit,
  onDelete,
  onCreate,
}: TodayViewProps) {
  const due = dueOnDay(habits, dateKey);
  const doneCount = due.filter((h) => isDone(h, getValue(checkins, h.id, dateKey))).length;
  const quote = quoteForDate(dateKey);
  const streaks = due
    .map((h) => ({ habit: h, days: currentStreak(h, checkins, dateKey) }))
    .sort((a, b) => b.days - a.days);
  const longest = streaks[0];
  const motivation =
    todayCopy(doneCount, due.length) ??
    (longest ? streakCopy(longest.habit.name, longest.days) : null);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <p className="text-[0.8125rem] font-medium tracking-wide text-fg-muted uppercase">
          {greeting}
        </p>
        <p className="font-display text-lg italic text-fg-muted capitalize">{weekday}</p>
        <h1 className="font-display text-4xl leading-none font-medium tracking-[-0.03em] text-fg sm:text-5xl">
          {dayMonth}
        </h1>
        {due.length > 0 ? (
          <p className="mt-2 text-sm text-fg-muted tabular-nums">
            Сегодня {doneCount} из {due.length}
          </p>
        ) : null}
      </header>

      <blockquote className="rounded-xl bg-bg-elevated px-5 py-4 shadow-[var(--shadow-border)]">
        <p className="font-display text-lg leading-snug text-fg italic">{quote}</p>
        {motivation ? <p className="mt-2 text-sm text-fg-muted">{motivation}</p> : null}
      </blockquote>

      {due.length === 0 ? (
        <EmptyToday hasHabits={habits.length > 0} onCreate={onCreate} />
      ) : (
        <ul className="flex flex-col overflow-hidden rounded-xl bg-bg-elevated shadow-[var(--shadow-border)]">
          {due.map((habit, i) => {
            const value = getValue(checkins, habit.id, dateKey);
            const streak = currentStreak(habit, checkins, dateKey);
            return (
              <li
                key={habit.id}
                className={cn(i > 0 && "border-t border-border")}
              >
                <HabitRow
                  habit={habit}
                  value={value}
                  streak={streak}
                  onToggle={() => onToggle(habit.id)}
                  onBump={(d) => onBump(habit.id, d)}
                  onOpen={() => onOpen(habit)}
                  onEdit={() => onEdit(habit)}
                  onDelete={() => onDelete(habit)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function HabitRow({
  habit,
  value,
  streak,
  onToggle,
  onBump,
  onOpen,
  onEdit,
  onDelete,
}: {
  habit: Habit;
  value: number;
  streak: number;
  onToggle: () => void;
  onBump: (delta: number) => void;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const Icon = HABIT_ICONS[habit.icon];
  const done = isDone(habit, value);
  const target = targetOf(habit);

  return (
    <div
      data-habit={habit.color}
      className="flex items-center gap-3 px-3 py-3 sm:px-4"
    >
      <span className="h-10 w-1 shrink-0 rounded-full bg-(--habit)" aria-hidden />
      <CheckControl habit={habit} value={value} onToggle={onToggle} onBump={onBump} />
      <button
        type="button"
        onClick={onOpen}
        className="min-w-0 flex-1 py-1 text-left"
      >
        <span className="flex items-center gap-2">
          <Icon className="size-3.5 shrink-0 text-fg-subtle" />
          <span className={cn("truncate font-medium", done && "text-fg-muted")}>
            {habit.name}
          </span>
        </span>
        <span className="mt-0.5 block truncate text-[0.8125rem] text-fg-subtle">
          {habit.kind === "count" ? `${value} из ${target}` : habit.note || "Нажмите, чтобы открыть"}
        </span>
      </button>
      {streak > 0 ? (
        <span className="hidden items-center gap-1 text-[0.8125rem] font-medium text-fg-muted tabular-nums sm:inline-flex">
          <Flame className="size-3.5" />
          {streak}
        </span>
      ) : null}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={`Действия: ${habit.name}`}>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={onOpen}>Открыть сводку</DropdownMenuItem>
          <DropdownMenuItem onSelect={onEdit}>
            <Pencil className="size-4" />
            Изменить
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={onDelete}>
            <Trash2 className="size-4" />
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function EmptyToday({ hasHabits, onCreate }: { hasHabits: boolean; onCreate: () => void }) {
  return (
    <div className="rounded-xl bg-bg-elevated px-5 py-10 text-center shadow-[var(--shadow-border)]">
      <p className="font-display text-xl text-fg">
        {hasHabits ? "Сегодня по расписанию пусто" : "Пока нет привычек"}
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-fg-muted">
        {hasHabits
          ? "Можно отдохнуть или добавить привычку на этот день недели."
          : "Добавьте первую — и начните свой ритм. Отметки сохраняются на этом устройстве."}
      </p>
      <Button className="mt-5" onClick={onCreate}>
        Добавить привычку
      </Button>
    </div>
  );
}
