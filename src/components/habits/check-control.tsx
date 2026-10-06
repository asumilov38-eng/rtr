import { Check, Minus, Plus } from "lucide-react";
import type { Habit } from "@/lib/habits/types";
import { isDone, targetOf } from "@/lib/habits/stats";
import { cn } from "@/lib/utils";

type CheckControlProps = {
  habit: Habit;
  value: number;
  onToggle: () => void;
  onBump?: (delta: number) => void;
  compact?: boolean;
  disabled?: boolean;
};

export function CheckControl({
  habit,
  value,
  onToggle,
  onBump,
  compact = false,
  disabled = false,
}: CheckControlProps) {
  const target = targetOf(habit);
  const done = isDone(habit, value);
  const progress = Math.min(1, value / target);
  const size = compact ? 36 : 44;
  const r = compact ? 13 : 16;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - progress);

  return (
    <div className="flex items-center gap-1" data-habit={habit.color}>
      {habit.kind === "count" && onBump && !compact ? (
        <button
          type="button"
          aria-label="Меньше"
          disabled={disabled || value <= 0}
          onClick={() => onBump(-1)}
          className="inline-flex size-9 items-center justify-center rounded-sm text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg disabled:opacity-30"
        >
          <Minus className="size-3.5" />
        </button>
      ) : null}

      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        aria-pressed={done}
        aria-label={done ? `Снять отметку: ${habit.name}` : `Отметить: ${habit.name}`}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full transition-[transform,background-color,opacity] duration-[var(--motion-quick)] ease-[var(--ease-out)] active:scale-[0.96] disabled:pointer-events-none disabled:opacity-40",
          compact ? "size-9" : "size-11",
        )}
      >
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0 size-full -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--color-border-strong)"
            strokeWidth="2.25"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill={done ? "var(--habit)" : "transparent"}
            stroke="var(--habit)"
            strokeWidth="2.25"
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset,fill] duration-[var(--motion-fast)] ease-[var(--ease-smooth-out)]"
          />
        </svg>
        {done ? (
          <Check
            className={cn("relative text-accent-fg", compact ? "size-3.5" : "size-4")}
            strokeWidth={2.5}
          />
        ) : habit.kind === "count" ? (
          <span className="relative font-medium text-[0.6875rem] tabular-nums text-fg">
            {value}
          </span>
        ) : null}
      </button>

      {habit.kind === "count" && onBump && !compact ? (
        <button
          type="button"
          aria-label="Больше"
          disabled={disabled || value >= target}
          onClick={() => onBump(1)}
          className="inline-flex size-9 items-center justify-center rounded-sm text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg disabled:opacity-30"
        >
          <Plus className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}
