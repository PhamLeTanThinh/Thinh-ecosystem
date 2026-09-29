// Luyện nghe chép chính tả (Dictation) cho Listening: mỗi bài = 1 section của 1 đề CAM, chia thành từng câu có mốc thời gian trên
// file âm thanh của section (chính là file mp3 của đề Listening tương ứng). Người học nghe từng câu rồi gõ lại:
//  • EASY: điền từng từ (từ LMS cho sẵn — `given` — và dấu câu đã hiện, các từ còn lại là ô trống);
//  • HARD: gõ nguyên câu vào 1 ô rồi so khớp cả câu.

export interface DPopular {
  en: string
  ipa?: string
  vi: string
}

export interface DSentence {
  text: string // câu đầy đủ
  vi?: string // bản dịch tiếng Việt
  start: number // ms, tính từ đầu file âm thanh của section
  end: number
  words: string[] // các từ và dấu câu theo thứ tự (dấu câu là phần tử riêng)
  given?: number[] // chỉ số các từ LMS cho sẵn trong chế độ điền từ (không phải gõ)
  pw?: DPopular[] // từ/cụm hay gặp trong câu (kèm phiên âm, nghĩa)
  speaker?: string
}

export interface Dictation {
  id: string
  skill: 'listening'
  title: string
  book: string // vd "Cambridge 16"
  bookNo: number
  test: number
  section: number
  words: number
  audioLocal?: string // /ielts/audio/<đề>/s<N>.mp3 (đã tải về, đúng dung lượng)
  audioTest?: string // id đề Listening chứa file âm thanh
  audioUrl: string // CDN của LMS (đường lùi)
  sentences: DSentence[]
}

export interface DictationSummary {
  id: string
  title: string
  book: string
  bookNo: number
  test: number
  section: number
  sentences: number
  words: number
}

export function dictationSummary(d: Dictation): DictationSummary {
  return { id: d.id, title: d.title, book: d.book, bookNo: d.bookNo, test: d.test, section: d.section, sentences: d.sentences.length, words: d.words }
}

export const partLabel = (d: Pick<DictationSummary, 'book' | 'test' | 'section'>) => `${d.book} · Test ${d.test} · Section ${d.section}`

// Dấu câu / ký hiệu (không có chữ hay số) đứng riêng thành 1 phần tử trong `words`.
export const isPunct = (w: string) => !/[\p{L}\p{N}]/u.test(w)

// Chỉ số các từ người học phải gõ (bỏ dấu câu và các từ cho sẵn).
export function blankIndexes(s: DSentence): number[] {
  const given = new Set(s.given ?? [])
  return s.words.flatMap((w, i) => (isPunct(w) || given.has(i) ? [] : [i]))
}

// Dấu đóng/ngắt câu dính vào từ đứng trước; ký hiệu mở (£, $, ngoặc) dính vào từ đứng sau — còn lại cách nhau 1 khoảng trắng.
const NO_SPACE_BEFORE = /^[.,;:!?)%\]}”’'…]+$/
const NO_SPACE_AFTER = /^[£$€(\[{“‘]+$/
export function spaceBefore(prev: string | undefined, cur: string): boolean {
  if (prev === undefined) return false
  if (NO_SPACE_BEFORE.test(cur)) return false
  if (NO_SPACE_AFTER.test(prev)) return false
  return true
}

// So khớp 1 từ người học gõ với đáp án: không phân biệt hoa thường, quy dấu nháy cong về nháy thẳng, bỏ dấu câu ở hai đầu.
export function normalizeWord(w: string): string {
  return w
    .toLowerCase()
    .replace(/[‘’´`]/g, "'")
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')
}
export const sameWord = (typed: string, expected: string) => normalizeWord(typed) === normalizeWord(expected)

// Đường dẫn âm thanh: ưu tiên route cục bộ không đuôi .mp3 (xem /api/ielts/audio), thiếu thì CDN của LMS.
export function audioSources(d: Pick<Dictation, 'audioLocal' | 'audioUrl'>): { primary: string; fallback?: string } {
  const local = d.audioLocal?.replace(/^\/ielts\/audio\/(.+)\.mp3$/, '/api/ielts/audio/$1')
  return local ? { primary: local, fallback: d.audioUrl || undefined } : { primary: d.audioUrl }
}

export function formatClock(sec: number): string {
  const s = Math.max(0, Math.floor(sec))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}
