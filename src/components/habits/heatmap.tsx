import { format } from "date-fns";
import { ru } from "date-fns/locale";
import type { Checkins, Habit } from "@/lib/habits/types";
import { parseDateKey } from "@/lib/habits/dates";
import { heatmapWeeks, targetOf } from "@/lib/habits/stats";
import { cn } from "@/lib/utils";

export function HabitHeatmap({
  habit,
  checkins,
  todayKey,
  weeks = 16,
}: {
  habit: Habit;
  checkins: Checkins;
  todayKey: string;
  weeks?: number;
}) {
  const columns = heatmapWeeks(habit, checkins, todayKey, weeks);
  const target = targetOf(habit);

  return (
    <div data-habit={habit.color} className="flex gap-2">
      <div className="flex flex-col justify-between py-0.5 text-[0.625rem] leading-none text-fg-subtle">
        <span>пн</span>
        <span>ср</span>
        <span>вс</span>
      </div>
      <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
        {columns.map((col, i) => (
          <div key={i} className="flex flex-col gap-1">
            {col.map((cell) => {
              const date = parseDateKey(cell.dateKey);
              const label = format(date, "d MMMM", { locale: ru });
              const intensity =
                !cell.due || cell.future
                  ? 0
                  : cell.done
                    ? 1
                    : cell.value > 0
                      ? Math.max(0.35, cell.value / target)
                      : 0;
              const status = cell.future
                ? "ещё не наступил"
                : !cell.due
                  ? "не по расписанию"
                  : cell.done
                    ? "выполнено"
                    : cell.value > 0
                      ? `${cell.value} из ${target}`
                      : "пропуск";
              return (
                <span
                  key={cell.dateKey}
                  title={`${label} — ${status}`}
                  className={cn(
                    "block size-2.5 rounded-2xs sm:size-3",
                    cell.future
                      ? "bg-transparent"
                      : intensity === 0
                        ? "bg-bg-subtle"
                        : "bg-(--habit)",
                  )}
                  style={
                    intensity > 0 && intensity < 1
                      ? { opacity: intensity }
                      : undefined
                  }
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
