import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { storage } from './storage'
import type { NoteKind, StickyNote, TimeBlock } from './types'

// Rich text bắn onUpdate mỗi phím gõ — nếu PUT thẳng lên server mỗi lần, các request có thể hoàn
// thành không đúng thứ tự (request cũ với nội dung ngắn hơn về sau, ghi đè mất chữ vừa gõ).
// Debounce + flush-khi-blur đảm bảo chỉ 1 request đại diện cho trạng thái mới nhất được gửi.
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

interface NotesState {
  hydrated: boolean
  notes: StickyNote[]

  hydrate: () => Promise<void>

  addNote: (date: string, x: number, y: number, kind?: NoteKind) => StickyNote
  updateNote: (
    id: string,
    patch: Partial<Pick<StickyNote, 'content' | 'color' | 'tags' | 'x' | 'y' | 'width' | 'height'>>,
  ) => void
  deleteNote: (id: string) => void
  deleteNotes: (ids: string[]) => void

  addTimeBlock: (noteId: string, startTime: string, endTime: string | null, text: string) => void
  toggleTimeBlockDone: (noteId: string, blockId: string) => void
  deleteTimeBlock: (noteId: string, blockId: string) => void

  flushSave: () => void
}

export const useNotesStore = create<NotesState>((set, get) => ({
  hydrated: false,
  notes: [],

  hydrate: async () => {
    if (get().hydrated) return
    const notes = await storage.getNotes()
    set({ hydrated: true, notes })
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

  flushSave,
}))
