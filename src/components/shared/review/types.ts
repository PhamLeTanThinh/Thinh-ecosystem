import type { WordPart } from '@/components/shared/vocab/parts'

// 1 thẻ ôn tập — Korean / Chinese chuẩn hoá thẻ của mình về dạng này (xem app/(apps)/<app>/study/page.tsx).
export interface ReviewCard {
  id: string
  kind: 'vocab' | 'grammar'
  lesson: number
  sortOrder: number
  word: string // mặt chữ (Hangul / chữ Hán / mẫu ngữ pháp)
  reading?: string // phiên âm (pinyin) — Korean để trống
  meaning: string
  sub?: string // nghĩa tiếng Anh (Korean vocab) / ghi chú, cách dùng (grammar) / "Hán Việt: …" (Chinese)
  pos?: string[]
  parts?: WordPart[]
  example?: string
  exampleReading?: string
  exampleVi?: string
  image?: string
}

// Tiến độ của 1 thẻ — cùng khuôn KoreanProgress / ChineseProgress
export interface ReviewProgress {
  id: string
  correctCount: number
  wrongCount: number
  lastResult: 'correct' | 'wrong' | null
  lastReviewedAt: string | null
}

export interface ReviewLessonGroup {
  label: string // vd 'TOPIK II', 'HSK 3'
  lessons: { lesson: number; badge: string; title: string }[]
}

export type ReviewScope = 'all' | 'unlearned'
export type ReviewOrder = 'smart' | 'sequential' | 'shuffle'
export type ReviewDirection = 'word' | 'meaning' // mặt trước: từ → đoán nghĩa / nghĩa → nhớ từ

export interface ReviewSettings {
  kind: 'all' | 'vocab' | 'grammar'
  scope: ReviewScope
  order: ReviewOrder
  limit: number // 0 = tất cả
  direction: ReviewDirection
  readingOnFront: boolean // hiện phiên âm ở mặt trước (chỉ Chinese)
  autoSpeak: boolean
  requeue: boolean // thẻ "Chưa thuộc" quay lại cuối phiên
}

export const DEFAULT_REVIEW_SETTINGS: ReviewSettings = {
  kind: 'all',
  scope: 'all',
  order: 'smart',
  limit: 20,
  direction: 'word',
  readingOnFront: true,
  autoSpeak: false,
  requeue: true,
}
