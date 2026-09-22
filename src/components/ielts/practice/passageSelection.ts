import { nanoid } from 'nanoid'
import type { Highlight } from '@/lib/ielts/practice'

export const HL_COLORS = [
  { color: '#fde68a', label: 'Vàng' },
  { color: '#bbf7d0', label: 'Xanh lá' },
  { color: '#fbcfe8', label: 'Hồng' },
  { color: '#bfdbfe', label: 'Xanh dương' },
]

export type Tool = 'select' | 'highlight' | 'erase'

// 1 đoạn được chọn: đoạn thứ `para` của bài đọc, ký tự [start, end).
export interface Part {
  para: number
  start: number
  end: number
}

export interface PassageSelection {
  text: string
  parts: Part[]
  rect: DOMRect
}

// Số ký tự từ đầu đoạn `p` tới điểm (node, offset). Dùng Range.toString nên đúng cả khi đoạn đã bị chia
// nhỏ bởi các thẻ <mark> của highlight cũ.
function offsetIn(p: HTMLElement, node: Node, offset: number): number {
  const r = document.createRange()
  r.selectNodeContents(p)
  r.setEnd(node, offset)
  return r.toString().length
}

// Vùng người dùng đang bôi đen trong `root` (chứa các phần tử [data-para]) → danh sách đoạn + vị trí ký
// tự. Bôi qua nhiều đoạn thì mỗi đoạn là 1 Part. Không có vùng chọn (hoặc nằm ngoài root) → null.
export function selectionParts(root: HTMLElement): PassageSelection | null {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return null
  const range = sel.getRangeAt(0)
  if (!root.contains(range.commonAncestorContainer)) return null

  const parts: Part[] = []
  root.querySelectorAll<HTMLElement>('[data-para]').forEach((p) => {
    if (!range.intersectsNode(p)) return
    const len = p.textContent?.length ?? 0
    const start = p.contains(range.startContainer) ? offsetIn(p, range.startContainer, range.startOffset) : 0
    const end = p.contains(range.endContainer) ? offsetIn(p, range.endContainer, range.endOffset) : len
    if (end > start) parts.push({ para: Number(p.dataset.para), start, end })
  })
  const text = sel.toString().trim()
  if (parts.length === 0 || !text) return null
  return { text, parts, rect: range.getBoundingClientRect() }
}

// Cắt bỏ [s, e) khỏi highlight h → 0, 1 hoặc 2 mảnh (mảnh đầu giữ id + ghi chú, mảnh sau id mới).
export function subtractRange(h: Highlight, s: number, e: number): Highlight[] {
  if (e <= h.start || s >= h.end) return [h]
  const out: Highlight[] = []
  if (s > h.start) out.push({ ...h, end: s })
  if (e < h.end) out.push({ ...h, id: nanoid(), start: e, note: s > h.start ? undefined : h.note })
  return out
}

export interface Segment {
  text: string
  hl: Highlight | null
}

// Chia đoạn văn thành các khúc liên tiếp: khúc nào nằm trong highlight thì gắn hl (highlight thêm SAU
// cùng vị trí thì đè lên highlight cũ).
export function segmentsFor(text: string, list: Highlight[]): Segment[] {
  const cuts = new Set<number>([0, text.length])
  for (const h of list) {
    cuts.add(Math.max(0, Math.min(text.length, h.start)))
    cuts.add(Math.max(0, Math.min(text.length, h.end)))
  }
  const sorted = [...cuts].sort((a, b) => a - b)
  const out: Segment[] = []
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i]
    const b = sorted[i + 1]
    let hl: Highlight | null = null
    for (let k = list.length - 1; k >= 0; k--) {
      if (list[k].start <= a && list[k].end >= b) {
        hl = list[k]
        break
      }
    }
    out.push({ text: text.slice(a, b), hl })
  }
  return out
}

// Vùng bôi đen bất kỳ trong `root` (không cần nằm trong đoạn văn của bài đọc) — dùng cho Tra nghĩa, vì
// người dùng có thể tra một từ trong phần câu hỏi. Không có vùng chọn (hoặc ngoài root) → null.
export function rawSelection(root: HTMLElement): { text: string; rect: DOMRect } | null {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return null
  const range = sel.getRangeAt(0)
  if (!root.contains(range.commonAncestorContainer)) return null
  const text = sel.toString().trim()
  return text ? { text, rect: range.getBoundingClientRect() } : null
}
