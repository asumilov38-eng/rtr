import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Checkins, Habit, HabitDraft } from "./types";
import { ALL_DAYS } from "./types";
import { checkinKey } from "./dates";
import { createDemoData } from "./seed";
import { getValue, targetOf } from "./stats";

type HabitState = {
  habits: Habit[];
  checkins: Checkins;
  seeded: boolean;
  addHabit: (draft: HabitDraft) => string;
  updateHabit: (id: string, draft: HabitDraft) => void;
  deleteHabit: (id: string) => void;
  setCheckin: (habitId: string, dateKey: string, value: number) => void;
  toggleCheckin: (habitId: string, dateKey: string) => void;
  bumpCheckin: (habitId: string, dateKey: string, delta: number) => void;
};

function normalizeDraft(draft: HabitDraft): HabitDraft {
  const days = [...new Set(draft.days)].filter((d) => d >= 0 && d <= 6).sort();
  return {
    ...draft,
    name: draft.name.trim().slice(0, 48),
    note: draft.note.trim().slice(0, 120),
    days: days.length ? days : ALL_DAYS,
    target: Math.min(20, Math.max(1, Math.round(draft.target) || 1)),
  };
}

const demo = createDemoData();

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: demo.habits,
      checkins: demo.checkins,
      seeded: false,
      addHabit: (draft) => {
        const id = crypto.randomUUID();
        const habit: Habit = {
          ...normalizeDraft(draft),
          id,
          createdAt: Date.now(),
        };
        set((s) => ({ habits: [...s.habits, habit] }));
        return id;
      },
      updateHabit: (id, draft) => {
        const next = normalizeDraft(draft);
        set((s) => ({
          habits: s.habits.map((h) => (h.id === id ? { ...h, ...next } : h)),
        }));
      },
      deleteHabit: (id) => {
        set((s) => {
          const checkins = { ...s.checkins };
          const prefix = `${id}:`;
          for (const key of Object.keys(checkins)) {
            if (key.startsWith(prefix)) delete checkins[key];
          }
          return { habits: s.habits.filter((h) => h.id !== id), checkins };
        });
      },
      setCheckin: (habitId, dateKey, value) => {
        const key = checkinKey(habitId, dateKey);
        set((s) => {
          const checkins = { ...s.checkins };
          if (value <= 0) delete checkins[key];
          else checkins[key] = value;
          return { checkins };
        });
      },
      toggleCheckin: (habitId, dateKey) => {
        const habit = get().habits.find((h) => h.id === habitId);
        if (!habit) return;
        const current = getValue(get().checkins, habitId, dateKey);
        const target = targetOf(habit);
        get().setCheckin(habitId, dateKey, current >= target ? 0 : target);
      },
      bumpCheckin: (habitId, dateKey, delta) => {
        const habit = get().habits.find((h) => h.id === habitId);
        if (!habit) return;
        const current = getValue(get().checkins, habitId, dateKey);
        const next = Math.max(0, Math.min(targetOf(habit), current + delta));
        get().setCheckin(habitId, dateKey, next);
      },
    }),
    {
      name: "ritm-habits-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        habits: s.habits,
        checkins: s.checkins,
        seeded: s.seeded,
      }),
    },
  ),
);

export async function rehydrateHabits(): Promise<void> {
  await useHabitStore.persist.rehydrate();
  const state = useHabitStore.getState();
  if (!state.seeded) {
    useHabitStore.setState({
      habits: demo.habits,
      checkins: demo.checkins,
      seeded: true,
    });
  }
}
