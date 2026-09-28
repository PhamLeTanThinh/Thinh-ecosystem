import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { storage } from './storage'
import { fromISODate, toISODate } from './date'
import type { DailyTodo, NoteKind, StickyNote, TimeBlock } from './types'

// Rich text fires onUpdate on every keystroke — if we PUT to the server on every change, requests
// can resolve out of order (an older request with shorter content lands later, overwriting freshly
// typed content). Debounce + flush-on-blur ensures only one request, representing the latest state,
// actually gets sent.
const SAVE_DEBOUNCE_MS = 400
let saveTimer: ReturnType<typeof setTimeout> | null = null
let pendingNotes: StickyNote[] | null = null

function scheduleSave(notes: StickyNote[]) {
  pendingNotes = notes
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    saveTimer = null
    const toSave = pendingNotes
    pendingNotes = null
    if (toSave) storage.saveNotes(toSave).catch(console.error)
  }, SAVE_DEBOUNCE_MS)
}

function flushSave() {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = null
  const toSave = pendingNotes
  pendingNotes = null
  if (toSave) storage.saveNotes(toSave).catch(console.error)
}

// A day's daily note = a timeline note carrying this tag (or containing an item copied from a
// DailyTodo template) — the tag shows up on the board so the user can tell which note was
// auto-generated.
export const DAILY_TAG = 'daily'

function isDailyNote(n: StickyNote, date: string) {
  return n.date === date && n.kind === 'timeline' && (n.tags.includes(DAILY_TAG) || n.timeBlocks.some((b) => b.dailyTodoId))
}

function blockFromTemplate(t: DailyTodo): TimeBlock {
  return { id: nanoid(), startTime: null, endTime: null, text: t.text, done: false, dailyTodoId: t.id }
}

function saveDailyTodos(todos: DailyTodo[]) {
  storage.saveDailyTodos(todos).catch(console.error)
}

// Two more auto-created notes alongside the Daily one, each ensured once per qualifying day: an
// empty WORK todo on weekdays (Mon-Fri) and an empty Personal note every day. Unlike Daily, these
// have no configurable template — they're always just empty, ready for the user to fill in that day.
export const WORK_TAG = 'WORK'
export const PERSONAL_TAG = 'Personal'

function hasTag(notes: StickyNote[], date: string, tag: string) {
  return notes.some((n) => n.date === date && n.tags.includes(tag))
}

// Once a WORK/Personal day is over with nothing added to it, the empty placeholder note is no
// longer useful — auto-remove it so old empty notes don't pile up. Daily is exempt (kept as-is even
// empty) since its whole point is a per-day checklist the user ticks off over time, not a
// fill-it-or-lose-it placeholder like the other two. Only applies to PAST days — never touches
// today's (still in progress) or a future day's note.
function isStaleEmptyAutoNote(n: StickyNote, todayISO: string): boolean {
  if (n.date >= todayISO) return false
  if (n.tags.includes(WORK_TAG) || n.tags.includes(PERSONAL_TAG)) return n.timeBlocks.length === 0
  return false
}

interface NotesState {
  hydrated: boolean
  notes: StickyNote[]
  dailyTodos: DailyTodo[]

  hydrate: () => Promise<void>

  addNote: (date: string, x: number, y: number, kind?: NoteKind) => StickyNote
  updateNote: (
    id: string,
    patch: Partial<Pick<StickyNote, 'header' | 'content' | 'color' | 'tags' | 'x' | 'y' | 'width' | 'height'>>,
  ) => void
  deleteNote: (id: string) => void
  deleteNotes: (ids: string[]) => void

  addTimeBlock: (noteId: string, startTime: string | null, endTime: string | null, text: string) => void
  toggleTimeBlockDone: (noteId: string, blockId: string) => void
  deleteTimeBlock: (noteId: string, blockId: string) => void
  updateTimeBlockText: (noteId: string, blockId: string, text: string) => void

  addDailyTodo: (text: string) => void
  updateDailyTodo: (id: string, text: string) => void
  deleteDailyTodo: (id: string) => void
  moveDailyTodo: (id: string, delta: -1 | 1) => void
  syncDailyNote: (date: string) => void
  syncWorkNote: (date: string) => void
  syncPersonalNote: (date: string) => void

  flushSave: () => void
}

export const useNotesStore = create<NotesState>((set, get) => ({
  hydrated: false,
  notes: [],
  dailyTodos: [],

  hydrate: async () => {
    if (get().hydrated) return
    const [loadedNotes, dailyTodos] = await Promise.all([storage.getNotes(), storage.getDailyTodos()])
    // Sweep once per app load: drop any past-day WORK/Personal note nobody filled in. Runs here
    // (not tied to whichever date the user happens to be viewing) so it catches every stale note
    // regardless of which day the board opens on.
    const today = toISODate(new Date())
    const notes = loadedNotes.filter((n) => !isStaleEmptyAutoNote(n, today))
    set({ hydrated: true, notes, dailyTodos })
    if (notes.length !== loadedNotes.length) scheduleSave(notes)
  },

  addNote: (date, x, y, kind = 'note') => {
    const note: StickyNote = {
      id: nanoid(),
      date,
      x,
      y,
      width: null,
      height: null,
      kind,
      header: '',
      content: '',
      color: null,
      tags: [],
      timeBlocks: [],
      createdAt: new Date().toISOString(),
    }
    const notes = [...get().notes, note]
    set({ notes })
    scheduleSave(notes)
    return note
  },

  updateNote: (id, patch) => {
    const notes = get().notes.map((n) => (n.id === id ? { ...n, ...patch } : n))
    set({ notes })
    scheduleSave(notes)
  },

  deleteNote: (id) => {
    const notes = get().notes.filter((n) => n.id !== id)
    set({ notes })
    scheduleSave(notes)
  },

  deleteNotes: (ids) => {
    const idSet = new Set(ids)
    const notes = get().notes.filter((n) => !idSet.has(n.id))
    set({ notes })
    scheduleSave(notes)
  },

  addTimeBlock: (noteId, startTime, endTime, text) => {
    const block: TimeBlock = { id: nanoid(), startTime, endTime, text, done: false }
    const notes = get().notes.map((n) => (n.id === noteId ? { ...n, timeBlocks: [...n.timeBlocks, block] } : n))
    set({ notes })
    scheduleSave(notes)
  },

  toggleTimeBlockDone: (noteId, blockId) => {
    const notes = get().notes.map((n) =>
      n.id === noteId
        ? { ...n, timeBlocks: n.timeBlocks.map((b) => (b.id === blockId ? { ...b, done: !b.done } : b)) }
        : n,
    )
    set({ notes })
    scheduleSave(notes)
  },

  deleteTimeBlock: (noteId, blockId) => {
    const notes = get().notes.map((n) =>
      n.id === noteId ? { ...n, timeBlocks: n.timeBlocks.filter((b) => b.id !== blockId) } : n,
    )
    set({ notes })
    scheduleSave(notes)
  },

  updateTimeBlockText: (noteId, blockId, text) => {
    const notes = get().notes.map((n) =>
      n.id === noteId
        ? { ...n, timeBlocks: n.timeBlocks.map((b) => (b.id === blockId ? { ...b, text } : b)) }
        : n,
    )
    set({ notes })
    scheduleSave(notes)
  },

  addDailyTodo: (text) => {
    const todo: DailyTodo = { id: nanoid(), text, createdAt: new Date().toISOString() }
    const dailyTodos = [...get().dailyTodos, todo]
    set({ dailyTodos })
    saveDailyTodos(dailyTodos)

    // If today already has a daily note, insert the new item straight into it; otherwise
    // syncDailyNote creates one with everything already in it.
    const today = toISODate(new Date())
    const dailyNote = get().notes.find((n) => isDailyNote(n, today))
    if (!dailyNote) {
      get().syncDailyNote(today)
      return
    }
    const notes = get().notes.map((n) =>
      n.id === dailyNote.id ? { ...n, timeBlocks: [...n.timeBlocks, blockFromTemplate(todo)] } : n,
    )
    set({ notes })
    scheduleSave(notes)
  },

  // Renaming a template also renames TODAY's copy (past days keep whatever text they had then).
  updateDailyTodo: (id, text) => {
    const dailyTodos = get().dailyTodos.map((t) => (t.id === id ? { ...t, text } : t))
    set({ dailyTodos })
    saveDailyTodos(dailyTodos)

    const today = toISODate(new Date())
    const notes = get().notes.map((n) =>
      n.date === today
        ? { ...n, timeBlocks: n.timeBlocks.map((b) => (b.dailyTodoId === id ? { ...b, text } : b)) }
        : n,
    )
    set({ notes })
    scheduleSave(notes)
  },

  // Deleting a template also removes today's UNFINISHED copy; an item already marked done today is
  // kept as history.
  deleteDailyTodo: (id) => {
    const dailyTodos = get().dailyTodos.filter((t) => t.id !== id)
    set({ dailyTodos })
    saveDailyTodos(dailyTodos)

    const today = toISODate(new Date())
    const notes = get().notes.map((n) =>
      n.date === today ? { ...n, timeBlocks: n.timeBlocks.filter((b) => b.dailyTodoId !== id || b.done) } : n,
    )
    set({ notes })
    scheduleSave(notes)
  },

  moveDailyTodo: (id, delta) => {
    const dailyTodos = [...get().dailyTodos]
    const i = dailyTodos.findIndex((t) => t.id === id)
    const j = i + delta
    if (i < 0 || j < 0 || j >= dailyTodos.length) return
    ;[dailyTodos[i], dailyTodos[j]] = [dailyTodos[j], dailyTodos[i]]
    set({ dailyTodos })
    saveDailyTodos(dailyTodos)
  },

  // Only CREATES the daily note if that date doesn't have one yet — never re-adds an item the user
  // deliberately removed from the note. A template added after the note already exists gets
  // inserted by addDailyTodo instead.
  syncDailyNote: (date) => {
    const { dailyTodos, notes } = get()
    if (dailyTodos.length === 0 || notes.some((n) => isDailyNote(n, date))) return
    const note: StickyNote = {
      id: nanoid(),
      date,
      x: 40,
      y: 40,
      width: null,
      height: null,
      kind: 'timeline',
      header: 'Daily',
      content: '',
      color: 'mint',
      tags: [DAILY_TAG],
      timeBlocks: dailyTodos.map(blockFromTemplate),
      createdAt: new Date().toISOString(),
    }
    const next = [...notes, note]
    set({ notes: next })
    scheduleSave(next)
  },

  // Empty timeline note tagged WORK, only ensured on weekdays (Mon-Fri) — weekends skip it entirely,
  // not even an empty one.
  syncWorkNote: (date) => {
    const day = fromISODate(date).getDay() // 0 = Sunday, 6 = Saturday
    if (day === 0 || day === 6) return
    const { notes } = get()
    if (hasTag(notes, date, WORK_TAG)) return
    const note: StickyNote = {
      id: nanoid(),
      date,
      x: 320,
      y: 40,
      width: null,
      height: null,
      kind: 'timeline',
      header: 'WORK',
      content: '',
      color: 'sky',
      tags: [WORK_TAG],
      timeBlocks: [],
      createdAt: new Date().toISOString(),
    }
    const next = [...notes, note]
    set({ notes: next })
    scheduleSave(next)
  },

  // Empty timeline note tagged Personal, ensured every day of the week (unlike WORK, not limited to weekdays).
  syncPersonalNote: (date) => {
    const { notes } = get()
    if (hasTag(notes, date, PERSONAL_TAG)) return
    const note: StickyNote = {
      id: nanoid(),
      date,
      x: 600,
      y: 40,
      width: null,
      height: null,
      kind: 'timeline',
      header: 'Personal',
      content: '',
      color: 'pink',
      tags: [PERSONAL_TAG],
      timeBlocks: [],
      createdAt: new Date().toISOString(),
    }
    const next = [...notes, note]
    set({ notes: next })
    scheduleSave(next)
  },

  flushSave,
}))
