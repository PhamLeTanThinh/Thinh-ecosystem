import { nanoid } from 'nanoid'
import type { Habit, HabitCategory } from './types'

export function createDefaultHabits(): Habit[] {
  const make = (name: string, icon: string, color: string, category: HabitCategory, sortOrder: number): Habit => ({
    id: nanoid(),
    name,
    icon,
    color,
    category,
    sortOrder,
    archived: false,
    createdAt: new Date().toISOString(),
  })

  return [
    make('Dậy sớm', '⏰', '#f5a524', 'health', 0),
    make('Tập gym', '💪', '#22c55e', 'health', 1),
    make('Uống đủ nước', '💧', '#0ea5e9', 'health', 2),
    make('Không rượu bia', '🍺', '#ef4444', 'health', 3),
    make('Hạn chế mạng xã hội', '🌿', '#10b981', 'health', 4),
    make('Đọc sách / Học', '📖', '#38bdf8', 'study', 5),
    make('Lên kế hoạch ngày', '🗓️', '#a78bfa', 'study', 6),
    make('Làm dự án cá nhân', '🎯', '#f97316', 'study', 7),
  ]
}
