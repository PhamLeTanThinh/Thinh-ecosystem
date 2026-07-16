'use client'

import Link from 'next/link'
import { useHabitsStore } from '@/lib/habits/store'
import { useHabitsUIStore } from '@/lib/habits/uiStore'
import { HabitDonut } from '@/components/habits/HabitDonut'
import { buildLogIndex, buildWellnessIndex, getStreak, isHabitDone, toISODate } from '@/lib/habits/calculations'

const WEEKDAY_LABELS_VN = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']

export default function HabitsTodayPage() {
  const habits = useHabitsStore((s) => s.habits)
  const logs = useHabitsStore((s) => s.logs)
  const wellnessLogs = useHabitsStore((s) => s.wellnessLogs)
  const toggleLog = useHabitsStore((s) => s.toggleLog)
  const openAddHabit = useHabitsUIStore((s) => s.openAddHabit)

  const today = new Date()
  const todayISO = toISODate(today)
  const index = buildLogIndex(logs)
  const wellnessIndex = buildWellnessIndex(wellnessLogs)
  const activeHabits = habits.filter((h) => !h.archived)

  const doneCount = activeHabits.reduce((total, h) => total + (isHabitDone(index, h.id, todayISO) ? 1 : 0), 0)
  const percent = activeHabits.length > 0 ? doneCount / activeHabits.length : 0
  const todayWellness = wellnessIndex.get(todayISO)

  return (
    <div>
      <div className="px-4 pt-6">
        <p className="text-sm text-muted">{WEEKDAY_LABELS_VN[today.getDay()]}</p>
        <h1 className="text-lg font-bold">Hôm nay, {String(today.getDate()).padStart(2, '0')}/{String(today.getMonth() + 1).padStart(2, '0')}</h1>
      </div>

      <div className="mt-4 flex justify-center px-4">
        <HabitDonut percent={percent} label={`${doneCount}/${activeHabits.length} thói quen`} sublabel="Hoàn thành hôm nay" />
      </div>

      <div className="mt-6 px-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Danh sách hôm nay</h2>
          <button type="button" onClick={() => openAddHabit()} className="text-xs font-medium text-accent">
            + Thêm thói quen
          </button>
        </div>

        <div className="flex flex-col gap-2 pb-4">
          {activeHabits.length === 0 && (
            <p className="rounded-card bg-card py-10 text-center text-sm text-muted">Chưa có thói quen nào. Nhấn &quot;Thêm thói quen&quot; để bắt đầu.</p>
          )}
          {activeHabits.map((habit) => {
            const done = isHabitDone(index, habit.id, todayISO)
            const streak = getStreak(habit.id, index, today)
            return (
              <div key={habit.id} className="flex items-center gap-3 rounded-card bg-card p-3">
                <button
                  type="button"
                  onClick={() => toggleLog(habit.id, todayISO)}
                  aria-pressed={done}
                  aria-label={`Đánh dấu ${habit.name}`}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl transition-transform active:scale-90"
                  style={{ backgroundColor: done ? habit.color : 'var(--color-card-soft)' }}
                >
                  {done ? <span className="text-black">✓</span> : habit.icon}
                </button>
                <button type="button" onClick={() => openAddHabit(habit.id)} className="flex-1 text-left">
                  <span className={`block text-sm font-medium ${done ? 'text-muted line-through' : ''}`}>{habit.name}</span>
                  {streak > 0 && <span className="text-xs text-danger">🔥 {streak} ngày liên tiếp</span>}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="px-4 pb-6">
        <Link href="/habits/wellness" className="flex items-center justify-between rounded-card bg-card p-4">
          <span className="flex items-center gap-3 text-sm">
            <span className="text-xl">🌙</span>
            {todayWellness?.mood != null || todayWellness?.sleepHours != null ? 'Đã ghi nhận sức khoẻ hôm nay' : 'Ghi nhận tâm trạng & giấc ngủ hôm nay'}
          </span>
          <span className="text-muted">›</span>
        </Link>
      </div>
    </div>
  )
}
