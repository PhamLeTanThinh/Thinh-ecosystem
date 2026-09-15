export type NoteColor = 'yellow' | 'pink' | 'mint' | 'sky' | 'lavender'

export const NOTE_COLORS: NoteColor[] = ['yellow', 'pink', 'mint', 'sky', 'lavender']

// 'note' = ghi chú rich text bình thường (mặc định). 'timeline' = 1 loại "note" khác hẳn, thân note
// không phải rich text mà là danh sách timeBlocks — chọn lúc tạo mới (xem NotesBoard.tsx), không
// đổi qua lại được sau khi đã tạo.
export type NoteKind = 'note' | 'timeline'

// 1 mốc giờ trong lịch trình — chỉ có ý nghĩa với note kind 'timeline'. 1 timeline-note có thể có
// NHIỀU mốc nối tiếp nhau trong ngày (vd 9h-10h task1, 10h-15h task2).
export interface TimeBlock {
  id: string
  startTime: string // 'HH:mm'
  endTime: string | null // 'HH:mm' | null — không bắt buộc, không phải việc nào cũng có mốc kết thúc
  text: string
  done: boolean
}

export interface StickyNote {
  id: string
  date: string // 'YYYY-MM-DD' — note thuộc "space" ngày nào
  x: number
  y: number
  width: number | null
  height: number | null
  kind: NoteKind
  content: string // rich text HTML — chỉ dùng khi kind === 'note'
  color: NoteColor | null
  tags: string[]
  timeBlocks: TimeBlock[] // chỉ dùng khi kind === 'timeline'
  createdAt: string
}
