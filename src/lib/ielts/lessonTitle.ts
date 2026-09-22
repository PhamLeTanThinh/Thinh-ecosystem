// "Lesson 3 — Read Connections" → { num: '3', name: 'Read Connections' }. Tên không theo mẫu (vd trang do
// người dùng tự đặt) thì trả null để nơi gọi hiện nguyên tên. Dùng chung cho menu trái và trang Kiến thức.
export function parseLessonTitle(title: string): { num: string; name: string } | null {
  const m = title.match(/^(?:Lesson|Bài)\s*(\d+)\s*[—–-]\s*(.+)$/i)
  return m ? { num: m[1], name: m[2] } : null
}
