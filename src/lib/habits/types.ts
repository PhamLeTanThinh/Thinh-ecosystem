export type HabitCategory = 'health' | 'study'

export interface Habit {
  id: string
  name: string
  icon: string
  color: string
  category: HabitCategory
  sortOrder: number
  archived: boolean
  createdAt: string
}

export interface HabitLog {
  id: string
  habitId: string
  date: string // 'YYYY-MM-DD'
}

export interface WellnessLog {
  id: string // = date
  date: string // 'YYYY-MM-DD'
  mood: number | null // 1-5
  sleepHours: number | null
}

export interface HabitsBackupData {
  habits: Habit[]
  logs: HabitLog[]
  wellnessLogs: WellnessLog[]
}
