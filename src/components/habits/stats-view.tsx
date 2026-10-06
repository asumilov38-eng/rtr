import { addDays } from "date-fns";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { HabitHeatmap } from "@/components/habits/heatmap";
import { Button } from "@/components/ui/button";
import { toDateKey } from "@/lib/habits/dates";
import {
  bestStreak,
  completionRate,
  completionsInRange,
  currentStreak,
  dueDaysBetween,
  weeklyRates,
} from "@/lib/habits/stats";
import type { Checkins, Habit } from "@/lib/habits/types";

type StatsViewProps = {
  habits: Habit[];
  checkins: Checkins;
  todayKey: string;
  today: Date;
  onOpen: (habit: Habit) => void;
  onCreate: () => void;
};

export function StatsView({
  habits,
  checkins,
  todayKey,
  today,
  onOpen,
  onCreate,
}: StatsViewProps) {
  const weekStart = toDateKey(addDays(today, -((today.getDay() + 6) % 7)));
  const monthStart = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
  const points = weeklyRates(habits, checkins, today, 8);

  let weekDue = 0;
  let weekDone = 0;
  let monthDue = 0;
  let monthDone = 0;
  let best = 0;
  let totalDone = 0;

  for (const habit of habits) {
    const weekDays = dueDaysBetween(habit, weekStart, todayKey);
    const monthDays = dueDaysBetween(habit, monthStart, todayKey);
    weekDue += weekDays.length;
    weekDone += completionsInRange(habit, checkins, weekStart, todayKey);
    monthDue += monthDays.length;
    monthDone += completionsInRange(habit, checkins, monthStart, todayKey);
    best = Math.max(best, bestStreak(habit, checkins, todayKey));
    totalDone += completionsInRange(habit, checkins, toDateKey(new Date(habit.createdAt)), todayKey);
  }

  const weekPct = weekDue ? Math.round((weekDone / weekDue) * 100) : 0;
  const monthPct = monthDue ? Math.round((monthDone / monthDue) * 100) : 0;

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="text-[0.8125rem] font-medium tracking-wide text-fg-muted uppercase">
          Сводка
        </p>
        <h1 className="font-display text-3xl leading-tight font-medium tracking-[-0.03em]">
          Как держится ритм
        </h1>
      </header>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatCard label="Эта неделя" value={`${weekPct}%`} hint={`${weekDone} из ${weekDue}`} />
        <StatCard label="Этот месяц" value={`${monthPct}%`} hint={`${monthDone} из ${monthDue}`} />
        <StatCard label="Лучшая серия" value={`${best}`} hint="дней подряд" />
        <StatCard label="Всего отметок" value={`${totalDone}`} hint="за всё время" />
      </div>

      <section className="rounded-xl bg-bg-elevated p-4 shadow-[var(--shadow-border)] sm:p-5">
        <h2 className="text-sm font-medium text-fg-muted">Восемь недель</h2>
        <div className="mt-3 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={points} barCategoryGap="28%">
              <XAxis
                dataKey="label"
                tick={{ fill: "var(--color-fg-subtle)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 50, 100]}
                tick={{ fill: "var(--color-fg-subtle)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <RechartsTooltip
                cursor={{ fill: "var(--color-bg-subtle)" }}
                content={({ payload, label }) => {
                  const row = payload?.[0]?.payload as
                    | { rate: number; done: number; due: number }
                    | undefined;
                  if (!row) return null;
                  return (
                    <div className="rounded-sm bg-fg px-2.5 py-1.5 text-xs text-bg-elevated">
                      Неделя {label}: {row.rate}% ({row.done}/{row.due})
                    </div>
                  );
                }}
              />
              <Bar dataKey="rate" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {habits.length === 0 ? (
        <div className="rounded-xl bg-bg-elevated px-5 py-10 text-center shadow-[var(--shadow-border)]">
          <p className="font-display text-xl">Пока нечего считать</p>
          <p className="mt-2 text-sm text-fg-muted">Добавьте привычку — сводка заполнится сама.</p>
          <Button className="mt-5" onClick={onCreate}>
            Добавить привычку
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {habits.map((habit) => (
            <li key={habit.id}>
              <HabitStatCard
                habit={habit}
                checkins={checkins}
                todayKey={todayKey}
                weekStart={weekStart}
                monthStart={monthStart}
                onOpen={() => onOpen(habit)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl bg-bg-elevated px-3.5 py-3 shadow-[var(--shadow-border)] sm:px-4 sm:py-4">
      <p className="text-[0.75rem] font-medium text-fg-muted">{label}</p>
      <p className="mt-1 font-display text-2xl leading-none font-medium tabular-nums sm:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-[0.75rem] text-fg-subtle tabular-nums">{hint}</p>
    </div>
  );
}

function HabitStatCard({
  habit,
  checkins,
  todayKey,
  weekStart,
  monthStart,
  onOpen,
}: {
  habit: Habit;
  checkins: Checkins;
  todayKey: string;
  weekStart: string;
  monthStart: string;
  onOpen: () => void;
}) {
  const streak = currentStreak(habit, checkins, todayKey);
  const best = bestStreak(habit, checkins, todayKey);
  const week = Math.round(completionRate(habit, checkins, weekStart, todayKey) * 100);
  const month = Math.round(completionRate(habit, checkins, monthStart, todayKey) * 100);

  return (
    <button
      type="button"
      onClick={onOpen}
      data-habit={habit.color}
      className="flex w-full flex-col gap-3 rounded-xl bg-bg-elevated p-4 text-left shadow-[var(--shadow-border)] transition-shadow hover:shadow-[var(--shadow-border-hover)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="mb-1 block h-1 w-8 rounded-full bg-(--habit)" />
          <h3 className="truncate font-medium">{habit.name}</h3>
          {habit.note ? (
            <p className="truncate text-[0.8125rem] text-fg-subtle">{habit.note}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 gap-3 text-right text-[0.75rem] text-fg-muted tabular-nums">
          <span>
            серия
            <strong className="ml-1 font-medium text-fg">{streak}</strong>
          </span>
          <span>
            лучшая
            <strong className="ml-1 font-medium text-fg">{best}</strong>
          </span>
        </div>
      </div>
      <HabitHeatmap habit={habit} checkins={checkins} todayKey={todayKey} weeks={16} />
      <p className="text-[0.75rem] text-fg-subtle tabular-nums">
        Неделя {week}% · месяц {month}%
      </p>
    </button>
  );
}
