import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HABIT_ICONS, HABIT_ICON_LABELS } from "@/lib/habits/icons";
import {
  ALL_DAYS,
  HABIT_COLOR_IDS,
  HABIT_COLOR_LABELS,
  HABIT_ICON_IDS,
  WEEKDAY_JS,
  WEEKDAY_SHORT,
  WEEKDAYS,
  type Habit,
  type HabitColorId,
  type HabitDraft,
  type HabitIconId,
  type HabitKind,
} from "@/lib/habits/types";
import { cn } from "@/lib/utils";

const EMPTY: HabitDraft = {
  name: "",
  note: "",
  color: "sage",
  icon: "leaf",
  days: ALL_DAYS,
  kind: "boolean",
  target: 1,
};

function sameDays(a: number[], b: number[]) {
  const as = [...a].sort().join(",");
  const bs = [...b].sort().join(",");
  return as === bs;
}

type HabitFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit?: Habit | null;
  onSubmit: (draft: HabitDraft) => void;
};

export function HabitForm({ open, onOpenChange, habit, onSubmit }: HabitFormProps) {
  const [draft, setDraft] = useState<HabitDraft>(EMPTY);

  useEffect(() => {
    if (!open) return;
    if (habit) {
      setDraft({
        name: habit.name,
        note: habit.note,
        color: habit.color,
        icon: habit.icon,
        days: [...habit.days],
        kind: habit.kind,
        target: habit.target,
      });
    } else {
      setDraft(EMPTY);
    }
  }, [open, habit]);

  const schedule: "daily" | "weekdays" | "custom" = sameDays(draft.days, ALL_DAYS)
    ? "daily"
    : sameDays(draft.days, WEEKDAYS)
      ? "weekdays"
      : "custom";

  function toggleDay(day: number) {
    setDraft((d) => {
      const has = d.days.includes(day);
      const days = has ? d.days.filter((x) => x !== day) : [...d.days, day];
      return { ...d, days: days.length ? days : [day] };
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!draft.name.trim()) return;
    onSubmit(draft);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(92dvh,720px)] overflow-y-auto">
        <form onSubmit={handleSubmit} className="grid gap-5">
          <DialogHeader>
            <DialogTitle>{habit ? "Редактировать привычку" : "Новая привычка"}</DialogTitle>
            <DialogDescription>
              Цвет и расписание помогают видеть ритм на календаре.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <Label htmlFor="habit-name">Название</Label>
            <Input
              id="habit-name"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="Например, чтение"
              maxLength={48}
              required
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="habit-note">Заметка</Label>
            <Textarea
              id="habit-note"
              value={draft.note}
              onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))}
              placeholder="Короткое напоминание себе"
              maxLength={120}
              rows={2}
            />
          </div>

          <div className="grid gap-2">
            <Label>Цвет</Label>
            <div className="flex flex-wrap gap-2">
              {HABIT_COLOR_IDS.map((id) => (
                <ColorSwatch
                  key={id}
                  id={id}
                  selected={draft.color === id}
                  onSelect={() => setDraft((d) => ({ ...d, color: id }))}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Значок</Label>
            <div className="flex flex-wrap gap-1.5">
              {HABIT_ICON_IDS.map((id) => {
                const Icon = HABIT_ICONS[id];
                const selected = draft.icon === id;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-label={HABIT_ICON_LABELS[id]}
                    aria-pressed={selected}
                    onClick={() => setDraft((d) => ({ ...d, icon: id as HabitIconId }))}
                    className={cn(
                      "inline-flex size-10 items-center justify-center rounded-sm transition-colors",
                      selected
                        ? "bg-accent text-accent-fg"
                        : "bg-bg-subtle text-fg-muted hover:text-fg",
                    )}
                  >
                    <Icon className="size-4" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Расписание</Label>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ["daily", "Каждый день"],
                  ["weekdays", "Будни"],
                  ["custom", "Свои дни"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={schedule === id}
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      days: id === "daily" ? ALL_DAYS : id === "weekdays" ? WEEKDAYS : d.days,
                    }))
                  }
                  className={cn(
                    "h-9 rounded-full px-3 text-[0.8125rem] font-medium transition-colors",
                    schedule === id
                      ? "bg-accent text-accent-fg"
                      : "bg-bg-subtle text-fg-muted hover:text-fg",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {WEEKDAY_JS.map((day, i) => {
                const on = draft.days.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleDay(day)}
                    className={cn(
                      "size-9 rounded-full text-[0.75rem] font-medium uppercase transition-colors",
                      on ? "bg-fg text-bg-elevated" : "bg-bg-subtle text-fg-muted hover:text-fg",
                    )}
                  >
                    {WEEKDAY_SHORT[i]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Тип отметки</Label>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ["boolean", "Да / нет"],
                  ["count", "Счётчик"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={draft.kind === id}
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      kind: id as HabitKind,
                      target: id === "count" ? Math.max(d.target, 2) : 1,
                    }))
                  }
                  className={cn(
                    "h-9 rounded-full px-3 text-[0.8125rem] font-medium transition-colors",
                    draft.kind === id
                      ? "bg-accent text-accent-fg"
                      : "bg-bg-subtle text-fg-muted hover:text-fg",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            {draft.kind === "count" ? (
              <div className="flex items-center gap-3 pt-1">
                <Label htmlFor="habit-target" className="shrink-0">
                  Цель в день
                </Label>
                <Input
                  id="habit-target"
                  type="number"
                  min={2}
                  max={20}
                  value={draft.target}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, target: Number(e.target.value) }))
                  }
                  className="w-24"
                />
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={!draft.name.trim()}>
              {habit ? "Сохранить" : "Добавить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ColorSwatch({
  id,
  selected,
  onSelect,
}: {
  id: HabitColorId;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={HABIT_COLOR_LABELS[id]}
      aria-pressed={selected}
      data-habit={id}
      onClick={onSelect}
      className={cn(
        "size-9 rounded-full bg-(--habit) transition-transform",
        selected && "ring-2 ring-fg ring-offset-2 ring-offset-bg-elevated",
      )}
    />
  );
}
