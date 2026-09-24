// Lý thuyết CCAF (Claude Certified Architect — Foundations), soạn từ bộ đề `ccaf-questions.json`.
// Nội dung là dữ liệu tĩnh; văn bản hỗ trợ **đậm** và `code` (xem components/certs/TheoryRich.tsx).

export type TheoryBlock =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  // Bảng so sánh; hàng đầu là tiêu đề cột.
  | { type: 'table'; headers: string[]; rows: string[][] }
  // tip = mẹo, warn = bẫy hay gặp trong đề, exam = quy tắc chọn đáp án nhanh.
  | { type: 'callout'; tone: 'tip' | 'warn' | 'exam'; title: string; text: string }
  | { type: 'code'; text: string; caption?: string }

export interface TheoryTopic {
  id: string
  title: string
  // Câu tóm tắt hiện ở thẻ chủ đề.
  summary: string
  blocks: TheoryBlock[]
  // id các câu trong ngân hàng đề liên quan trực tiếp tới chủ đề (kể cả bản trùng lặp).
  questionIds: number[]
}

export interface TheoryDomain {
  id: string
  number: number
  title: string
  // Tỷ trọng trong đề thi thật (%).
  weight: number
  summary: string
  topics: TheoryTopic[]
}
