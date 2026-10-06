import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { A as Slot, N as require_jsx_runtime, a as Overlay2, c as Title2, d as DialogContent$1, f as DialogDescription$1, h as DialogTitle$1, i as Description2, l as Dialog$1, m as DialogPortal$1, n as Cancel, o as Portal2, p as DialogOverlay$1, r as Content2, s as Root2, t as Action, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { C as ChartColumn, E as BookOpen, S as Check, T as Brain, _ as Dumbbell, a as Plus, b as ChevronRight, c as Music, d as Leaf, f as LayoutGrid, g as Ellipsis, h as Flame, i as Sun, l as Moon, m as Footprints, o as Pencil, p as Heart, r as Trash2, s as PenLine, t as X, u as Minus, v as Droplets, w as CalendarDays, x as ChevronLeft, y as Coffee } from "../_libs/lucide-react.mjs";
import { a as addWeeks, c as addDays, i as endOfMonth, n as format, o as startOfWeek, r as startOfMonth, s as addMonths, t as ru } from "../_libs/date-fns.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as ResponsiveContainer, i as Bar, n as YAxis, o as Tooltip, r as XAxis, t as BarChart } from "../_libs/recharts+[...].mjs";
import { a as Separator2, i as Root2$1, n as Item2, o as Trigger, r as Portal2$1, t as Content2$1 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BWCDf7R3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function toDateKey(date = /* @__PURE__ */ new Date()) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function parseDateKey(key) {
	const [y, m, d] = key.split("-").map(Number);
	return new Date(y, (m ?? 1) - 1, d ?? 1);
}
function mondayOf(date) {
	return startOfWeek(date, { weekStartsOn: 1 });
}
function weekKeys(anchor) {
	const start = mondayOf(anchor);
	return Array.from({ length: 7 }, (_, i) => toDateKey(addDays(start, i)));
}
function monthGrid(anchor) {
	const start = startOfMonth(anchor);
	const end = endOfMonth(anchor);
	const lead = (start.getDay() + 6) % 7;
	const cells = Array.from({ length: lead }, () => null);
	for (let d = start; d <= end; d = addDays(d, 1)) cells.push(toDateKey(d));
	while (cells.length % 7 !== 0) cells.push(null);
	return cells;
}
function checkinKey(habitId, dateKey) {
	return `${habitId}:${dateKey}`;
}
function formatWeekday(date) {
	return format(date, "EEEE", { locale: ru });
}
function formatDayMonth(date) {
	return format(date, "d MMMM", { locale: ru });
}
function formatMonthYear(date) {
	return format(date, "LLLL yyyy", { locale: ru });
}
function formatWeekRange(anchor) {
	const start = mondayOf(anchor);
	const end = addDays(start, 6);
	if (start.getMonth() === end.getMonth()) return `${format(start, "d", { locale: ru })}–${format(end, "d MMMM", { locale: ru })}`;
	return `${format(start, "d MMM", { locale: ru })} – ${format(end, "d MMM", { locale: ru })}`;
}
function hourGreeting(date = /* @__PURE__ */ new Date()) {
	const h = date.getHours();
	if (h < 5) return "Доброй ночи";
	if (h < 12) return "Доброе утро";
	if (h < 18) return "Добрый день";
	return "Добрый вечер";
}
function isDueOn(habit, dateKey) {
	return habit.days.includes(parseDateKey(dateKey).getDay());
}
function targetOf(habit) {
	return habit.kind === "count" ? Math.max(1, habit.target) : 1;
}
function isDone(habit, value) {
	return value >= targetOf(habit);
}
function getValue(checkins, habitId, dateKey) {
	return checkins[checkinKey(habitId, dateKey)] ?? 0;
}
function dueOnDay(habits, dateKey) {
	return habits.filter((h) => isDueOn(h, dateKey));
}
function createdKey(habit) {
	return toDateKey(new Date(habit.createdAt));
}
function dueDaysBetween(habit, fromKey, toKey) {
	const created = createdKey(habit);
	const start = fromKey > created ? fromKey : created;
	const days = [];
	let d = parseDateKey(start);
	const end = parseDateKey(toKey);
	while (d <= end) {
		const key = toDateKey(d);
		if (isDueOn(habit, key)) days.push(key);
		d = addDays(d, 1);
	}
	return days;
}
function currentStreak(habit, checkins, todayKey) {
	let cursor = parseDateKey(todayKey);
	const todayDue = isDueOn(habit, todayKey);
	const todayDone = isDone(habit, getValue(checkins, habit.id, todayKey));
	if (todayDue && !todayDone) cursor = addDays(cursor, -1);
	const created = createdKey(habit);
	let streak = 0;
	for (let i = 0; i < 800; i++) {
		const key = toDateKey(cursor);
		if (key < created) break;
		if (!isDueOn(habit, key)) {
			cursor = addDays(cursor, -1);
			continue;
		}
		if (!isDone(habit, getValue(checkins, habit.id, key))) break;
		streak += 1;
		cursor = addDays(cursor, -1);
	}
	return streak;
}
function bestStreak(habit, checkins, todayKey) {
	const days = dueDaysBetween(habit, createdKey(habit), todayKey);
	let best = 0;
	let run = 0;
	for (const key of days) if (isDone(habit, getValue(checkins, habit.id, key))) {
		run += 1;
		if (run > best) best = run;
	} else run = 0;
	return best;
}
function completionRate(habit, checkins, fromKey, toKey) {
	const days = dueDaysBetween(habit, fromKey, toKey);
	if (days.length === 0) return 0;
	return days.filter((key) => isDone(habit, getValue(checkins, habit.id, key))).length / days.length;
}
function completionsInRange(habit, checkins, fromKey, toKey) {
	return dueDaysBetween(habit, fromKey, toKey).filter((key) => isDone(habit, getValue(checkins, habit.id, key))).length;
}
function dayCompletion(habits, checkins, dateKey) {
	const due = dueOnDay(habits, dateKey);
	const done = due.filter((h) => isDone(h, getValue(checkins, h.id, dateKey))).length;
	return {
		due: due.length,
		done
	};
}
function weeklyRates(habits, checkins, today, weeks = 8) {
	const thisMonday = weekKeys(today)[0];
	const points = [];
	for (let i = weeks - 1; i >= 0; i--) {
		const start = addWeeks(parseDateKey(thisMonday), -i);
		const keys = weekKeys(start);
		const endKey = keys[6];
		const startKey = keys[0];
		let due = 0;
		let done = 0;
		for (const habit of habits) {
			const days = dueDaysBetween(habit, startKey, endKey > toDateKey(today) ? toDateKey(today) : endKey);
			due += days.length;
			done += days.filter((k) => isDone(habit, getValue(checkins, habit.id, k))).length;
		}
		points.push({
			weekStart: startKey,
			label: `${start.getDate()}.${String(start.getMonth() + 1).padStart(2, "0")}`,
			rate: due === 0 ? 0 : Math.round(done / due * 100),
			done,
			due
		});
	}
	return points;
}
function heatmapWeeks(habit, checkins, todayKey, weeks = 16) {
	const thisMonday = parseDateKey(weekKeys(parseDateKey(todayKey))[0]);
	const start = addWeeks(thisMonday, -(weeks - 1));
	const columns = [];
	for (let w = 0; w < weeks; w++) {
		const col = [];
		for (let d = 0; d < 7; d++) {
			const dateKey = toDateKey(addDays(start, w * 7 + d));
			const value = getValue(checkins, habit.id, dateKey);
			col.push({
				dateKey,
				due: isDueOn(habit, dateKey) && dateKey >= createdKey(habit),
				value,
				done: isDone(habit, value),
				future: dateKey > todayKey
			});
		}
		columns.push(col);
	}
	return columns;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function HabitHeatmap({ habit, checkins, todayKey, weeks = 16 }) {
	const columns = heatmapWeeks(habit, checkins, todayKey, weeks);
	const target = targetOf(habit);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-habit": habit.color,
		className: "flex gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col justify-between py-0.5 text-[0.625rem] leading-none text-fg-subtle",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "пн" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ср" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "вс" })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex min-w-0 flex-1 gap-1 overflow-x-auto",
			children: columns.map((col, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-1",
				children: col.map((cell) => {
					const date = parseDateKey(cell.dateKey);
					const label = format(date, "d MMMM", { locale: ru });
					const intensity = !cell.due || cell.future ? 0 : cell.done ? 1 : cell.value > 0 ? Math.max(.35, cell.value / target) : 0;
					const status = cell.future ? "ещё не наступил" : !cell.due ? "не по расписанию" : cell.done ? "выполнено" : cell.value > 0 ? `${cell.value} из ${target}` : "пропуск";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						title: `${label} — ${status}`,
						className: cn("block size-2.5 rounded-2xs sm:size-3", cell.future ? "bg-transparent" : intensity === 0 ? "bg-bg-subtle" : "bg-(--habit)"),
						style: intensity > 0 && intensity < 1 ? { opacity: intensity } : void 0
					}, cell.dateKey);
				})
			}, i))
		})]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[background-color,color,box-shadow,transform,opacity] duration-[var(--motion-quick)] ease-[var(--ease-out)] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-accent-hover",
			destructive: "bg-destructive text-destructive-fg hover:bg-destructive/90",
			outline: "bg-bg-elevated text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			secondary: "bg-secondary text-secondary-foreground hover:bg-border",
			ghost: "text-fg hover:bg-bg-subtle",
			link: "text-accent underline-offset-4 hover:underline"
		},
		size: {
			default: "h-11 px-4 has-[>svg]:px-3.5",
			sm: "h-9 rounded-sm px-3 text-[0.8125rem] has-[>svg]:px-2.5",
			lg: "h-12 rounded-lg px-5",
			icon: "size-11",
			"icon-sm": "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		"data-slot": "button",
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
		className: cn("fixed inset-0 z-50 bg-fg/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
		...props
	});
}
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-bg-elevated p-5 shadow-[var(--shadow-border)] outline-none", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-sm text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Закрыть"
			})]
		})]
	})] });
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1.5 pr-8", className),
		...props
	});
}
function DialogFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-xl font-medium tracking-tight text-fg", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("text-sm text-fg-muted", className),
		...props
	});
}
var HABIT_ICONS = {
	leaf: Leaf,
	book: BookOpen,
	dumbbell: Dumbbell,
	droplet: Droplets,
	brain: Brain,
	moon: Moon,
	sun: Sun,
	heart: Heart,
	coffee: Coffee,
	footprints: Footprints,
	pen: PenLine,
	music: Music
};
var HABIT_ICON_LABELS = {
	leaf: "Лист",
	book: "Книга",
	dumbbell: "Зарядка",
	droplet: "Вода",
	brain: "Фокус",
	moon: "Сон",
	sun: "Утро",
	heart: "Забота",
	coffee: "Ритуал",
	footprints: "Шаги",
	pen: "Запись",
	music: "Музыка"
};
var QUOTES = [
	"Маленькие шаги складывают большие расстояния.",
	"Не прерывайте цепочку. Один день — один голос за себя.",
	"Сегодня достаточно сделать сегодняшний день.",
	"Привычка — это то, что остаётся, когда мотивация уходит.",
	"Ритм важнее рывка. Держите темп, а не рекорд.",
	"Сделайте это сейчас — будущему вам будет легче.",
	"Дисциплина тише настроения и надёжнее вдохновения.",
	"Пропущенный день — не крушение. Следующий — продолжение.",
	"Вы не обязаны хотеть. Вы можете просто начать.",
	"Постоянство выглядит скромно вблизи и внушительно издалека.",
	"Каждое повторение — кирпич в доме, который вы строите.",
	"Тихий день, закрытый вовремя, стоит громкого плана."
];
function quoteForDate(dateKey) {
	let hash = 0;
	for (let i = 0; i < dateKey.length; i++) hash = hash * 31 + dateKey.charCodeAt(i) | 0;
	return QUOTES[Math.abs(hash) % QUOTES.length];
}
function streakCopy(name, days) {
	if (days >= 30) return `Месяц в ритме «${name}». Это уже характер.`;
	if (days >= 21) return `Три недели «${name}» подряд. Привычка закрепляется.`;
	if (days >= 14) return `Две недели без пропуска: «${name}».`;
	if (days >= 7) return `Неделя «${name}» без разрыва. Так держать.`;
	if (days >= 3) return `Три дня «${name}» — цепочка жива.`;
	return null;
}
function todayCopy(done, due) {
	if (due === 0) return "Сегодня по расписанию выходной. Можно отдохнуть или добавить привычку.";
	if (done === 0) return "Ещё ни одной отметки. Один маленький шаг — и день уже другой.";
	if (done >= due) return "День закрыт. Ритм держится — можно выдохнуть.";
	return `Закрыто ${done} из ${due}. Осталось немного — не отпускайте день.`;
}
var HABIT_COLOR_IDS = [
	"sage",
	"teal",
	"slate",
	"olive",
	"clay",
	"rose",
	"sky",
	"ink"
];
var HABIT_ICON_IDS = [
	"leaf",
	"book",
	"dumbbell",
	"droplet",
	"brain",
	"moon",
	"sun",
	"heart",
	"coffee",
	"footprints",
	"pen",
	"music"
];
var HABIT_COLOR_LABELS = {
	sage: "Шалфей",
	teal: "Ива",
	slate: "Сланец",
	olive: "Олива",
	clay: "Глина",
	rose: "Пион",
	sky: "Небо",
	ink: "Чернила"
};
var WEEKDAY_SHORT = [
	"пн",
	"вт",
	"ср",
	"чт",
	"пт",
	"сб",
	"вс"
];
var WEEKDAY_JS = [
	1,
	2,
	3,
	4,
	5,
	6,
	0
];
var ALL_DAYS = [
	0,
	1,
	2,
	3,
	4,
	5,
	6
];
var WEEKDAYS = [
	1,
	2,
	3,
	4,
	5
];
function HabitDetail({ habit, checkins, todayKey, today, open, onOpenChange, onEdit, onDelete }) {
	if (!habit) return null;
	const Icon = HABIT_ICONS[habit.icon];
	const weekStart = toDateKey(addDays(today, -((today.getDay() + 6) % 7)));
	const monthStart = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
	const created = toDateKey(new Date(habit.createdAt));
	const streak = currentStreak(habit, checkins, todayKey);
	const best = bestStreak(habit, checkins, todayKey);
	const week = Math.round(completionRate(habit, checkins, weekStart, todayKey) * 100);
	const month = Math.round(completionRate(habit, checkins, monthStart, todayKey) * 100);
	const allDue = dueDaysBetween(habit, created, todayKey).length;
	const allDone = completionsInRange(habit, checkins, created, todayKey);
	const allPct = allDue ? Math.round(allDone / allDue * 100) : 0;
	const encourage = streakCopy(habit.name, streak);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[min(92dvh,760px)] overflow-y-auto",
			"data-habit": habit.color,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-fg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-(--habit)" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: habit.name }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: habit.note || "Статистика привычки" })
				] }),
				encourage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-base italic text-fg",
					children: encourage
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
							label: "Серия",
							value: String(streak)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
							label: "Рекорд",
							value: String(best)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
							label: "Неделя",
							value: `${week}%`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
							label: "Месяц",
							value: `${month}%`
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-[0.75rem] font-medium text-fg-muted",
					children: "Шестнадцать недель"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitHeatmap, {
					habit,
					checkins,
					todayKey,
					weeks: 16
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-fg-muted tabular-nums",
					children: [
						"Всего ",
						allDone,
						" из ",
						allDue,
						" дней по расписанию · ",
						allPct,
						"%"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1",
					children: WEEKDAY_JS.map((day, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: habit.days.includes(day) ? "rounded-full bg-fg px-2 py-1 text-[0.6875rem] font-medium text-bg-elevated uppercase" : "rounded-full bg-bg-subtle px-2 py-1 text-[0.6875rem] font-medium text-fg-subtle uppercase",
						children: WEEKDAY_SHORT[i]
					}, day))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 sm:flex-row sm:justify-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: onEdit,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" }), "Изменить"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "destructive",
						onClick: onDelete,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Удалить"]
					})]
				})
			]
		})
	});
}
function MiniStat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-bg-subtle px-3 py-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[0.6875rem] font-medium text-fg-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-xl font-medium tabular-nums",
			children: value
		})]
	});
}
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		"data-slot": "input",
		className: cn("h-11 w-full min-w-0 rounded-md bg-bg-elevated px-3 text-base text-fg shadow-[var(--shadow-border)] outline-none transition-[box-shadow] duration-[var(--motion-quick)] placeholder:text-fg-subtle md:text-sm", "focus-visible:shadow-[0_0_0_2px_var(--color-bg),0_0_0_4px_var(--color-ring)]", "disabled:pointer-events-none disabled:opacity-50", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		"data-slot": "label",
		className: cn("text-[0.8125rem] font-medium text-fg-muted", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		"data-slot": "textarea",
		className: cn("min-h-20 w-full rounded-md bg-bg-elevated px-3 py-2.5 text-base text-fg shadow-[var(--shadow-border)] outline-none transition-[box-shadow] duration-[var(--motion-quick)] placeholder:text-fg-subtle md:text-sm", "focus-visible:shadow-[0_0_0_2px_var(--color-bg),0_0_0_4px_var(--color-ring)]", "disabled:pointer-events-none disabled:opacity-50", className),
		...props
	});
}
var EMPTY = {
	name: "",
	note: "",
	color: "sage",
	icon: "leaf",
	days: ALL_DAYS,
	kind: "boolean",
	target: 1
};
function sameDays(a, b) {
	return [...a].sort().join(",") === [...b].sort().join(",");
}
function HabitForm({ open, onOpenChange, habit, onSubmit }) {
	const [draft, setDraft] = (0, import_react.useState)(EMPTY);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		if (habit) setDraft({
			name: habit.name,
			note: habit.note,
			color: habit.color,
			icon: habit.icon,
			days: [...habit.days],
			kind: habit.kind,
			target: habit.target
		});
		else setDraft(EMPTY);
	}, [open, habit]);
	const schedule = sameDays(draft.days, ALL_DAYS) ? "daily" : sameDays(draft.days, WEEKDAYS) ? "weekdays" : "custom";
	function toggleDay(day) {
		setDraft((d) => {
			const days = d.days.includes(day) ? d.days.filter((x) => x !== day) : [...d.days, day];
			return {
				...d,
				days: days.length ? days : [day]
			};
		});
	}
	function handleSubmit(e) {
		e.preventDefault();
		if (!draft.name.trim()) return;
		onSubmit(draft);
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "max-h-[min(92dvh,720px)] overflow-y-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "grid gap-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: habit ? "Редактировать привычку" : "Новая привычка" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Цвет и расписание помогают видеть ритм на календаре." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "habit-name",
							children: "Название"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "habit-name",
							value: draft.name,
							onChange: (e) => setDraft((d) => ({
								...d,
								name: e.target.value
							})),
							placeholder: "Например, чтение",
							maxLength: 48,
							required: true,
							autoFocus: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "habit-note",
							children: "Заметка"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "habit-note",
							value: draft.note,
							onChange: (e) => setDraft((d) => ({
								...d,
								note: e.target.value
							})),
							placeholder: "Короткое напоминание себе",
							maxLength: 120,
							rows: 2
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Цвет" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: HABIT_COLOR_IDS.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorSwatch, {
								id,
								selected: draft.color === id,
								onSelect: () => setDraft((d) => ({
									...d,
									color: id
								}))
							}, id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Значок" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: HABIT_ICON_IDS.map((id) => {
								const Icon = HABIT_ICONS[id];
								const selected = draft.icon === id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": HABIT_ICON_LABELS[id],
									"aria-pressed": selected,
									onClick: () => setDraft((d) => ({
										...d,
										icon: id
									})),
									className: cn("inline-flex size-10 items-center justify-center rounded-sm transition-colors", selected ? "bg-accent text-accent-fg" : "bg-bg-subtle text-fg-muted hover:text-fg"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
								}, id);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Расписание" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: [
									["daily", "Каждый день"],
									["weekdays", "Будни"],
									["custom", "Свои дни"]
								].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-pressed": schedule === id,
									onClick: () => setDraft((d) => ({
										...d,
										days: id === "daily" ? ALL_DAYS : id === "weekdays" ? WEEKDAYS : d.days
									})),
									className: cn("h-9 rounded-full px-3 text-[0.8125rem] font-medium transition-colors", schedule === id ? "bg-accent text-accent-fg" : "bg-bg-subtle text-fg-muted hover:text-fg"),
									children: label
								}, id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5 pt-1",
								children: WEEKDAY_JS.map((day, i) => {
									const on = draft.days.includes(day);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-pressed": on,
										onClick: () => toggleDay(day),
										className: cn("size-9 rounded-full text-[0.75rem] font-medium uppercase transition-colors", on ? "bg-fg text-bg-elevated" : "bg-bg-subtle text-fg-muted hover:text-fg"),
										children: WEEKDAY_SHORT[i]
									}, day);
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Тип отметки" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: [["boolean", "Да / нет"], ["count", "Счётчик"]].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-pressed": draft.kind === id,
									onClick: () => setDraft((d) => ({
										...d,
										kind: id,
										target: id === "count" ? Math.max(d.target, 2) : 1
									})),
									className: cn("h-9 rounded-full px-3 text-[0.8125rem] font-medium transition-colors", draft.kind === id ? "bg-accent text-accent-fg" : "bg-bg-subtle text-fg-muted hover:text-fg"),
									children: label
								}, id))
							}),
							draft.kind === "count" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "habit-target",
									className: "shrink-0",
									children: "Цель в день"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "habit-target",
									type: "number",
									min: 2,
									max: 20,
									value: draft.target,
									onChange: (e) => setDraft((d) => ({
										...d,
										target: Number(e.target.value)
									})),
									className: "w-24"
								})]
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => onOpenChange(false),
						children: "Отмена"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: !draft.name.trim(),
						children: habit ? "Сохранить" : "Добавить"
					})] })
				]
			})
		})
	});
}
function ColorSwatch({ id, selected, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": HABIT_COLOR_LABELS[id],
		"aria-pressed": selected,
		"data-habit": id,
		onClick: onSelect,
		className: cn("size-9 rounded-full bg-(--habit) transition-transform", selected && "ring-2 ring-fg ring-offset-2 ring-offset-bg-elevated")
	});
}
function CheckControl({ habit, value, onToggle, onBump, compact = false, disabled = false }) {
	const target = targetOf(habit);
	const done = isDone(habit, value);
	const progress = Math.min(1, value / target);
	const size = compact ? 36 : 44;
	const r = compact ? 13 : 16;
	const c = 2 * Math.PI * r;
	const offset = c * (1 - progress);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1",
		"data-habit": habit.color,
		children: [
			habit.kind === "count" && onBump && !compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Меньше",
				disabled: disabled || value <= 0,
				onClick: () => onBump(-1),
				className: "inline-flex size-9 items-center justify-center rounded-sm text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg disabled:opacity-30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-3.5" })
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				disabled,
				onClick: onToggle,
				"aria-pressed": done,
				"aria-label": done ? `Снять отметку: ${habit.name}` : `Отметить: ${habit.name}`,
				className: cn("relative inline-flex items-center justify-center rounded-full transition-[transform,background-color,opacity] duration-[var(--motion-quick)] ease-[var(--ease-out)] active:scale-[0.96] disabled:pointer-events-none disabled:opacity-40", compact ? "size-9" : "size-11"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: `0 0 ${size} ${size}`,
					className: "absolute inset-0 size-full -rotate-90",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: size / 2,
						cy: size / 2,
						r,
						fill: "none",
						stroke: "var(--color-border-strong)",
						strokeWidth: "2.25"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: size / 2,
						cy: size / 2,
						r,
						fill: done ? "var(--habit)" : "transparent",
						stroke: "var(--habit)",
						strokeWidth: "2.25",
						strokeDasharray: c,
						strokeDashoffset: offset,
						strokeLinecap: "round",
						className: "transition-[stroke-dashoffset,fill] duration-[var(--motion-fast)] ease-[var(--ease-smooth-out)]"
					})]
				}), done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
					className: cn("relative text-accent-fg", compact ? "size-3.5" : "size-4"),
					strokeWidth: 2.5
				}) : habit.kind === "count" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "relative font-medium text-[0.6875rem] tabular-nums text-fg",
					children: value
				}) : null]
			}),
			habit.kind === "count" && onBump && !compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Больше",
				disabled: disabled || value >= target,
				onClick: () => onBump(1),
				className: "inline-flex size-9 items-center justify-center rounded-sm text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg disabled:opacity-30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" })
			}) : null
		]
	});
}
function MonthView({ month, todayKey, selectedKey, habits, checkins, onPrev, onNext, onSelect, onToggle, onBump, label }) {
	const cells = monthGrid(month);
	const selectedDue = dueOnDay(habits, selectedKey);
	const selectedDate = parseDateKey(selectedKey);
	const future = selectedKey > todayKey;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[0.8125rem] font-medium tracking-wide text-fg-muted uppercase",
					children: "Месяц"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl leading-tight font-medium tracking-[-0.03em] capitalize",
					children: label
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "icon-sm",
						onClick: onPrev,
						"aria-label": "Предыдущий месяц",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "icon-sm",
						onClick: onNext,
						"aria-label": "Следующий месяц",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-xl bg-bg-elevated p-3 shadow-[var(--shadow-border)] sm:p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7 gap-1 pb-2 text-center text-[0.6875rem] font-medium uppercase text-fg-subtle",
					children: WEEKDAY_SHORT.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d }, d))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7 gap-1",
					children: cells.map((key, i) => {
						if (!key) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-square" }, `e-${i}`);
						const { due, done } = dayCompletion(habits, checkins, key);
						const isToday = key === todayKey;
						const isSelected = key === selectedKey;
						const ratio = due === 0 ? 0 : done / due;
						const dots = habits.filter((h) => isDone(h, getValue(checkins, h.id, key))).slice(0, 4);
						const isFuture = key > todayKey;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onSelect(key),
							"aria-current": isToday ? "date" : void 0,
							"aria-pressed": isSelected,
							className: cn("flex aspect-square flex-col items-center justify-between rounded-md px-0.5 py-1 text-[0.8125rem] tabular-nums transition-colors", isSelected ? "bg-fg text-bg-elevated" : "hover:bg-bg-subtle", isToday && !isSelected && "ring-1 ring-accent", isFuture && "text-fg-subtle"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "leading-none",
									children: parseDateKey(key).getDate()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex h-2.5 items-center justify-center gap-0.5",
									children: due === 0 || isFuture ? null : dots.length > 0 ? dots.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										"data-habit": h.color,
										className: cn("size-1.5 rounded-full bg-(--habit)", isSelected && "ring-1 ring-bg-elevated")
									}, h.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1 rounded-full", isSelected ? "bg-bg-elevated/40" : "bg-border-strong") })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "sr-only",
									children: [
										done,
										" из ",
										due,
										", заполнение ",
										Math.round(ratio * 100),
										"%"
									]
								})
							]
						}, key);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-bg-elevated p-4 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-medium capitalize",
					children: selectedDate.toLocaleDateString("ru-RU", {
						weekday: "long",
						day: "numeric",
						month: "long"
					})
				}), future ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-fg-muted",
					children: "Этот день ещё не наступил."
				}) : selectedDue.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-fg-muted",
					children: "В этот день привычек нет."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 flex flex-col gap-1",
					children: selectedDue.map((habit) => {
						const value = getValue(checkins, habit.id, selectedKey);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-3 rounded-md px-1 py-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 truncate text-sm font-medium",
								children: habit.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckControl, {
								habit,
								value,
								onToggle: () => onToggle(habit.id, selectedKey),
								onBump: (d) => onBump(habit.id, selectedKey, d)
							})]
						}, habit.id);
					})
				})]
			})
		]
	});
}
function StatsView({ habits, checkins, todayKey, today, onOpen, onCreate }) {
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
	const weekPct = weekDue ? Math.round(weekDone / weekDue * 100) : 0;
	const monthPct = monthDue ? Math.round(monthDone / monthDue * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[0.8125rem] font-medium tracking-wide text-fg-muted uppercase",
				children: "Сводка"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl leading-tight font-medium tracking-[-0.03em]",
				children: "Как держится ритм"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Эта неделя",
						value: `${weekPct}%`,
						hint: `${weekDone} из ${weekDue}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Этот месяц",
						value: `${monthPct}%`,
						hint: `${monthDone} из ${monthDue}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Лучшая серия",
						value: `${best}`,
						hint: "дней подряд"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Всего отметок",
						value: `${totalDone}`,
						hint: "за всё время"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-bg-elevated p-4 shadow-[var(--shadow-border)] sm:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium text-fg-muted",
					children: "Восемь недель"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 h-44",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: points,
							barCategoryGap: "28%",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "label",
									tick: {
										fill: "var(--color-fg-subtle)",
										fontSize: 11
									},
									axisLine: false,
									tickLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									domain: [0, 100],
									ticks: [
										0,
										50,
										100
									],
									tick: {
										fill: "var(--color-fg-subtle)",
										fontSize: 11
									},
									axisLine: false,
									tickLine: false,
									width: 28
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									cursor: { fill: "var(--color-bg-subtle)" },
									content: ({ payload, label }) => {
										const row = payload?.[0]?.payload;
										if (!row) return null;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-sm bg-fg px-2.5 py-1.5 text-xs text-bg-elevated",
											children: [
												"Неделя ",
												label,
												": ",
												row.rate,
												"% (",
												row.done,
												"/",
												row.due,
												")"
											]
										});
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "rate",
									fill: "var(--color-accent)",
									radius: [
										4,
										4,
										0,
										0
									]
								})
							]
						})
					})
				})]
			}),
			habits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-bg-elevated px-5 py-10 text-center shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl",
						children: "Пока нечего считать"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-fg-muted",
						children: "Добавьте привычку — сводка заполнится сама."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-5",
						onClick: onCreate,
						children: "Добавить привычку"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-3",
				children: habits.map((habit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitStatCard, {
					habit,
					checkins,
					todayKey,
					weekStart,
					monthStart,
					onOpen: () => onOpen(habit)
				}) }, habit.id))
			})
		]
	});
}
function StatCard({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-bg-elevated px-3.5 py-3 shadow-[var(--shadow-border)] sm:px-4 sm:py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[0.75rem] font-medium text-fg-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-display text-2xl leading-none font-medium tabular-nums sm:text-3xl",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[0.75rem] text-fg-subtle tabular-nums",
				children: hint
			})
		]
	});
}
function HabitStatCard({ habit, checkins, todayKey, weekStart, monthStart, onOpen }) {
	const streak = currentStreak(habit, checkins, todayKey);
	const best = bestStreak(habit, checkins, todayKey);
	const week = Math.round(completionRate(habit, checkins, weekStart, todayKey) * 100);
	const month = Math.round(completionRate(habit, checkins, monthStart, todayKey) * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onOpen,
		"data-habit": habit.color,
		className: "flex w-full flex-col gap-3 rounded-xl bg-bg-elevated p-4 text-left shadow-[var(--shadow-border)] transition-shadow hover:shadow-[var(--shadow-border-hover)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mb-1 block h-1 w-8 rounded-full bg-(--habit)" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "truncate font-medium",
							children: habit.name
						}),
						habit.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-[0.8125rem] text-fg-subtle",
							children: habit.note
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 gap-3 text-right text-[0.75rem] text-fg-muted tabular-nums",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["серия", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "ml-1 font-medium text-fg",
						children: streak
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["лучшая", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "ml-1 font-medium text-fg",
						children: best
					})] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitHeatmap, {
				habit,
				checkins,
				todayKey,
				weeks: 16
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[0.75rem] text-fg-subtle tabular-nums",
				children: [
					"Неделя ",
					week,
					"% · месяц ",
					month,
					"%"
				]
			})
		]
	});
}
var DropdownMenu = Root2$1;
var DropdownMenuTrigger = Trigger;
var DropdownMenuPortal = Portal2$1;
function DropdownMenuContent({ className, sideOffset = 6, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$1, {
		sideOffset,
		className: cn("z-50 min-w-40 overflow-hidden rounded-lg bg-bg-elevated p-1 text-fg shadow-[var(--shadow-border)]", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
		...props
	}) });
}
function DropdownMenuItem({ className, inset, variant = "default", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
		className: cn("relative flex cursor-pointer items-center gap-2 rounded-sm px-2.5 py-2 text-sm outline-none select-none", "focus:bg-bg-subtle data-[disabled]:pointer-events-none data-[disabled]:opacity-40", variant === "destructive" && "text-destructive focus:bg-destructive/10", inset && "pl-8", className),
		...props
	});
}
function DropdownMenuSeparator({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
		className: cn("-mx-1 my-1 h-px bg-border", className),
		...props
	});
}
function TodayView({ dateKey, habits, checkins, greeting, weekday, dayMonth, onToggle, onBump, onOpen, onEdit, onDelete, onCreate }) {
	const due = dueOnDay(habits, dateKey);
	const doneCount = due.filter((h) => isDone(h, getValue(checkins, h.id, dateKey))).length;
	const quote = quoteForDate(dateKey);
	const longest = due.map((h) => ({
		habit: h,
		days: currentStreak(h, checkins, dateKey)
	})).sort((a, b) => b.days - a.days)[0];
	const motivation = todayCopy(doneCount, due.length) ?? (longest ? streakCopy(longest.habit.name, longest.days) : null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[0.8125rem] font-medium tracking-wide text-fg-muted uppercase",
						children: greeting
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg italic text-fg-muted capitalize",
						children: weekday
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl leading-none font-medium tracking-[-0.03em] text-fg sm:text-5xl",
						children: dayMonth
					}),
					due.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-fg-muted tabular-nums",
						children: [
							"Сегодня ",
							doneCount,
							" из ",
							due.length
						]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
				className: "rounded-xl bg-bg-elevated px-5 py-4 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg leading-snug text-fg italic",
					children: quote
				}), motivation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-fg-muted",
					children: motivation
				}) : null]
			}),
			due.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyToday, {
				hasHabits: habits.length > 0,
				onCreate
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col overflow-hidden rounded-xl bg-bg-elevated shadow-[var(--shadow-border)]",
				children: due.map((habit, i) => {
					const value = getValue(checkins, habit.id, dateKey);
					const streak = currentStreak(habit, checkins, dateKey);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: cn(i > 0 && "border-t border-border"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitRow, {
							habit,
							value,
							streak,
							onToggle: () => onToggle(habit.id),
							onBump: (d) => onBump(habit.id, d),
							onOpen: () => onOpen(habit),
							onEdit: () => onEdit(habit),
							onDelete: () => onDelete(habit)
						})
					}, habit.id);
				})
			})
		]
	});
}
function HabitRow({ habit, value, streak, onToggle, onBump, onOpen, onEdit, onDelete }) {
	const Icon = HABIT_ICONS[habit.icon];
	const done = isDone(habit, value);
	const target = targetOf(habit);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-habit": habit.color,
		className: "flex items-center gap-3 px-3 py-3 sm:px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "h-10 w-1 shrink-0 rounded-full bg-(--habit)",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckControl, {
				habit,
				value,
				onToggle,
				onBump
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onOpen,
				className: "min-w-0 flex-1 py-1 text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5 shrink-0 text-fg-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("truncate font-medium", done && "text-fg-muted"),
						children: habit.name
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-0.5 block truncate text-[0.8125rem] text-fg-subtle",
					children: habit.kind === "count" ? `${value} из ${target}` : habit.note || "Нажмите, чтобы открыть"
				})]
			}),
			streak > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "hidden items-center gap-1 text-[0.8125rem] font-medium text-fg-muted tabular-nums sm:inline-flex",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-3.5" }), streak]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon-sm",
					"aria-label": `Действия: ${habit.name}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
				align: "end",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
						onSelect: onOpen,
						children: "Открыть сводку"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
						onSelect: onEdit,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" }), "Изменить"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
						variant: "destructive",
						onSelect: onDelete,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Удалить"]
					})
				]
			})] })
		]
	});
}
function EmptyToday({ hasHabits, onCreate }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-bg-elevated px-5 py-10 text-center shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-xl text-fg",
				children: hasHabits ? "Сегодня по расписанию пусто" : "Пока нет привычек"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-2 max-w-sm text-sm text-fg-muted",
				children: hasHabits ? "Можно отдохнуть или добавить привычку на этот день недели." : "Добавьте первую — и начните свой ритм. Отметки сохраняются на этом устройстве."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-5",
				onClick: onCreate,
				children: "Добавить привычку"
			})
		]
	});
}
function WeekView({ keys, label, todayKey, habits, checkins, onPrev, onNext, onToggle, onOpen }) {
	const dueThisWeek = habits.filter((h) => keys.some((k) => isDueOn(h, k)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[0.8125rem] font-medium tracking-wide text-fg-muted uppercase",
				children: "Неделя"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl leading-tight font-medium tracking-[-0.03em]",
				children: label
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "icon-sm",
					onClick: onPrev,
					"aria-label": "Предыдущая неделя",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "icon-sm",
					onClick: onNext,
					"aria-label": "Следующая неделя",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
				})]
			})]
		}), dueThisWeek.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "rounded-xl bg-bg-elevated px-5 py-8 text-center text-sm text-fg-muted shadow-[var(--shadow-border)]",
			children: "На эту неделю привычек нет."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overflow-hidden rounded-xl bg-bg-elevated shadow-[var(--shadow-border)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[minmax(4.5rem,1fr)_repeat(7,minmax(2.25rem,1fr))] gap-x-1 px-2 py-2 text-center text-[0.6875rem] font-medium uppercase text-fg-subtle sm:px-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-left",
					children: " "
				}), keys.map((key, i) => {
					const isToday = key === todayKey;
					const dayNum = parseDateKey(key).getDate();
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: cn("flex flex-col items-center gap-0.5 tabular-nums", isToday && "text-accent"),
						children: [WEEKDAY_SHORT[i], /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn(isToday && "font-semibold text-fg"),
							children: dayNum
						})]
					}, key);
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: dueThisWeek.map((habit) => {
				const Icon = HABIT_ICONS[habit.icon];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					"data-habit": habit.color,
					className: "grid grid-cols-[minmax(4.5rem,1fr)_repeat(7,minmax(2.25rem,1fr))] items-center gap-x-1 border-t border-border px-2 py-2 sm:px-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onOpen(habit),
						className: "flex min-w-0 items-center gap-2 py-1 text-left",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "hidden size-2 shrink-0 rounded-full bg-(--habit) sm:block" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "hidden size-3.5 shrink-0 text-fg-subtle sm:block" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-[0.8125rem] font-medium",
								children: habit.name
							})
						]
					}), keys.map((key) => {
						const due = isDueOn(habit, key);
						const value = getValue(checkins, habit.id, key);
						const future = key > todayKey;
						if (!due) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-border" })
						}, key);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckControl, {
								habit,
								value,
								compact: true,
								disabled: future,
								onToggle: () => {
									if (!future) onToggle(habit.id, key);
								}
							})
						}, key);
					})]
				}, habit.id);
			}) })]
		})]
	});
}
var AlertDialog = Root2;
var AlertDialogPortal = Portal2;
function AlertDialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
		className: cn("fixed inset-0 z-50 bg-fg/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
		...props
	});
}
function AlertDialogContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		className: cn("fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-bg-elevated p-5 shadow-[var(--shadow-border)] outline-none", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
		...props
	})] });
}
function AlertDialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1.5", className),
		...props
	});
}
function AlertDialogFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
		...props
	});
}
function AlertDialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
		className: cn("font-display text-xl font-medium tracking-tight", className),
		...props
	});
}
function AlertDialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
		className: cn("text-sm text-fg-muted", className),
		...props
	});
}
function AlertDialogAction({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
		className: cn(buttonVariants(), className),
		...props
	});
}
function AlertDialogCancel({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
		className: cn(buttonVariants({ variant: "outline" }), className),
		...props
	});
}
function mulberry32(seed) {
	return () => {
		seed |= 0;
		seed = seed + 1831565813 | 0;
		let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function createDemoData(now = /* @__PURE__ */ new Date()) {
	const today = toDateKey(now);
	const createdAt = addDays(now, -72).getTime();
	const habits = [
		{
			id: "demo-charge",
			name: "Утренняя зарядка",
			note: "Десять минут, без телефона",
			color: "sage",
			icon: "dumbbell",
			days: ALL_DAYS,
			kind: "boolean",
			target: 1,
			createdAt
		},
		{
			id: "demo-read",
			name: "Чтение",
			note: "Хотя бы двадцать страниц",
			color: "slate",
			icon: "book",
			days: ALL_DAYS,
			kind: "boolean",
			target: 1,
			createdAt
		},
		{
			id: "demo-water",
			name: "Вода",
			note: "Восемь стаканов за день",
			color: "teal",
			icon: "droplet",
			days: ALL_DAYS,
			kind: "count",
			target: 8,
			createdAt
		},
		{
			id: "demo-meditate",
			name: "Медитация",
			note: "Пять минут тишины",
			color: "rose",
			icon: "brain",
			days: WEEKDAYS,
			kind: "boolean",
			target: 1,
			createdAt
		},
		{
			id: "demo-walk",
			name: "Прогулка",
			note: "На воздухе, без наушников",
			color: "olive",
			icon: "footprints",
			days: [0, 6],
			kind: "boolean",
			target: 1,
			createdAt
		}
	];
	const skipChance = {
		"demo-charge": .18,
		"demo-read": .28,
		"demo-water": .12,
		"demo-meditate": .32,
		"demo-walk": .22
	};
	const rand = mulberry32(20261005);
	const checkins = {};
	const createdKey = toDateKey(new Date(createdAt));
	for (let i = 71; i >= 0; i--) {
		const key = toDateKey(addDays(now, -i));
		if (key > today) continue;
		const recent = i <= 4 && i > 0;
		for (const habit of habits) {
			if (key < createdKey) continue;
			if (!isDueOn(habit, key)) continue;
			if (key === today) {
				if (habit.id === "demo-read") checkins[checkinKey(habit.id, key)] = 1;
				if (habit.id === "demo-water") checkins[checkinKey(habit.id, key)] = 3;
				continue;
			}
			if (recent ? false : rand() < (skipChance[habit.id] ?? .2)) continue;
			if (habit.kind === "count") {
				const n = 6 + Math.floor(rand() * 3);
				checkins[checkinKey(habit.id, key)] = Math.min(habit.target, n);
			} else checkins[checkinKey(habit.id, key)] = 1;
		}
	}
	return {
		habits,
		checkins
	};
}
function normalizeDraft(draft) {
	const days = [...new Set(draft.days)].filter((d) => d >= 0 && d <= 6).sort();
	return {
		...draft,
		name: draft.name.trim().slice(0, 48),
		note: draft.note.trim().slice(0, 120),
		days: days.length ? days : ALL_DAYS,
		target: Math.min(20, Math.max(1, Math.round(draft.target) || 1))
	};
}
var demo = createDemoData();
var useHabitStore = create()(persist((set, get) => ({
	habits: demo.habits,
	checkins: demo.checkins,
	seeded: false,
	addHabit: (draft) => {
		const id = crypto.randomUUID();
		const habit = {
			...normalizeDraft(draft),
			id,
			createdAt: Date.now()
		};
		set((s) => ({ habits: [...s.habits, habit] }));
		return id;
	},
	updateHabit: (id, draft) => {
		const next = normalizeDraft(draft);
		set((s) => ({ habits: s.habits.map((h) => h.id === id ? {
			...h,
			...next
		} : h) }));
	},
	deleteHabit: (id) => {
		set((s) => {
			const checkins = { ...s.checkins };
			const prefix = `${id}:`;
			for (const key of Object.keys(checkins)) if (key.startsWith(prefix)) delete checkins[key];
			return {
				habits: s.habits.filter((h) => h.id !== id),
				checkins
			};
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
	}
}), {
	name: "ritm-habits-v1",
	storage: createJSONStorage(() => localStorage),
	skipHydration: true,
	partialize: (s) => ({
		habits: s.habits,
		checkins: s.checkins,
		seeded: s.seeded
	})
}));
async function rehydrateHabits() {
	await useHabitStore.persist.rehydrate();
	if (!useHabitStore.getState().seeded) useHabitStore.setState({
		habits: demo.habits,
		checkins: demo.checkins,
		seeded: true
	});
}
var TABS = [
	{
		id: "today",
		label: "Сегодня",
		icon: Sun
	},
	{
		id: "week",
		label: "Неделя",
		icon: LayoutGrid
	},
	{
		id: "month",
		label: "Месяц",
		icon: CalendarDays
	},
	{
		id: "stats",
		label: "Сводка",
		icon: ChartColumn
	}
];
function HabitApp() {
	const [tab, setTab] = (0, import_react.useState)("today");
	const [formOpen, setFormOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [detail, setDetail] = (0, import_react.useState)(null);
	const [deleting, setDeleting] = (0, import_react.useState)(null);
	const [weekAnchor, setWeekAnchor] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	const [monthAnchor, setMonthAnchor] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	const [selectedDay, setSelectedDay] = (0, import_react.useState)(() => toDateKey());
	const habits = useHabitStore((s) => s.habits);
	const checkins = useHabitStore((s) => s.checkins);
	const addHabit = useHabitStore((s) => s.addHabit);
	const updateHabit = useHabitStore((s) => s.updateHabit);
	const deleteHabit = useHabitStore((s) => s.deleteHabit);
	const toggleCheckin = useHabitStore((s) => s.toggleCheckin);
	const bumpCheckin = useHabitStore((s) => s.bumpCheckin);
	(0, import_react.useEffect)(() => {
		rehydrateHabits();
	}, []);
	const today = (0, import_react.useMemo)(() => /* @__PURE__ */ new Date(), []);
	const todayKey = toDateKey(today);
	const week = weekKeys(weekAnchor);
	function openCreate() {
		setEditing(null);
		setFormOpen(true);
	}
	function openEdit(habit) {
		setDetail(null);
		setEditing(habit);
		setFormOpen(true);
	}
	function openDetail(habit) {
		setDetail(habit);
	}
	function confirmDelete(habit) {
		setDetail(null);
		setDeleting(habit);
	}
	function handleSubmit(draft) {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-border/80 bg-bg/90 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-3 px-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-xl font-medium tracking-tight",
								children: "Ритм"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden text-[0.75rem] text-fg-subtle sm:inline",
								children: "трекер привычек"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "hidden items-center gap-0.5 md:flex",
							"aria-label": "Разделы",
							children: TABS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
								tab: item,
								active: tab === item.id,
								onClick: () => setTab(item.id)
							}, item.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: openCreate,
							className: "shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Привычка"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-3xl flex-1 px-4 py-6 pb-28 md:pb-10",
				children: tab === "today" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodayView, {
					dateKey: todayKey,
					habits,
					checkins,
					greeting: hourGreeting(today),
					weekday: formatWeekday(today),
					dayMonth: formatDayMonth(today),
					onToggle: (id) => toggleCheckin(id, todayKey),
					onBump: (id, d) => bumpCheckin(id, todayKey, d),
					onOpen: openDetail,
					onEdit: openEdit,
					onDelete: confirmDelete,
					onCreate: openCreate
				}) : tab === "week" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeekView, {
					keys: week,
					label: formatWeekRange(weekAnchor),
					todayKey,
					habits,
					checkins,
					onPrev: () => setWeekAnchor((d) => addWeeks(d, -1)),
					onNext: () => setWeekAnchor((d) => addWeeks(d, 1)),
					onToggle: toggleCheckin,
					onOpen: openDetail
				}) : tab === "month" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthView, {
					month: monthAnchor,
					todayKey,
					selectedKey: selectedDay,
					habits,
					checkins,
					label: formatMonthYear(monthAnchor),
					onPrev: () => setMonthAnchor((d) => addMonths(d, -1)),
					onNext: () => setMonthAnchor((d) => addMonths(d, 1)),
					onSelect: setSelectedDay,
					onToggle: toggleCheckin,
					onBump: bumpCheckin
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsView, {
					habits,
					checkins,
					todayKey,
					today,
					onOpen: openDetail,
					onCreate: openCreate
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-sm md:hidden",
				"aria-label": "Разделы",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid max-w-3xl grid-cols-4",
					children: TABS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabButton, {
						tab: item,
						active: tab === item.id,
						onClick: () => setTab(item.id),
						stacked: true
					}, item.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitForm, {
				open: formOpen,
				onOpenChange: setFormOpen,
				habit: editing,
				onSubmit: handleSubmit
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitDetail, {
				habit: detail,
				checkins,
				todayKey,
				today,
				open: Boolean(detail),
				onOpenChange: (open) => {
					if (!open) setDetail(null);
				},
				onEdit: () => detail && openEdit(detail),
				onDelete: () => detail && confirmDelete(detail)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: Boolean(deleting),
				onOpenChange: (o) => !o && setDeleting(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, { children: [
					"Удалить «",
					deleting?.name,
					"»?"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Привычка и все её отметки исчезнут с этого устройства. Это нельзя отменить." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Отмена" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					className: "bg-destructive text-destructive-fg hover:bg-destructive/90",
					onClick: handleDelete,
					children: "Удалить"
				})] })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "top-center",
				toastOptions: { classNames: { toast: "bg-bg-elevated text-fg border-0 shadow-[var(--shadow-border)] font-sans" } }
			})
		]
	});
}
function TabButton({ tab, active, onClick, stacked = false }) {
	const Icon = tab.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		"aria-current": active ? "page" : void 0,
		className: cn("inline-flex items-center justify-center gap-1.5 rounded-md text-[0.8125rem] font-medium transition-colors", stacked ? "min-h-12 flex-col gap-0.5 px-1 py-1.5" : "h-9 px-2.5", active ? "text-fg" : "text-fg-muted hover:text-fg"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("size-4", active && "text-accent") }), tab.label]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitApp, {});
}
//#endregion
export { Home as component };
