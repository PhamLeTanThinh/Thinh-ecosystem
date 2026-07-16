'use client'

import { useState } from 'react'
import { useHabitsStore } from '@/lib/habits/store'
import { MonthGrid } from '@/components/habits/MonthGrid'
import { buildLogIndex, getMonthCursor, getMonthDays, getMonthLabel, getOverallMonthStats } from '@/lib/habits/calculations'

export default function HabitsGridPage() {
  const [monthOffset, setMonthOffset] = useState(0)
  const habits = useHabitsStore((s) => s.habits)
  const logs = useHabitsStore((s) => s.logs)
  const toggleLog = useHabitsStore((s) => s.toggleLog)

  const activeHabits = habits.filter((h) => !h.archived)
  const cursor = getMonthCursor(monthOffset)
  const monthDays = getMonthDays(cursor)
  const index = buildLogIndex(logs)
  const overall = getOverallMonthStats(activeHabits, monthDays, index)

  return (
    <div>
      <div className="flex items-center justify-between px-4 pt-6">
        <h1 className="text-lg font-bold">Lưới theo dõi tháng</h1>
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

      <div className="mt-4 grid grid-cols-3 gap-2 px-4 text-center">
        <div className="rounded-card bg-card p-3">
          <p className="text-xs text-muted">Mục tiêu</p>
          <p className="mt-1 text-sm font-semibold">{overall.goal}</p>
        </div>
        <div className="rounded-card bg-card p-3">
          <p className="text-xs text-muted">Đã hoàn thành</p>
          <p className="mt-1 text-sm font-semibold text-accent">{overall.completed}</p>
        </div>
        <div className="rounded-card bg-card p-3">
          <p className="text-xs text-muted">Còn lại</p>
          <p className="mt-1 text-sm font-semibold">{overall.left}</p>
        </div>
      </div>

      <div className="mt-4 px-4 pb-6">
        <MonthGrid habits={activeHabits} monthDays={monthDays} index={index} onToggle={toggleLog} />
      </div>
    </div>
  )
}
