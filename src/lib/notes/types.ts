export type NoteColor = 'yellow' | 'pink' | 'mint' | 'sky' | 'lavender'

export const NOTE_COLORS: NoteColor[] = ['yellow', 'pink', 'mint', 'sky', 'lavender']

// 'note' = a regular rich-text note (default). 'timeline' = a different kind of "note" entirely —
// its body isn't rich text but a list of timeBlocks — chosen at creation time (see NotesBoard.tsx),
// can't be switched afterwards.
export type NoteKind = 'note' | 'timeline'

// A single item in a 'timeline' note. `startTime` empty = shows as a plain todo-list item (just a
// checkbox + text); with a time = shows as a schedule entry (vertical timeline, sorted by time). A
// timeline note can mix both kinds, and can have MULTIPLE consecutive timed entries in the same day
// (e.g. 9-10am task1, 10am-3pm task2).
export interface TimeBlock {
  id: string
  startTime: string | null // 'HH:mm' | null
  endTime: string | null // 'HH:mm' | null — optional even when startTime is set
  text: string
  done: boolean
  // Set = this item was copied from a DailyTodo template (the template's id) — used to know which
  // templates are already present in the day's note, so syncing doesn't add duplicates.
  dailyTodoId?: string
}

// A template for a task that repeats every day — array order = order shown in the daily note.
export interface DailyTodo {
  id: string
  text: string
  createdAt: string
}

export interface StickyNote {
  id: string
  date: string // 'YYYY-MM-DD' — which day "space" this note belongs to
  x: number
  y: number
  width: number | null
  height: number | null
  kind: NoteKind
  header: string // optional short title shown at the top of the note; '' = no header shown. Editable on any note; the 3 auto-created notes (Daily/WORK/Personal) just start with one pre-filled.
  content: string // rich text HTML — only used when kind === 'note'
  color: NoteColor | null
  tags: string[]
  timeBlocks: TimeBlock[] // only used when kind === 'timeline'
  createdAt: string
}
