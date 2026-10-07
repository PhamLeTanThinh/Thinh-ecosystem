// Ngữ pháp cơ bản (/ielts/grammar → /ielts/grammar/<bài>, kèm /ielts/grammar/handbook là cẩm nang chung): 45 chủ điểm
// từ nền tảng câu tới phrasal verbs, chia nhóm. Không thuộc kỹ năng nào (giống Học qua phim). Nội dung tĩnh ở
// src/data/ielts/grammar/ — lessons.ts (từng bài) và handbook.ts (thuật ngữ, bảng tổng hợp, cặp dễ nhầm, 50 câu ôn tập).
import { GRAMMAR_LESSONS } from '@/data/ielts/grammar/lessons'

export type GrammarGroupKey =
  | 'basics'
  | 'tenses'
  | 'modals'
  | 'conditionals'
  | 'passive-reported'
  | 'verb-patterns'
  | 'nouns'
  | 'relative'
  | 'adj-adv'
  | 'linking'

export const GRAMMAR_GROUPS: { key: GrammarGroupKey; label: string; icon: string; desc: string }[] = [
  { key: 'basics', label: 'Nền tảng câu', icon: '🧱', desc: 'Chủ ngữ, động từ, tân ngữ — khung xương của mọi câu.' },
  { key: 'tenses', label: 'Các thì', icon: '⏳', desc: 'Hiện tại, quá khứ, hoàn thành, tương lai — chọn thì theo ý nghĩa.' },
  { key: 'modals', label: 'Động từ khuyết thiếu', icon: '🎛️', desc: 'can, must, should, may… — khả năng, nghĩa vụ, lời khuyên, suy đoán.' },
  { key: 'conditionals', label: 'Câu điều kiện & câu ước', icon: '🔀', desc: 'If loại 0-1-2-3 và wish.' },
  { key: 'passive-reported', label: 'Bị động, tường thuật & câu hỏi', icon: '🔁', desc: 'Đổi góc nhìn câu, thuật lại lời nói, đặt câu hỏi đúng.' },
  { key: 'verb-patterns', label: 'Mẫu động từ (V-ing / to V)', icon: '🧩', desc: 'Sau động từ này thì dùng V-ing hay to V?' },
  { key: 'nouns', label: 'Danh từ, mạo từ & từ chỉ lượng', icon: '📦', desc: 'Đếm được/không đếm được, a/an/the, some/any, much/many…' },
  { key: 'relative', label: 'Mệnh đề quan hệ', icon: '🔗', desc: 'who, which, that, whose, where — thêm thông tin cho danh từ.' },
  { key: 'adj-adv', label: 'Tính từ, trạng từ & so sánh', icon: '🎨', desc: 'Mô tả, mức độ, so sánh và trật tự từ trong câu.' },
  { key: 'linking', label: 'Liên từ & giới từ', icon: '🧭', desc: 'although/despite, by/until, at/on/in, phrasal verbs…' },
]

// 1 dòng công thức: nhãn ngắn (khi nào dùng) + công thức
export interface GrammarForm {
  label: string
  formula: string
}

export interface GrammarExample {
  en: string
  vi: string
}

export interface GrammarMistake {
  wrong: string
  right: string
  why: string
}

export interface GrammarLesson {
  id: string // đoạn URL: /ielts/grammar/<id>
  no: number
  title: string // tên tiếng Anh của chủ điểm
  vi: string // tên tiếng Việt
  group: GrammarGroupKey
  summary: string // "Hiểu nhanh" — 1-2 câu, nói như giải thích cho người mới
  forms: GrammarForm[]
  uses: string[] // cách dùng cốt lõi (markdown nhẹ: **đậm**)
  signals?: string[] // dấu hiệu nhận biết
  examples: GrammarExample[]
  mistakes: GrammarMistake[]
  compare: string // so sánh / dễ nhầm
  tip: string // mẹo nhớ
  terms?: { term: string; meaning: string }[] // thuật ngữ mới xuất hiện trong bài
}

export function getGrammarLesson(id: string): GrammarLesson | undefined {
  return GRAMMAR_LESSONS.find((l) => l.id === id)
}

export function lessonsOfGroup(group: GrammarGroupKey): GrammarLesson[] {
  return GRAMMAR_LESSONS.filter((l) => l.group === group)
}

export function neighbours(id: string): { prev?: GrammarLesson; next?: GrammarLesson } {
  const i = GRAMMAR_LESSONS.findIndex((l) => l.id === id)
  return { prev: GRAMMAR_LESSONS[i - 1], next: GRAMMAR_LESSONS[i + 1] }
}

export { GRAMMAR_LESSONS }
