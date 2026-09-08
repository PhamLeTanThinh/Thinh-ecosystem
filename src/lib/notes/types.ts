export type NoteColor = 'yellow' | 'pink' | 'mint' | 'sky' | 'lavender'

export const NOTE_COLORS: NoteColor[] = ['yellow', 'pink', 'mint', 'sky', 'lavender']

export interface StickyNote {
  id: string
  date: string // 'YYYY-MM-DD' — note thuộc "space" ngày nào
  x: number
  y: number
  width: number | null
  height: number | null
  content: string // rich text HTML
  color: NoteColor | null
  tags: string[]
  createdAt: string
}
