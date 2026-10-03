import type { WordPart } from '@/components/shared/vocab/parts'

// Bộ gõ của màn luyện gõ dùng chung (TypingPractice.tsx) — mỗi ngôn ngữ 1 cài đặt:
// Korean: Hangul 2-beolsik (lib/korean/hangulInput.ts), Chinese: pinyin không dấu (lib/chinese/pinyinInput.ts).
// "Token" = 1 lần nhấn phím; compose ghép chuỗi token thành văn bản hiển thị, toTokens tách đáp án thành chuỗi phím
// (để so tiến độ + gợi ý phím tiếp theo trên bàn phím ảo).
export interface TypingEngine {
  speechLang: string // giọng đọc: 'ko-KR' | 'zh-CN'
  inputLang: string // lang của chữ người học gõ (font): 'ko' | 'en'
  storageKey: string // khoá localStorage lưu thiết lập
  keyboardName: string // tên bàn phím ảo trong thiết lập
  placeholder: string
  readingLabel?: string // có cách đọc riêng cần ẩn/hiện (vd 'pinyin') → thêm thiết lập "Hiện pinyin"
  keyRows: [code: string, base: string, shifted: string][][]
  keyFor: (token: string) => { code: string; shift: boolean } | undefined
  keyToToken: (e: { code: string; key: string; shiftKey: boolean }) => string | null
  compose: (tokens: string[]) => string
  toTokens: (target: string) => string[]
}

// 1 mục cần gõ
export interface TypingItem {
  id: string
  raw: string // câu/từ gốc (để đọc và hiện ở kết quả)
  target: string // chuỗi cần gõ (đã chuẩn hoá)
  meaning: string
  display?: string // chữ hiện to làm đề (Chinese: chữ Hán); không có → hiện chính target, tô màu theo từng ký tự
  reading?: string // cách đọc có dấu (pinyin) — ẩn/hiện theo thiết lập
  image?: string // ảnh minh hoạ (từ vựng có ảnh)
  parts?: WordPart[] // cấu tạo từ — hiện ở màn kết quả
  label?: string // vd "Câu 1 · Hỏi", tên người nói
}

export interface TypingPools {
  vocab: TypingItem[]
  vocabUnlearned: TypingItem[]
  speaking: TypingItem[]
  dialogue: TypingItem[]
}

// Độ chính xác theo ký tự (khoảng cách Levenshtein)
export function accuracy(typed: string, target: string): number {
  const a = [...typed]
  const b = [...target]
  if (b.length === 0) return a.length === 0 ? 1 : 0
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    prev = cur
  }
  return Math.max(0, 1 - prev[b.length] / Math.max(a.length, b.length))
}
