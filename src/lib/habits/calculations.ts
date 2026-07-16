import type { Habit, HabitCategory, HabitLog, WellnessLog } from './types'

const MONTH_NAMES_VN = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
]

export const WEEKDAY_SHORT_VN = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

// --- date helpers -----------------------------------------------------------
// `date` fields are stored as 'YYYY-MM-DD'. Parsing with a fixed time avoids the day
// shifting backward/forward depending on the local timezone (same convention as lib/money).

export function parseISODate(iso: string): Date {
  return new Date(`${iso.slice(0, 10)}T00:00:00`)
}

export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export interface MonthCursor {
  year: number
  monthIndex: number // 0-11
}

/** Month `monthOffset` cycles away from `today` (0 = the month containing today). */
export function getMonthCursor(monthOffset: number, today: Date = new Date()): MonthCursor {
  const total = today.getFullYear() * 12 + today.getMonth() + monthOffset
  return { year: Math.floor(total / 12), monthIndex: ((total % 12) + 12) % 12 }
}

export function getMonthLabel({ year, monthIndex }: MonthCursor): string {
  return `${MONTH_NAMES_VN[monthIndex]} ${year}`
}

/** Every calendar day in the given month, in order. */
export function getMonthDays({ year, monthIndex }: MonthCursor): Date[] {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => new Date(year, monthIndex, i + 1))
}

export function formatDayMonth(date: Date): string {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`
}

// --- log lookups -----------------------------------------------------------

/** habitId -> set of ISO dates that habit was completed on, for O(1) lookups. */
export function buildLogIndex(logs: HabitLog[]): Map<string, Set<string>> {
  const index = new Map<string, Set<string>>()
  for (const log of logs) {
    const set = index.get(log.habitId) ?? new Set<string>()
    set.add(log.date)
    index.set(log.habitId, set)
  }
  return index
}

export function isHabitDone(index: Map<string, Set<string>>, habitId: string, date: string): boolean {
  return index.get(habitId)?.has(date) ?? false
}

// --- per-habit stats ---------------------------------------------------------

export interface HabitMonthStats {
  goal: number
  actual: number
  left: number
  progress: number // 0-1
}

export function getHabitMonthStats(habitId: string, monthDays: Date[], index: Map<string, Set<string>>): HabitMonthStats {
  const doneSet = index.get(habitId)
  const actual = monthDays.reduce((total, day) => total + (doneSet?.has(toISODate(day)) ? 1 : 0), 0)
  const goal = monthDays.length
  return { goal, actual, left: goal - actual, progress: goal > 0 ? actual / goal : 0 }
}

/** Consecutive days completed, walking backward from `today` (or from yesterday if today isn't done yet). */
export function getStreak(habitId: string, index: Map<string, Set<string>>, today: Date = new Date()): number {
  const doneSet = index.get(habitId)
  if (!doneSet || doneSet.size === 0) return 0

  const cursor = new Date(today)
  if (!doneSet.has(toISODate(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
  }

  let streak = 0
  while (doneSet.has(toISODate(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

// --- aggregate stats -----------------------------------------------------------

export function getDailyCompletionRate(activeHabits: Habit[], index: Map<string, Set<string>>, date: string): number {
  if (activeHabits.length === 0) return 0
  const done = activeHabits.reduce((total, h) => total + (isHabitDone(index, h.id, date) ? 1 : 0), 0)
  return done / activeHabits.length
}

export interface DailyProgressPoint {
  date: string
  rate: number // 0-1
}

export function getDailyProgress(activeHabits: Habit[], monthDays: Date[], index: Map<string, Set<string>>): DailyProgressPoint[] {
  return monthDays.map((day) => {
    const date = toISODate(day)
    return { date, rate: getDailyCompletionRate(activeHabits, index, date) }
  })
}

export interface OverallMonthStats {
  goal: number
  completed: number
  left: number
  percent: number // 0-1
}

export function getOverallMonthStats(activeHabits: Habit[], monthDays: Date[], index: Map<string, Set<string>>): OverallMonthStats {
  const goal = activeHabits.length * monthDays.length
  const completed = activeHabits.reduce((total, h) => total + getHabitMonthStats(h.id, monthDays, index).actual, 0)
  return { goal, completed, left: goal - completed, percent: goal > 0 ? completed / goal : 0 }
}

// --- wellness -----------------------------------------------------------------

export function buildWellnessIndex(logs: WellnessLog[]): Map<string, WellnessLog> {
  return new Map(logs.map((log) => [log.date, log]))
}

export function getAverageSleep(logs: WellnessLog[]): number | null {
  const values = logs.map((l) => l.sleepHours).filter((v): v is number => v != null)
  if (values.length === 0) return null
  return values.reduce((a, b) => a + b, 0) / values.length
}

export function getAverageMood(logs: WellnessLog[]): number | null {
  const values = logs.map((l) => l.mood).filter((v): v is number => v != null)
  if (values.length === 0) return null
  return values.reduce((a, b) => a + b, 0) / values.length
}

// --- categories -----------------------------------------------------------

export const HABIT_CATEGORY_ORDER: HabitCategory[] = ['health', 'study']

export const HABIT_CATEGORY_LABELS: Record<HabitCategory, string> = {
  health: 'Sức khoẻ',
  study: 'Học tập',
}

export interface HabitCategoryGroup {
  category: HabitCategory
  label: string
  habits: Habit[]
}

/** Groups habits by category in a fixed display order; categories with no habits are omitted. */
export function groupHabitsByCategory(habits: Habit[]): HabitCategoryGroup[] {
  return HABIT_CATEGORY_ORDER.map((category) => ({
    category,
    label: HABIT_CATEGORY_LABELS[category],
    habits: habits.filter((h) => h.category === category),
  })).filter((group) => group.habits.length > 0)
}
