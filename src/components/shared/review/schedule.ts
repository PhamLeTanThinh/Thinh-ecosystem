import type { ReviewCard, ReviewOrder, ReviewProgress } from './types'

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Nhóm ưu tiên khi ôn "thông minh": 0 = lần trước trả lời sai, 1 = chưa ôn lần nào, 2 = đã thuộc.
// Trong nhóm 0 và 2, thẻ ôn lâu nhất được ra trước (giống lặp lại ngắt quãng đơn giản — không cần thêm cột DB);
// nhóm 1 giữ thứ tự trong bài.
export function priorityOf(p: ReviewProgress | undefined): 0 | 1 | 2 {
  if (!p || p.lastResult === null) return 1
  return p.lastResult === 'wrong' ? 0 : 2
}

const time = (p: ReviewProgress | undefined) => (p?.lastReviewedAt ? Date.parse(p.lastReviewedAt) : 0)

// Danh sách id cho 1 phiên ôn: sắp theo kiểu đã chọn rồi cắt còn `limit` thẻ (0 = lấy hết)
export function buildQueue(cards: ReviewCard[], progressOf: (id: string) => ReviewProgress | undefined, order: ReviewOrder, limit: number): string[] {
  const bySort = [...cards].sort((a, b) => a.lesson - b.lesson || a.sortOrder - b.sortOrder)
  let list: ReviewCard[]
  if (order === 'sequential') list = bySort
  else if (order === 'shuffle') list = shuffled(bySort)
  else {
    const groups: ReviewCard[][] = [[], [], []]
    for (const c of bySort) groups[priorityOf(progressOf(c.id))].push(c)
    groups[0].sort((a, b) => time(progressOf(a.id)) - time(progressOf(b.id)))
    groups[2].sort((a, b) => time(progressOf(a.id)) - time(progressOf(b.id)))
    list = groups.flat()
  }
  const ids = list.map((c) => c.id)
  return limit > 0 ? ids.slice(0, limit) : ids
}
