'use client'

import { useState } from 'react'
import { useHabitsStore } from '@/lib/habits/store'
import { useHabitsUIStore } from '@/lib/habits/uiStore'
import { HABIT_CATEGORY_LABELS, HABIT_CATEGORY_ORDER } from '@/lib/habits/calculations'
import type { HabitCategory } from '@/lib/habits/types'
import { BottomSheet } from '../BottomSheet'
import { SheetHeader } from '../SheetHeader'

const ICON_PRESETS = ['⏰', '💪', '📖', '🗓️', '💧', '🎯', '🍺', '🌿', '🧘', '🏃', '🥗', '💊', '🚭', '📵', '💰', '🎨']
const COLOR_PRESETS = ['#f5a524', '#22c55e', '#38bdf8', '#a78bfa', '#0ea5e9', '#f97316', '#ef4444', '#10b981', '#ec4899', '#eab308']

export function AddHabitModal() {
  const open = useHabitsUIStore((s) => s.addHabitOpen)
  const resetKey = useHabitsUIStore((s) => s.addHabitKey)
  const close = useHabitsUIStore((s) => s.closeAddHabit)
  const editingHabitId = useHabitsUIStore((s) => s.editingHabitId)

  return (
    <BottomSheet open={open} onClose={close}>
      <AddHabitForm key={resetKey} onClose={close} editingHabitId={editingHabitId} />
    </BottomSheet>
  )
}

function AddHabitForm({ onClose, editingHabitId }: { onClose: () => void; editingHabitId: string | null }) {
  const habits = useHabitsStore((s) => s.habits)
  const addHabit = useHabitsStore((s) => s.addHabit)
  const updateHabit = useHabitsStore((s) => s.updateHabit)
  const deleteHabit = useHabitsStore((s) => s.deleteHabit)

  const editingHabit = editingHabitId ? habits.find((h) => h.id === editingHabitId) ?? null : null

  const [name, setName] = useState(editingHabit?.name ?? '')
  const [icon, setIcon] = useState(editingHabit?.icon ?? ICON_PRESETS[0])
  const [color, setColor] = useState(editingHabit?.color ?? COLOR_PRESETS[0])
  const [category, setCategory] = useState<HabitCategory>(editingHabit?.category ?? 'health')

  function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) return
    if (editingHabit) {
      updateHabit(editingHabit.id, { name: trimmed, icon, color, category })
    } else {
      addHabit({ name: trimmed, icon, color, category })
    }
    onClose()
  }

  function handleDelete() {
    if (!editingHabit) return
    if (!window.confirm(`Xoá thói quen "${editingHabit.name}"? Toàn bộ lịch sử tick của thói quen này cũng sẽ bị xoá.`)) return
    deleteHabit(editingHabit.id)
    onClose()
  }

  return (
    <>
      <SheetHeader title={editingHabit ? 'Sửa thói quen' : 'Thêm thói quen'} onCancel={onClose} />

      <div className="p-4">
        <label className="text-xs font-medium text-muted" htmlFor="habit-name">
          Tên thói quen
        </label>
        <input
          id="habit-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="VD: Tập gym, Đọc sách..."
          className="mt-2 w-full rounded-card border border-border bg-card-soft px-4 py-3 text-sm outline-none focus:border-accent"
          autoFocus
        />
      </div>

      <div className="px-4 pb-2">
        <p className="text-xs font-medium text-muted">Nhóm</p>
        <div className="mt-2 flex gap-2">
          {HABIT_CATEGORY_ORDER.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setCategory(option)}
              aria-pressed={category === option}
              className={`flex-1 rounded-pill py-2 text-sm font-medium transition-colors duration-200 ${
                category === option ? 'bg-accent text-black' : 'bg-card-soft text-muted'
              }`}
            >
              {HABIT_CATEGORY_LABELS[option]}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-2">
        <p className="text-xs font-medium text-muted">Biểu tượng</p>
        <div className="mt-2 grid grid-cols-8 gap-2">
          {ICON_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setIcon(preset)}
              aria-pressed={icon === preset}
              className={`flex h-9 w-9 items-center justify-center rounded-card text-lg transition-colors ${
                icon === preset ? 'bg-accent-soft ring-2 ring-accent' : 'bg-card-soft'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">
        <p className="text-xs font-medium text-muted">Màu sắc</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setColor(preset)}
              aria-pressed={color === preset}
              aria-label={`Chọn màu ${preset}`}
              className={`h-8 w-8 shrink-0 rounded-full transition-transform ${color === preset ? 'scale-110 ring-2 ring-offset-2 ring-offset-card' : ''}`}
              style={{ backgroundColor: preset, ...(color === preset ? { boxShadow: `0 0 0 2px ${preset}` } : {}) }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3 px-4 py-4">
        {editingHabit && (
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-pill border border-danger px-5 py-3.5 text-sm font-semibold text-danger"
          >
            Xoá
          </button>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={!name.trim()}
          className="flex-1 rounded-pill bg-accent py-3.5 text-sm font-semibold text-black disabled:opacity-40"
        >
          {editingHabit ? 'Lưu thay đổi' : 'Lưu'}
        </button>
      </div>
    </>
  )
}
