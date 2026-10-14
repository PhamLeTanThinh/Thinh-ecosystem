export type NoteColor = 'yellow' | 'pink' | 'mint' | 'sky' | 'lavender'

export const NOTE_COLORS: NoteColor[] = ['yellow', 'pink', 'mint', 'sky', 'lavender']

// 'note' = a regular rich-text note (default). 'timeline' = a different kind of "note" entirely —
// its body isn't rich text but a list of timeBlocks — chosen at creation time (see NotesBoard.tsx),
// can't be switched afterwards.
// 'vocab' = a two-column word list (foreign term | Vietnamese meaning), only offered on the Overall board.
export type NoteKind = 'note' | 'timeline' | 'vocab'

// A single row in a 'vocab' note — both sides typed by the user.
export interface VocabEntry {
  id: string
  term: string // foreign-language word/phrase, shown bold
  meaning: string // Vietnamese meaning
  done?: boolean // ticked off (e.g. learned) — optional so rows saved before the checkbox existed still load
}

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

// Sentinel `date` for the "Overall" space — notes that don't belong to any particular day (only
// filtered by tag, never by date). Stored in the same `date` column, so it must be skipped anywhere
// that parses `date` as a real day (date tree, calendar, ...).
export const OVERALL_DATE = 'overall'

export function isOverallNote(n: { date: string }): boolean {
  return n.date === OVERALL_DATE
}

export interface StickyNote {
  id: string
  date: string // 'YYYY-MM-DD' — which day "space" this note belongs to, or OVERALL_DATE
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
  vocab: VocabEntry[] // only used when kind === 'vocab'
  topicId: string | null // only for Overall notes — the NoteTopic board it sits on; null = Uncategorized
  createdAt: string
}

// A user-defined topic in the Overall view — each one is its own board of notes (see StickyNote.topicId).
export interface NoteTopic {
  id: string
  title: string
  createdAt: string
}
