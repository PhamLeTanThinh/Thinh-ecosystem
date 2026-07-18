export type PinyinPosition = 'hanzi' | 'vietnamese'

export interface ChineseCard {
  id: string
  hanzi: string
  pinyin: string
  meaning: string
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
