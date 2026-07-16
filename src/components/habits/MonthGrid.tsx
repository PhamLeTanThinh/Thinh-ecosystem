'use client'

import { Fragment } from 'react'
import { groupHabitsByCategory, isHabitDone, isSameDay, toISODate, WEEKDAY_SHORT_VN } from '@/lib/habits/calculations'
import type { Habit } from '@/lib/habits/types'
import { useHabitsUIStore } from '@/lib/habits/uiStore'

interface MonthGridProps {
  habits: Habit[]
  monthDays: Date[]
  index: Map<string, Set<string>>
  onToggle: (habitId: string, date: string) => void
}

const CELL_SIZE = 34
const NAME_COL_WIDTH = 152

export function MonthGrid({ habits, monthDays, index, onToggle }: MonthGridProps) {
  const openAddHabit = useHabitsUIStore((s) => s.openAddHabit)
  const today = new Date()
  const groups = groupHabitsByCategory(habits)

  return (
    <div className="overflow-x-auto rounded-card border border-border">
      <div
        className="grid w-max"
        style={{ gridTemplateColumns: `${NAME_COL_WIDTH}px repeat(${monthDays.length}, ${CELL_SIZE}px)` }}
      >
        <div className="sticky left-0 z-10 flex items-center border-b border-border bg-card px-3 py-2 text-xs font-medium text-muted">
          Thói quen
        </div>
        {monthDays.map((day) => {
          const today_ = isSameDay(day, today)
          return (
            <div
              key={toISODate(day)}
              className={`flex flex-col items-center justify-center border-b border-l border-border py-1.5 text-[10px] ${
                today_ ? 'bg-accent-soft font-semibold text-accent' : 'text-muted'
              }`}
            >
              <span>{WEEKDAY_SHORT_VN[day.getDay()]}</span>
              <span>{day.getDate()}</span>
            </div>
          )
        })}

        {habits.length === 0 && (
          <div className="col-span-full flex flex-col items-center gap-2 border-t border-border px-4 py-10 text-center text-sm text-muted">
            Chưa có thói quen nào.
            <button type="button" onClick={() => openAddHabit()} className="font-medium text-accent">
              Thêm thói quen đầu tiên
            </button>
          </div>
        )}

        {groups.map((group) => (
          <Fragment key={group.category}>
            <div
              className="border-b border-border bg-card-soft px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted"
              style={{ gridColumn: '1 / -1' }}
            >
              {group.label}
            </div>
            {group.habits.map((habit) => (
              <HabitGridRow key={habit.id} habit={habit} monthDays={monthDays} index={index} onToggle={onToggle} />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

function HabitGridRow({
  habit,
  monthDays,
  index,
  onToggle,
}: {
  habit: Habit
  monthDays: Date[]
  index: Map<string, Set<string>>
  onToggle: (habitId: string, date: string) => void
}) {
  const openAddHabit = useHabitsUIStore((s) => s.openAddHabit)

  return (
    <>
      <button
        type="button"
        onClick={() => openAddHabit(habit.id)}
        className="sticky left-0 z-10 flex items-center gap-2 border-b border-border bg-card px-3 py-2 text-left text-sm"
      >
        <span className="shrink-0">{habit.icon}</span>
        <span className="truncate">{habit.name}</span>
      </button>
      {monthDays.map((day) => {
        const date = toISODate(day)
        const done = isHabitDone(index, habit.id, date)
        return (
          <button
            key={date}
            type="button"
            onClick={() => onToggle(habit.id, date)}
            aria-pressed={done}
            aria-label={`${habit.name} ${date}`}
            className="flex items-center justify-center border-b border-l border-border transition-colors"
            style={{ backgroundColor: done ? habit.color : undefined }}
          >
            {done && <span className="text-xs text-black">✓</span>}
          </button>
        )
      })}
    </>
  )
}
