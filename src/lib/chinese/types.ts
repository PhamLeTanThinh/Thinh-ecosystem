export type ChineseCardKind = 'vocab' | 'grammar'

export type PinyinPosition = 'hanzi' | 'vietnamese'

export interface ChineseCard {
  id: string
  kind: ChineseCardKind
  lesson: number // tương ứng LESSON_NUMBERS trong lib/chinese/lessons.ts
  hanzi: string // chữ Hán (vocab) hoặc mẫu ngữ pháp (grammar)
  pinyin: string // phiên âm — có thể để trống với grammar
  meaning: string // nghĩa tiếng Việt
  note: string // ghi chú thêm (vocab) hoặc cách dùng/cấu trúc (grammar)
  example: string // câu ví dụ, nhiều câu nối bằng '\n'
  theory: string // lý thuyết mở rộng (chỉ dùng cho grammar) — nhiều đoạn nối bằng '\n\n'
  exampleDetail: string // JSON.stringify(ExampleDetail[]) — chú thích cho từng câu ví dụ (chỉ grammar)
  sortOrder: number
  createdAt: string
}

export type ReviewResult = 'correct' | 'wrong'

export interface ChineseProgress {
  id: string // = cardId
  correctCount: number
  wrongCount: number
  lastResult: ReviewResult | null
  lastReviewedAt: string | null
}

export type QuizMode = 'hanzi-to-pinyin' | 'hanzi-to-meaning' | 'meaning-to-hanzi'

export interface ChineseSettings {
  pinyinPosition: PinyinPosition
  shuffle: boolean
  quizMode: QuizMode
}

export interface ChineseDeck {
  id: string
  name: string
  cardIds: string[]
  createdAt: string
}
