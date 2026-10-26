// Kiểu dữ liệu lượt xem cert (lib/certs/views.ts) — tách riêng, không import gì, để component admin chạy trên trình
// duyệt dùng được mà không kéo DB vào bundle.
export type CertSection = 'practice' | 'theory' | 'tips' | 'answers'

export const CERT_SECTION_LABEL: Record<CertSection, string> = {
  practice: 'Luyện đề',
  theory: 'Lý thuyết',
  tips: 'Tips',
  answers: 'Đáp án',
}

export interface CertViewStat {
  cert: string // id cert, vd 'ccaf'
  count: number // tổng số lần mở các trang của cert này
  lastAt: string | null
  sections: Partial<Record<CertSection, number>>
}
