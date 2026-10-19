import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { storage } from './storage'
import { fromISODate, toISODate } from './date'
import { isOverallNote, type DailyTodo, type NoteColor, type NoteKind, type NoteTopic, type NoteTopicKind,type StickyNote, type TimeBlock, type VocabEntry } from './types'

// Where a dragged topic/folder lands relative to the row it's dropped on: above/below it (same
// level as that row), or inside it (folders only) as its last topic.
export type TopicDropPos = 'before' | 'after' | 'inside'

// Can `id` be dropped on `targetId` at `pos` without breaking the 2-level limit? Only folders take
// things inside them; a folder (or a topic that still has sub-topics) stays at the top level.
export function canMoveTopic(topics: NoteTopic[], id: string, targetId: string, pos: TopicDropPos): boolean {
  if (id === targetId) return false
  const moving = topics.find((t) => t.id === id)
  const target = topics.find((t) => t.id === targetId)
  if (!moving || !target) return false
  if (pos === 'inside' && target.kind !== 'folder') return false
  const newParent = pos === 'inside' ? target.id : target.parentId
  if (!newParent) return true
  return newParent !== id && moving.kind !== 'folder' && !topics.some((t) => t.parentId === id)
}

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

function saveTopics(topics: NoteTopic[]) {
  storage.saveTopics(topics).catch(console.error)
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
// longer useful — auto-remove it so old empty notes don't pile up. Same for a Daily note left
// exactly as syncDailyNote created it (see isUntouchedDailyNote). Only applies to PAST days — never
// touches today's (still in progress) or a future day's note.
function isStaleEmptyAutoNote(n: StickyNote, todayISO: string, dailyTodos: DailyTodo[]): boolean {
  if (isOverallNote(n) || n.date >= todayISO) return false
  if (n.tags.includes(WORK_TAG) || n.tags.includes(PERSONAL_TAG)) return n.timeBlocks.length === 0
  if (isDailyNote(n, n.date)) return isUntouchedDailyNote(n, dailyTodos)
  return false
}

// A Daily note nobody acted on that day: every item is still an unticked, untimed copy of a
// template with the template's text, nothing added, and the header/tags/content not edited.
// Moving or resizing the note doesn't count as acting on it. An item whose template has since been
// deleted can't be compared, so its text alone doesn't keep the note.
function isUntouchedDailyNote(n: StickyNote, dailyTodos: DailyTodo[]): boolean {
  if (n.header !== 'Daily' || n.content || n.vocab.length) return false
  if (n.tags.length !== 1 || n.tags[0] !== DAILY_TAG) return false
  const templateText = new Map(dailyTodos.map((t) => [t.id, t.text]))
  return n.timeBlocks.every(
    (b) =>
      b.dailyTodoId &&
      !b.done &&
      !b.startTime &&
      !b.endTime &&
      (!templateText.has(b.dailyTodoId) || templateText.get(b.dailyTodoId) === b.text),
  )
}

interface NotesState {
  hydrated: boolean
  notes: StickyNote[]
  dailyTodos: DailyTodo[]

  hydrate: () => Promise<void>

  topics: NoteTopic[]

  addNote: (date: string, x: number, y: number, kind?: NoteKind, topicId?: string | null) => StickyNote
  updateNote: (
    id: string,
    patch: Partial<Pick<StickyNote, 'header' | 'content' | 'color' | 'tags' | 'x' | 'y' | 'width' | 'height' | 'vocabSplit'>>,
  ) => void
  deleteNote: (id: string) => void
  deleteNotes: (ids: string[]) => void

  addTimeBlock: (noteId: string, startTime: string | null, endTime: string | null, text: string) => void
  toggleTimeBlockDone: (noteId: string, blockId: string) => void
  deleteTimeBlock: (noteId: string, blockId: string) => void
  updateTimeBlockText: (noteId: string, blockId: string, text: string) => void

  addVocab: (noteId: string, term: string, meaning: string) => void
  updateVocab: (noteId: string, entryId: string, patch: Partial<Pick<VocabEntry, 'term' | 'meaning' | 'done'>>) => void
  deleteVocab: (noteId: string, entryId: string) => void

  addDailyTodo: (text: string) => void
  updateDailyTodo: (id: string, text: string) => void
  deleteDailyTodo: (id: string) => void
  moveDailyTodo: (id: string, delta: -1 | 1) => void
  syncDailyNote: (date: string) => void
  syncWorkNote: (date: string) => void
  syncPersonalNote: (date: string) => void

  addTopic: (title: string, kind?: NoteTopicKind, parentId?: string | null) => NoteTopic
  setTopicParent: (id: string, parentId: string | null) => void
  renameTopic: (id: string, title: string) => void
  setTopicColor: (id: string, color: NoteColor | null) => void
  moveTopic: (id: string, targetId: string, pos: TopicDropPos) => void
  claimUncategorized: (title: string) => NoteTopic
  deleteTopic: (id: string) => void

  flushSave: () => void
}

export const useNotesStore = create<NotesState>((set, get) => ({
  hydrated: false,
  notes: [],
  dailyTodos: [],
  topics: [],

  hydrate: async () => {
    if (get().hydrated) return
    const [loadedNotes, dailyTodos, topics] = await Promise.all([
      storage.getNotes(),
      storage.getDailyTodos(),
      storage.getTopics(),
    ])
    // Sweep once per app load: drop any past-day WORK/Personal/Daily note nobody acted on. Runs here
    // (not tied to whichever date the user happens to be viewing) so it catches every stale note
    // regardless of which day the board opens on.
    const today = toISODate(new Date())
    const notes = loadedNotes.filter((n) => !isStaleEmptyAutoNote(n, today, dailyTodos))
    set({ hydrated: true, notes, dailyTodos, topics })
    if (notes.length !== loadedNotes.length) scheduleSave(notes)
  },

  addNote: (date, x, y, kind = 'note', topicId = null) => {
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
      vocab: [],
      topicId,
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

  addVocab: (noteId, term, meaning) => {
    const entry: VocabEntry = { id: nanoid(), term, meaning }
    const notes = get().notes.map((n) => (n.id === noteId ? { ...n, vocab: [...(n.vocab ?? []), entry] } : n))
    set({ notes })
    scheduleSave(notes)
  },

  updateVocab: (noteId, entryId, patch) => {
    const notes = get().notes.map((n) =>
      n.id === noteId ? { ...n, vocab: n.vocab.map((v) => (v.id === entryId ? { ...v, ...patch } : v)) } : n,
    )
    set({ notes })
    scheduleSave(notes)
  },

  deleteVocab: (noteId, entryId) => {
    const notes = get().notes.map((n) => (n.id === noteId ? { ...n, vocab: n.vocab.filter((v) => v.id !== entryId) } : n))
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
      vocab: [],
      topicId: null,
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
      vocab: [],
      topicId: null,
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
      vocab: [],
      topicId: null,
      createdAt: new Date().toISOString(),
    }
    const next = [...notes, note]
    set({ notes: next })
    scheduleSave(next)
  },

  addTopic: (title, kind = 'topic', parentId = null) => {
    const topic: NoteTopic = { id: nanoid(), title, kind, parentId, color: null, createdAt: new Date().toISOString() }
    const topics = [...get().topics, topic]
    set({ topics })
    saveTopics(topics)
    return topic
  },

  renameTopic: (id, title) => {
    const topics = get().topics.map((t) => (t.id === id ? { ...t, title } : t))
    set({ topics })
    saveTopics(topics)
  },

  setTopicColor: (id, color) => {
    const topics = get().topics.map((t) => (t.id === id ? { ...t, color } : t))
    set({ topics })
    saveTopics(topics)
  },

  // "Move to folder" from the right-click menu: put the topic last in that folder (or last at the
  // top level for parentId = null). Same 2-level rules as dragging.
  setTopicParent: (id, parentId) => {
    const all = get().topics
    const moving = all.find((t) => t.id === id)
    if (!moving || moving.parentId === parentId) return
    if (parentId && !canMoveTopic(all, id, parentId, 'inside')) return
    const topics = [...all.filter((t) => t.id !== id), { ...moving, parentId }]
    set({ topics })
    saveTopics(topics)
  },

  // The list is stored flat; the sidebar shows top-level topics in array order with each one's
  // sub-topics (also in array order) under it — so moving = re-parent + reposition in the array.
  moveTopic: (id, targetId, pos) => {
    const all = get().topics
    if (!canMoveTopic(all, id, targetId, pos)) return
    const moving = all.find((t) => t.id === id)!
    const target = all.find((t) => t.id === targetId)!
    const rest = all.filter((t) => t.id !== id)
    const moved = { ...moving, parentId: pos === 'inside' ? target.id : target.parentId }
    const topics =
      pos === 'inside'
        ? [...rest, moved]
        : (() => {
            const i = rest.findIndex((t) => t.id === targetId) + (pos === 'after' ? 1 : 0)
            return [...rest.slice(0, i), moved, ...rest.slice(i)]
          })()
    set({ topics })
    saveTopics(topics)
  },

  // "Renaming" Uncategorized = turning it into a real topic: create the topic and move every Overall
  // note that has no topic onto it.
  claimUncategorized: (title) => {
    const topic = get().addTopic(title)
    const notes = get().notes.map((n) => (isOverallNote(n) && !n.topicId ? { ...n, topicId: topic.id } : n))
    set({ notes })
    scheduleSave(notes)
    return topic
  },

  // A topic IS its board — deleting it also deletes every note on it, and its sub-topics with their
  // notes (the UI confirms first). Deleting a folder only removes the folder: its topics move back
  // to the top level, nothing else is lost.
  deleteTopic: (id) => {
    if (get().topics.find((t) => t.id === id)?.kind === 'folder') {
      const topics = get()
        .topics.filter((t) => t.id !== id)
        .map((t) => (t.parentId === id ? { ...t, parentId: null } : t))
      set({ topics })
      saveTopics(topics)
      return
    }
    const gone = new Set([id, ...get().topics.filter((t) => t.parentId === id).map((t) => t.id)])
    const topics = get().topics.filter((t) => !gone.has(t.id))
    set({ topics })
    saveTopics(topics)
    const notes = get().notes.filter((n) => !n.topicId || !gone.has(n.topicId))
    set({ notes })
    scheduleSave(notes)
  },

  flushSave,
}))
