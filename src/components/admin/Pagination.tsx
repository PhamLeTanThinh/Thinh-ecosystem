'use client'

import { useState } from 'react'

// Phân trang dùng chung cho các bảng / danh sách ở /admin (bảng ngoài và danh sách trong popup chi tiết).
// usePagination(items, size, resetKey): resetKey đổi (vd đổi bộ lọc / ô tìm) thì quay về trang 1; trang hiện tại luôn
// được kẹp trong khoảng hợp lệ nên xoá bớt dòng ở trang cuối không bị rơi vào trang trống.
export function usePagination<T>(items: T[], initialSize = 10, resetKey = '') {
  const [page, setPage] = useState(1)
  const [size, setSizeState] = useState(initialSize)
  const [key, setKey] = useState(resetKey)
  if (key !== resetKey) {
    setKey(resetKey)
    setPage(1)
  }
  const pages = Math.max(1, Math.ceil(items.length / size))
  const current = Math.min(page, pages)
  const start = (current - 1) * size
  return {
    items: items.slice(start, start + size),
    page: current,
    pages,
    size,
    total: items.length,
    from: items.length ? start + 1 : 0,
    to: Math.min(start + size, items.length),
    setPage,
    setSize: (s: number) => {
      setSizeState(s)
      setPage(1)
    },
  }
}

type Paged = ReturnType<typeof usePagination>

// Các số trang hiện ra: đầu, cuối, quanh trang hiện tại; chỗ bị lược bớt là '…'
function pageList(page: number, pages: number): (number | '…')[] {
  const set = new Set([1, pages, page - 1, page, page + 1].filter((n) => n >= 1 && n <= pages))
  const sorted = [...set].sort((a, b) => a - b)
  const out: (number | '…')[] = []
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push('…')
    out.push(n)
  })
  return out
}

// Thanh phân trang: "1–10 / 23" · ‹ 1 2 3 › · số dòng mỗi trang (sizes rỗng = không cho đổi). Ẩn khi chỉ có 1 trang
// và không đổi được số dòng (danh sách ngắn thì khỏi hiện cho gọn).
export function Pager({ p, sizes = [10, 20, 50], unit = 'dòng', compact }: { p: Paged; sizes?: number[]; unit?: string; compact?: boolean }) {
  if (p.total <= Math.min(p.size, ...(sizes.length ? sizes : [p.size]))) return null
  return (
    <div className={`adm-pager${compact ? ' compact' : ''}`}>
      <span className="adm-pager-info">
        {p.from}–{p.to} / {p.total} {unit}
      </span>
      <div className="adm-pager-pages">
        <button type="button" className="adm-pager-btn" disabled={p.page === 1} onClick={() => p.setPage(p.page - 1)} aria-label="Trang trước">
          ‹
        </button>
        {pageList(p.page, p.pages).map((n, i) =>
          n === '…' ? (
            <span key={`gap-${i}`} className="adm-pager-gap">
              …
            </span>
          ) : (
            <button key={n} type="button" className={`adm-pager-btn${n === p.page ? ' on' : ''}`} aria-current={n === p.page ? 'page' : undefined} onClick={() => p.setPage(n)}>
              {n}
            </button>
          ),
        )}
        <button type="button" className="adm-pager-btn" disabled={p.page === p.pages} onClick={() => p.setPage(p.page + 1)} aria-label="Trang sau">
          ›
        </button>
      </div>
      {sizes.length > 0 && (
        <label className="adm-pager-size">
          <select className="adm-input" value={p.size} onChange={(e) => p.setSize(Number(e.target.value))}>
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s} / trang
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  )
}
