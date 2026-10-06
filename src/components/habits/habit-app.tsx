import { useEffect, useMemo, useState } from "react";
import { addMonths, addWeeks } from "date-fns";
import { BarChart3, CalendarDays, LayoutGrid, Plus, Sun } from "lucide-react";
import { Toaster, toast } from "sonner";
import { HabitDetail } from "@/components/habits/habit-detail";
import { HabitForm } from "@/components/habits/habit-form";
import { MonthView } from "@/components/habits/month-view";
import { StatsView } from "@/components/habits/stats-view";
import { TodayView } from "@/components/habits/today-view";
import { WeekView } from "@/components/habits/week-view";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  formatDayMonth,
  formatMonthYear,
  formatWeekRange,
  formatWeekday,
  hourGreeting,
  toDateKey,
  weekKeys,
} from "@/lib/habits/dates";
import { rehydrateHabits, useHabitStore } from "@/lib/habits/store";
import type { Habit, HabitDraft } from "@/lib/habits/types";
import { cn } from "@/lib/utils";

type Tab = "today" | "week" | "month" | "stats";

const TABS: { id: Tab; label: string; icon: typeof Sun }[] = [
  { id: "today", label: "Сегодня", icon: Sun },
  { id: "week", label: "Неделя", icon: LayoutGrid },
  { id: "month", label: "Месяц", icon: CalendarDays },
  { id: "stats", label: "Сводка", icon: BarChart3 },
];

export function HabitApp() {
  const [tab, setTab] = useState<Tab>("today");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);
  const [detail, setDetail] = useState<Habit | null>(null);
  const [deleting, setDeleting] = useState<Habit | null>(null);
  const [weekAnchor, setWeekAnchor] = useState(() => new Date());
  const [monthAnchor, setMonthAnchor] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState(() => toDateKey());

  const habits = useHabitStore((s) => s.habits);
  const checkins = useHabitStore((s) => s.checkins);
  const addHabit = useHabitStore((s) => s.addHabit);
  const updateHabit = useHabitStore((s) => s.updateHabit);
  const deleteHabit = useHabitStore((s) => s.deleteHabit);
  const toggleCheckin = useHabitStore((s) => s.toggleCheckin);
  const bumpCheckin = useHabitStore((s) => s.bumpCheckin);

  useEffect(() => {
    void rehydrateHabits();
  }, []);

  const today = useMemo(() => new Date(), []);
  const todayKey = toDateKey(today);
  const week = weekKeys(weekAnchor);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(habit: Habit) {
    setDetail(null);
    setEditing(habit);
    setFormOpen(true);
  }

  function openDetail(habit: Habit) {
    setDetail(habit);
  }

  function confirmDelete(habit: Habit) {
    setDetail(null);
    setDeleting(habit);
  }

  function handleSubmit(draft: HabitDraft) {
    if (editing) {
      updateHabit(editing.id, draft);
      toast("Привычка обновлена");
      setEditing(null);
    } else {
      addHabit(draft);
      toast("Привычка добавлена");
    }
  }

  function handleDelete() {
    if (!deleting) return;
    deleteHabit(deleting.id);
    toast("Привычка удалена");
    setDeleting(null);
  }

  return (
    <div className="flex min-h-dvh flex-col">
        <header className="sticky top-0 z-30 border-b border-border/80 bg-bg/90 backdrop-blur-sm">
          <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-3 px-4">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-xl font-medium tracking-tight">Ритм</span>
              <span className="hidden text-[0.75rem] text-fg-subtle sm:inline">трекер привычек</span>
            </div>
            <nav className="hidden items-center gap-0.5 md:flex" aria-label="Разделы">
              {TABS.map((item) => (
                <TabButton
                  key={item.id}
                  tab={item}
                  active={tab === item.id}
                  onClick={() => setTab(item.id)}
                />
              ))}
            </nav>
            <Button size="sm" onClick={openCreate} className="shrink-0">
              <Plus className="size-4" />
              <span className="hidden sm:inline">Привычка</span>
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 pb-28 md:pb-10">
          {tab === "today" ? (
            <TodayView
              dateKey={todayKey}
              habits={habits}
              checkins={checkins}
              greeting={hourGreeting(today)}
              weekday={formatWeekday(today)}
              dayMonth={formatDayMonth(today)}
              onToggle={(id) => toggleCheckin(id, todayKey)}
              onBump={(id, d) => bumpCheckin(id, todayKey, d)}
              onOpen={openDetail}
              onEdit={openEdit}
              onDelete={confirmDelete}
              onCreate={openCreate}
            />
          ) : tab === "week" ? (
            <WeekView
              keys={week}
              label={formatWeekRange(weekAnchor)}
              todayKey={todayKey}
              habits={habits}
              checkins={checkins}
              onPrev={() => setWeekAnchor((d) => addWeeks(d, -1))}
              onNext={() => setWeekAnchor((d) => addWeeks(d, 1))}
              onToggle={toggleCheckin}
              onOpen={openDetail}
            />
          ) : tab === "month" ? (
            <MonthView
              month={monthAnchor}
              todayKey={todayKey}
              selectedKey={selectedDay}
              habits={habits}
              checkins={checkins}
              label={formatMonthYear(monthAnchor)}
              onPrev={() => setMonthAnchor((d) => addMonths(d, -1))}
              onNext={() => setMonthAnchor((d) => addMonths(d, 1))}
              onSelect={setSelectedDay}
              onToggle={toggleCheckin}
              onBump={bumpCheckin}
            />
          ) : (
            <StatsView
              habits={habits}
              checkins={checkins}
              todayKey={todayKey}
              today={today}
              onOpen={openDetail}
              onCreate={openCreate}
            />
          )}
        </main>

        <nav
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-sm md:hidden"
          aria-label="Разделы"
        >
          <div className="mx-auto grid max-w-3xl grid-cols-4">
            {TABS.map((item) => (
              <TabButton
                key={item.id}
                tab={item}
                active={tab === item.id}
                onClick={() => setTab(item.id)}
                stacked
              />
            ))}
          </div>
        </nav>

        <HabitForm
          open={formOpen}
          onOpenChange={setFormOpen}
          habit={editing}
          onSubmit={handleSubmit}
        />
        <HabitDetail
          habit={detail}
          checkins={checkins}
          todayKey={todayKey}
          today={today}
          open={Boolean(detail)}
          onOpenChange={(open) => {
            if (!open) setDetail(null);
          }}
          onEdit={() => detail && openEdit(detail)}
          onDelete={() => detail && confirmDelete(detail)}
        />
        <AlertDialog open={Boolean(deleting)} onOpenChange={(o) => !o && setDeleting(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить «{deleting?.name}»?</AlertDialogTitle>
              <AlertDialogDescription>
                Привычка и все её отметки исчезнут с этого устройства. Это нельзя отменить.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-fg hover:bg-destructive/90"
                onClick={handleDelete}
              >
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              toast:
                "bg-bg-elevated text-fg border-0 shadow-[var(--shadow-border)] font-sans",
            },
          }}
        />
      </div>
  );
}

function TabButton({
  tab,
  active,
  onClick,
  stacked = false,
}: {
  tab: (typeof TABS)[number];
  active: boolean;
  onClick: () => void;
  stacked?: boolean;
}) {
  const Icon = tab.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md text-[0.8125rem] font-medium transition-colors",
        stacked ? "min-h-12 flex-col gap-0.5 px-1 py-1.5" : "h-9 px-2.5",
        active ? "text-fg" : "text-fg-muted hover:text-fg",
      )}
    >
      <Icon className={cn("size-4", active && "text-accent")} />
      {tab.label}
    </button>
  );
}
