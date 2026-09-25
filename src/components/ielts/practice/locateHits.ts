import type { ChipColor, Explanation } from '@/lib/ielts/practice'

export interface LocHit {
  id: string
  para: number
  start: number
  end: number
  color: string
}

// Màu nền khi tô trong bài đọc — trùng màu tô của các cụm trong thẻ Paraphrasing (cam = từ khoá của đề bài,
// xanh lá = chứng cứ của đáp án, xanh dương = phần khác của câu).
export const LOC_COLORS: Record<ChipColor, string> = { orange: '#fdd9a8', green: '#a8e0b5', blue: '#b7c9f5', red: '#f5b5b5' }
const FALLBACK_COLOR = '#fde68a'

// Tìm `piece` trong các đoạn `paras` (không phân biệt hoa/thường), lấy lần xuất hiện đầu tiên. Không thấy thì thử
// lại bỏ mạo từ đầu ("the wild trees" → "wild trees").
function find(passage: string[], paras: number[], piece: string): { para: number; start: number; end: number } | null {
  const tries = [piece, piece.replace(/^(the|a|an)\s+/i, '')]
  for (const t of tries) {
    if (!t) continue
    for (const p of paras) {
      const i = passage[p]?.toLowerCase().indexOf(t.toLowerCase()) ?? -1
      if (i >= 0) return { para: p, start: i, end: i + t.length }
    }
  }
  return null
}

// Các đoạn cần tô khi bật Locate cho 1 câu hỏi: mỗi cụm ở phía BÀI ĐỌC của từng cặp trong Paraphrasing được tìm
// trong bài đọc và tô đúng màu cụm đó (từ khoá đề bài + chứng cứ đáp án). Cụm có "…" được tách thành nhiều mảnh.
// Câu không có Paraphrasing (hoặc không tìm thấy gì) thì tô các câu chứng cứ \`evidence\` bằng màu vàng.
export function locateHits(qid: string, ex: Explanation | undefined, evidence: { para: number; text: string }[] | undefined, passage: string[]): LocHit[] {
  const hits: LocHit[] = []
  // Chỉ tìm trong các đoạn có chứng cứ (tránh trùng chữ ở đoạn khác, vd "traders" xuất hiện ở nhiều đoạn).
  const paras = evidence && evidence.length > 0 ? [...new Set(evidence.map((e) => e.para))] : passage.map((_, i) => i)

  for (const [pi, pair] of (ex?.paraphrase?.pairs ?? []).entries()) {
    const right = pair.right
    if (!right) continue
    const color = LOC_COLORS[right.color ?? 'blue']
    const source = (right.find ?? right.text).replace(/\*\*/g, '')
    for (const [si, raw] of source.split('…').entries()) {
      const piece = raw.trim()
      if (!piece) continue
      const hit = find(passage, paras, piece)
      if (hit) hits.push({ id: `${qid}-p${pi}-${si}`, ...hit, color })
    }
  }

  if (hits.length > 0) return hits

  return (evidence ?? []).flatMap((e, i) => {
    const start = passage[e.para]?.indexOf(e.text) ?? -1
    return start < 0 ? [] : [{ id: `${qid}-e${i}`, para: e.para, start, end: start + e.text.length, color: FALLBACK_COLOR }]
  })
}
