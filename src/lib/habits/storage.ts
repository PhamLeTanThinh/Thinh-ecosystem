import type { Habit, HabitLog, WellnessLog } from './types'

async function getJSON<T>(url: string): Promise<T[]> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`)
  return res.json()
}

async function putJSON<T>(url: string, body: T[]): Promise<void> {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`PUT ${url} failed: ${res.status}`)
}

// Backed by Postgres via /api/habits/* — mirrors lib/money/storage.ts's bulk-replace convention.
export const storage = {
  getHabits: () => getJSON<Habit>('/api/habits/habits'),
  saveHabits: (habits: Habit[]) => putJSON('/api/habits/habits', habits),

  getLogs: () => getJSON<HabitLog>('/api/habits/logs'),
  saveLogs: (logs: HabitLog[]) => putJSON('/api/habits/logs', logs),

  getWellnessLogs: () => getJSON<WellnessLog>('/api/habits/wellness'),
  saveWellnessLogs: (logs: WellnessLog[]) => putJSON('/api/habits/wellness', logs),
}
