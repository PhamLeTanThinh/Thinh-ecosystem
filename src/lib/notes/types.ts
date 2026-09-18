export type NoteColor = 'yellow' | 'pink' | 'mint' | 'sky' | 'lavender'

export const NOTE_COLORS: NoteColor[] = ['yellow', 'pink', 'mint', 'sky', 'lavender']

// 'note' = ghi chú rich text bình thường (mặc định). 'timeline' = 1 loại "note" khác hẳn, thân note
// không phải rich text mà là danh sách timeBlocks — chọn lúc tạo mới (xem NotesBoard.tsx), không
// đổi qua lại được sau khi đã tạo.
export type NoteKind = 'note' | 'timeline'

// 1 việc trong note kind 'timeline'. `startTime` để trống = hiện như 1 item todo-list thường (chỉ
// checkbox + text); có giờ = hiện theo dạng lịch trình (dòng thời gian dọc, sort theo giờ). 1
// timeline-note có thể trộn lẫn cả 2 loại, và có thể có NHIỀU mốc có giờ nối tiếp nhau trong ngày
// (vd 9h-10h task1, 10h-15h task2).
export interface TimeBlock {
  id: string
  startTime: string | null // 'HH:mm' | null
  endTime: string | null // 'HH:mm' | null — không bắt buộc dù đã có startTime
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
