'use client'

import { useState } from 'react'
import { useNotesStore } from '@/lib/notes/store'
import { useNotesConfirm } from './ConfirmDialog'

interface Props {
  onClose: () => void
}

// Configures tasks that repeat every day. Every day, "today" automatically gets a timeline note
// (tagged "daily") containing a copy of these tasks, so each day can be ticked off separately — see
// syncDailyNote in lib/notes/store.ts.
export function DailyTodoPanel({ onClose }: Props) {
  const dailyTodos = useNotesStore((s) => s.dailyTodos)
  const addDailyTodo = useNotesStore((s) => s.addDailyTodo)
  const updateDailyTodo = useNotesStore((s) => s.updateDailyTodo)
  const deleteDailyTodo = useNotesStore((s) => s.deleteDailyTodo)
  const moveDailyTodo = useNotesStore((s) => s.moveDailyTodo)
  const confirm = useNotesConfirm()
  const [draft, setDraft] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!draft.trim()) return
    addDailyTodo(draft.trim())
    setDraft('')
  }

  return (
    <aside className="nt-timeline-panel">
      <div className="nt-sidebar-header">
        <span>Daily todo — repeats every day</span>
        <button type="button" aria-label="Close daily todo" onClick={onClose}>
          ×
        </button>
      </div>

      <form className="nt-timeline-add" onSubmit={handleSubmit}>
        <div className="nt-timeline-add-text">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a daily task..."
            aria-label="Daily task"
          />
          <button type="submit">+</button>
        </div>
      </form>

      {dailyTodos.length === 0 ? (
        <p className="nt-tree-empty">No tasks yet — add one above, and every day will automatically get a &quot;daily&quot; note containing these tasks.</p>
      ) : (
        <ul className="nt-daily-list">
          {dailyTodos.map((t, i) => (
            <li key={t.id} className="nt-daily-item">
              <DailyTodoText text={t.text} onSave={(text) => updateDailyTodo(t.id, text)} />
              <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => moveDailyTodo(t.id, -1)}>
                ↑
              </button>
              <button
                type="button"
                aria-label="Move down"
                disabled={i === dailyTodos.length - 1}
                onClick={() => moveDailyTodo(t.id, 1)}
              >
                ↓
              </button>
              <button
                type="button"
                aria-label="Delete task"
                onClick={() => {
                  confirm(`Remove "${t.text}" from daily todo?`).then((ok) => ok && deleteDailyTodo(t.id))
                }}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="nt-daily-hint">
        Edits/deletes here only apply from today onward — past days keep whatever they had at the time.
      </p>
    </aside>
  )
}

// Inline rename — only saves on blur/Enter (not on every keystroke) to avoid firing a PUT constantly.
function DailyTodoText({ text, onSave }: { text: string; onSave: (text: string) => void }) {
  const [value, setValue] = useState(text)

  function commit() {
    const next = value.trim()
    if (!next) setValue(text)
    else if (next !== text) onSave(next)
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
      aria-label="Task name"
    />
  )
}
