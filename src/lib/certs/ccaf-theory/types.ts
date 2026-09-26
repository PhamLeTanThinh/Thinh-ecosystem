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
  // "Hiểu nhanh": 2–3 câu tóm ý chính bằng lời thường, đặt đầu chủ đề.
  | { type: 'tldr'; text: string }
  // Các bước nối tiếp (quy trình / vòng lặp); `loop` = ghi chú ở cuối khi các bước lặp lại.
  | { type: 'steps'; items: string[]; loop?: string }
  // Thuật ngữ: giải nghĩa từ tiếng Anh bằng lời thường.
  | { type: 'terms'; items: { term: string; meaning: string }[] }
  // Tình huống kiểu đề thi: đáp án đúng, các lựa chọn sai hay gặp và lý do.
  | { type: 'example'; scenario: string; right: string; wrong?: string[]; why: string }

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
