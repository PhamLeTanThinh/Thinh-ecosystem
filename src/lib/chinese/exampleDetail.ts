// Kiểu chú thích cho từng câu ví dụ của thẻ ngữ pháp — dùng bởi GrammarExamples trong page.tsx,
// lưu dạng JSON.stringify(ExampleDetail[]) trong ChineseCard.exampleDetail. Không có dữ liệu mẫu sẵn
// (khác lib/korean/exampleDetail.ts) vì chưa có giáo trình ngữ pháp thật — điền qua form Thêm thẻ.
export interface ExampleDetail {
  zh: string // câu ví dụ chữ Hán
  pinyin: string // phiên âm câu ví dụ (rỗng nếu không có)
  vi: string // bản dịch tiếng Việt
  vocab: string // giải thích từ vựng đáng chú ý trong câu (rỗng nếu không có)
  breakdown: string // cách biến đổi ngữ pháp áp dụng trong câu này
}
