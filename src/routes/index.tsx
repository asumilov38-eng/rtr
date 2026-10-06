import { createFileRoute } from "@tanstack/react-router";
import { HabitApp } from "@/components/habits/habit-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <HabitApp />;
}
