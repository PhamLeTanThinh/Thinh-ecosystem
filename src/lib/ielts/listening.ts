// Đề thi thử Listening (nguồn: API "online-tests" của LMS). Khác đề Reading (1 bài đọc + nhóm câu hỏi): mỗi đề có
// nhiều SECTION, mỗi section có âm thanh riêng, transcript có mốc thời gian và các nhóm câu hỏi. Câu hỏi đánh số liên tục 1…N
// trên cả đề — số của từng ô/mục được suy ra từ thứ tự (xem itemCount), không lưu sẵn.
import type { QuizSegment } from './practice'

export interface LSpan {
  text: string
  bold?: boolean
}

// 1 đoạn của bảng ghi chú/form (bullet = gạch đầu dòng). Ô trống = { blank: id }.
export interface LPara {
  bullet?: boolean
  segs: QuizSegment[]
}

// Điền ghi chú / form / bảng: cả khối là 1 mục, mỗi ô trống là 1 câu (số câu = num + thứ tự ô trống).
export interface LFillItem {
  type: 'fill'
  num: number
  heading?: string
  body: LPara[]
  blanks: string[] // id các ô trống theo thứ tự câu
}
// Trắc nghiệm 1 đáp án (A, B, C… theo thứ tự options).
export interface LChoiceItem {
  type: 'choice'
  num: number
  question: string
  options: string[]
}
// Chọn nhiều đáp án: chiếm `count` số câu liên tiếp (vd câu 21-22).
export interface LMultiItem {
  type: 'multi'
  num: number
  count: number
  question: string
  options: string[]
}
// Nhãn bản đồ/sơ đồ: mỗi nhãn chọn 1 chữ cái trong số các điểm trên ảnh (spots).
export interface LMapItem {
  type: 'map'
  num: number
  image: { url: string; width: number; height: number }
  spots: { letter: string; x: number; y: number }[]
  labels: string[]
}
// Nối (kéo thả): mỗi nhãn chọn 1 trong danh sách options (A, B, C… theo thứ tự).
export interface LMatchItem {
  type: 'match'
  num: number
  options: string[]
  labels: string[]
}
export type LItem = LFillItem | LChoiceItem | LMultiItem | LMapItem | LMatchItem

export interface LGroup {
  instruction: LSpan[] // vd "Write ONE WORD AND/OR A NUMBER for each answer."
  items: LItem[]
}

export interface LCue {
  start: number // ms, tính từ đầu file âm thanh của section
  end: number
  text: string
  speaker?: string
}

export interface LSection {
  id: string
  title: string
  durationMin: number
  audioUrl: string // CDN của LMS (luôn có)
  // File đã tải về máy (public/ielts/audio/…, không commit). Có thì phát file này trước, lỗi/thiếu thì tự lùi về audioUrl.
  audioLocal?: string
  // Sóng âm để vẽ thanh phát: các cột biên độ đỉnh chuẩn hoá 0..1 (nguồn: waveInfo của LMS, đã nén). Thiếu → vẽ tạm theo transcript.
  wave?: number[]
  groups: LGroup[]
  cues: LCue[]
}

export interface ListeningTest {
  id: string
  skill: 'listening'
  title: string
  category: string // vd "Practice test"
  part: string // vd "Cambridge 16"
  durationMin: number
  coverImage?: string
  sections: LSection[]
  // Đáp án theo SỐ CÂU (chuỗi): mảng các đáp án chấp nhận được. Điền chữ: nhiều cách viết ('movie','film'); trắc nghiệm/nối/bản đồ:
  // ['C']; chọn nhiều đáp án: đặt ở số câu ĐẦU của mục, là cả tập đáp án đúng (thứ tự nào cũng được), vd '21': ['C','E'].
  // Thiếu = chưa có đáp án (làm bài vẫn được, chỉ chưa chấm). answersNote = nguồn/độ tin cậy, hiện ở trang kết quả.
  answers?: Record<string, string[]>
  answersNote?: string
}

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function itemCount(item: LItem): number {
  switch (item.type) {
    case 'fill':
      return item.blanks.length
    case 'choice':
      return 1
    case 'multi':
      return item.count
    case 'map':
    case 'match':
      return item.labels.length
  }
}

export function itemRange(item: LItem): [number, number] {
  return [item.num, item.num + itemCount(item) - 1]
}

export function sectionRange(section: LSection): [number, number] {
  const items = section.groups.flatMap((g) => g.items)
  return items.length ? [itemRange(items[0])[0], itemRange(items[items.length - 1])[1]] : [0, -1]
}

export function totalQuestions(test: ListeningTest): number {
  return test.sections.reduce((n, s) => n + s.groups.reduce((m, g) => m + g.items.reduce((k, it) => k + itemCount(it), 0), 0), 0)
}

// Chuẩn hoá đáp án điền chữ: không phân biệt hoa/thường, gộp khoảng trắng, bỏ dấu câu ở hai đầu.
export function normalizeAnswer(s: string): string {
  return s
    .toLowerCase()
    .replace(/[‘’´`]/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/^[\s.,;:!?"'()]+|[\s.,;:!?"'()]+$/g, '')
    .trim()
}

export interface QuestionResult {
  num: number
  given: string // đáp án người học chọn/gõ ('' = bỏ trống)
  expected: string // đáp án đúng để hiện (các cách viết nối bằng " / "); '' nếu chưa có đáp án
  ok: boolean | null // null = chưa có đáp án để chấm
}

// Chấm cả đề. answers: số câu (chuỗi) → đáp án đã chọn; chọn nhiều đáp án lưu ở số câu đầu, ngăn bằng dấu phẩy ('C,E').
export function gradeListening(test: ListeningTest, answers: Record<string, string>): { results: QuestionResult[]; score: number; total: number; graded: boolean } {
  const key = test.answers
  const results: QuestionResult[] = []
  for (const item of test.sections.flatMap((s) => s.groups.flatMap((g) => g.items))) {
    if (item.type === 'multi') {
      const given = (answers[String(item.num)] ?? '').split(',').filter(Boolean)
      const expected = key?.[String(item.num)]
      // Mỗi đáp án đúng trong số đã chọn được 1 điểm; gán điểm lần lượt cho các số câu của mục.
      const hits = expected ? given.filter((g) => expected.includes(g)).length : 0
      for (let i = 0; i < item.count; i++) {
        results.push({ num: item.num + i, given: given[i] ?? '', expected: expected ? expected.join(', ') : '', ok: expected ? i < hits : null })
      }
      continue
    }
    for (let i = 0; i < itemCount(item); i++) {
      const num = item.num + i
      const given = (answers[String(num)] ?? '').trim()
      const accepted = key?.[String(num)]
      let ok: boolean | null = null
      if (accepted) ok = given !== '' && accepted.some((a) => (item.type === 'fill' ? normalizeAnswer(a) === normalizeAnswer(given) : a === given))
      results.push({ num, given, expected: accepted ? accepted.join(' / ') : '', ok })
    }
  }
  const graded = !!key && results.every((r) => r.ok !== null)
  return { results, score: results.filter((r) => r.ok).length, total: results.length, graded }
}

// Quy đổi số câu đúng (/40) → band Listening (thang Cambridge, chỉ để tham khảo).
export function listeningBand(raw: number): number {
  const table: [number, number][] = [[39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5], [16, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5]]
  return table.find(([min]) => raw >= min)?.[1] ?? 2
}

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}
