// Kiểu dữ liệu chung cho "Cẩm nang ngữ pháp" của các app học ngôn ngữ (Korean, Chinese) — xem
// components/shared/GrammarHandbook.tsx. Mỗi app tự khai báo nhóm + điểm phân biệt trong lib/<app>/handbook.ts.

export interface HandbookGroup {
  key: string
  title: string
}

export interface HandbookCategory {
  key: string
  group: string // HandbookGroup.key
  icon: string
  title: string
  intro: string // 1 câu nói nhóm này khác nhau ở điểm nào
}

export interface HandbookItem {
  cat: string // HandbookCategory.key
  tip: string // điểm phân biệt với các mẫu khác trong nhóm, 1 câu ngắn
}

// 1 mẫu ngữ pháp đã chuẩn hoá từ thẻ của app, để component dùng chung hiển thị.
export interface HandbookEntry {
  id: string
  front: string // mẫu ngữ pháp
  sub?: string // dòng phụ dưới mẫu (vd pinyin)
  cat: string | null // null → nhóm "Chưa phân loại"
  tip: string
  level: string // khoá cấp độ, dùng để lọc
  badge: string // nhãn cấp độ + bài, vd "TOPIK I · 12과", "HSK 3 · Bài 5"
  lessonHref?: string // link mở đúng thẻ trong bài — bỏ trống với mẫu mở rộng không thuộc bài nào
  lessonLabel?: string // vd "bài 12과"
  example: { text: string; pinyin?: string; vi?: string } | null
  searchText: string // gộp các trường để tìm kiếm (chữ thường)
}
