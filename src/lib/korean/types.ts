export type KoreanCardKind = 'vocab' | 'grammar'

export interface KoreanCard {
  id: string
  kind: KoreanCardKind
  lesson: number // 1-18, tương ứng 제 N 과
  front: string // hangul (vocab) hoặc mẫu ngữ pháp (grammar)
  meaning: string // nghĩa tiếng Việt
  note: string // english (vocab) hoặc cách chia/cách dùng (grammar)
  example: string // câu ví dụ, nhiều câu nối bằng '\n'
  theory: string // lý thuyết mở rộng (chỉ dùng cho grammar) — nhiều đoạn nối bằng '\n\n'
  exampleDetail: string // JSON.stringify({ko,vi,vocab,breakdown}[]) — chú thích cho từng câu ví dụ (chỉ grammar)
  sortOrder: number
  createdAt: string
}

export type ReviewResult = 'correct' | 'wrong'

export interface KoreanProgress {
  id: string // = cardId
  correctCount: number
  wrongCount: number
  lastResult: ReviewResult | null
  lastReviewedAt: string | null
}

export type QuizMode = 'front-to-meaning' | 'meaning-to-front'

export interface KoreanSettings {
  shuffle: boolean
  quizMode: QuizMode
}
