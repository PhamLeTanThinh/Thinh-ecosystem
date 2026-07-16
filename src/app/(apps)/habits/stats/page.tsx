'use client'

import { useState } from 'react'
import { useHabitsStore } from '@/lib/habits/store'
import { useHabitsUIStore } from '@/lib/habits/uiStore'
import { HabitDonut } from '@/components/habits/HabitDonut'
import { DailyProgressChart } from '@/components/habits/DailyProgressChart'
import { HabitAnalysisRow } from '@/components/habits/HabitAnalysisRow'
import {
  buildLogIndex,
  getDailyProgress,
  getHabitMonthStats,
  getMonthCursor,
  getMonthDays,
  getMonthLabel,
  getOverallMonthStats,
  getStreak,
} from '@/lib/habits/calculations'

export default function HabitsStatsPage() {
  const [monthOffset, setMonthOffset] = useState(0)
  const habits = useHabitsStore((s) => s.habits)
  const logs = useHabitsStore((s) => s.logs)
  const openAddHabit = useHabitsUIStore((s) => s.openAddHabit)

  const activeHabits = habits.filter((h) => !h.archived)
  const cursor = getMonthCursor(monthOffset)
  const monthDays = getMonthDays(cursor)
  const index = buildLogIndex(logs)
  const overall = getOverallMonthStats(activeHabits, monthDays, index)
  const dailyProgress = getDailyProgress(activeHabits, monthDays, index)

  return (
    <div>
      <div className="flex items-center justify-between px-4 pt-6">
        <h1 className="text-lg font-bold">Thống kê</h1>
      </div>

      <div className="mt-3 flex items-center justify-between px-4">
        <button type="button" onClick={() => setMonthOffset((o) => o - 1)} aria-label="Tháng trước" className="text-muted">
          ‹
        </button>
        <span className="text-sm font-semibold">{getMonthLabel(cursor)}</span>
        <button type="button" onClick={() => setMonthOffset((o) => o + 1)} aria-label="Tháng sau" className="text-muted">
          ›
        </button>
      </div>

      <div className="mx-4 mt-4 rounded-card bg-card p-5">
        <div className="flex justify-center">
          <HabitDonut percent={overall.percent} label={`${overall.completed}/${overall.goal}`} sublabel="Tổng hoàn thành" />
        </div>

        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-muted">Tiến độ theo ngày</p>
          <DailyProgressChart data={dailyProgress} />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 px-4 pb-6">
        {activeHabits.length === 0 && <p className="py-10 text-center text-sm text-muted">Chưa có thói quen nào.</p>}
        {activeHabits.map((habit) => (
          <HabitAnalysisRow
            key={habit.id}
            habit={habit}
            stats={getHabitMonthStats(habit.id, monthDays, index)}
            streak={getStreak(habit.id, index)}
            onClick={() => openAddHabit(habit.id)}
          />
        ))}
      </div>
    </div>
  )
}
