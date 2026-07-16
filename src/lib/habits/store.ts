import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { createDefaultHabits } from './seed'
import { storage } from './storage'
import type { Habit, HabitLog, WellnessLog } from './types'

interface HabitsState {
  hydrated: boolean
  habits: Habit[]
  logs: HabitLog[]
  wellnessLogs: WellnessLog[]

  hydrate: () => Promise<void>

  addHabit: (input: Pick<Habit, 'name' | 'icon' | 'color' | 'category'>) => Habit
  updateHabit: (id: string, patch: Partial<Omit<Habit, 'id'>>) => void
  deleteHabit: (id: string) => void

  toggleLog: (habitId: string, date: string) => void

  setWellness: (date: string, patch: Partial<Pick<WellnessLog, 'mood' | 'sleepHours'>>) => void
}

export const useHabitsStore = create<HabitsState>((set, get) => ({
  hydrated: false,
  habits: [],
  logs: [],
  wellnessLogs: [],

  hydrate: async () => {
    if (get().hydrated) return

    const [fetchedHabits, logs, wellnessLogs] = await Promise.all([
      storage.getHabits(),
      storage.getLogs(),
      storage.getWellnessLogs(),
    ])
    let habits = fetchedHabits

    if (habits.length === 0) {
      habits = createDefaultHabits()
      await storage.saveHabits(habits)
    }

    set({ hydrated: true, habits, logs, wellnessLogs })
  },

  addHabit: (input) => {
    const habit: Habit = {
      id: nanoid(),
      name: input.name,
      icon: input.icon,
      color: input.color,
      category: input.category,
      sortOrder: get().habits.length,
      archived: false,
      createdAt: new Date().toISOString(),
    }
    const habits = [...get().habits, habit]
    set({ habits })
    storage.saveHabits(habits).catch(console.error)
    return habit
  },

  updateHabit: (id, patch) => {
    const habits = get().habits.map((h) => (h.id === id ? { ...h, ...patch } : h))
    set({ habits })
    storage.saveHabits(habits).catch(console.error)
  },

  // Cascades: xoá luôn log của habit này.
  deleteHabit: (id) => {
    const habits = get().habits.filter((h) => h.id !== id)
    const logs = get().logs.filter((l) => l.habitId !== id)
    set({ habits, logs })
    storage.saveHabits(habits).catch(console.error)
    storage.saveLogs(logs).catch(console.error)
  },

  toggleLog: (habitId, date) => {
    const existing = get().logs.find((l) => l.habitId === habitId && l.date === date)
    const logs = existing
      ? get().logs.filter((l) => l.id !== existing.id)
      : [...get().logs, { id: nanoid(), habitId, date }]
    set({ logs })
    storage.saveLogs(logs).catch(console.error)
  },

  setWellness: (date, patch) => {
    const existing = get().wellnessLogs.find((w) => w.date === date)
    const next: WellnessLog = existing
      ? { ...existing, ...patch }
      : { id: date, date, mood: null, sleepHours: null, ...patch }
    const wellnessLogs = existing
      ? get().wellnessLogs.map((w) => (w.date === date ? next : w))
      : [...get().wellnessLogs, next]
    set({ wellnessLogs })
    storage.saveWellnessLogs(wellnessLogs).catch(console.error)
  },
}))
