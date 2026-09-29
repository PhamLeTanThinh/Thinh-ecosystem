'use client'

export const PAGE_SIZE = 12

// Dãy số trang có dấu "…" khi nhiều trang: luôn giữ trang đầu/cuối + 1 trang mỗi bên trang hiện tại.
function pageItems(page: number, pageCount: number): (number | '…')[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1)
  const items: (number | '…')[] = [1]
  const from = Math.max(2, Math.min(page - 1, pageCount - 4))
  const to = Math.min(pageCount - 1, Math.max(page + 1, 5))
  if (from > 2) items.push('…')
  for (let p = from; p <= to; p++) items.push(p)
  if (to < pageCount - 1) items.push('…')
  items.push(pageCount)
  return items
}

// Ghi số trang / bộ lọc lên URL (không thêm mục lịch sử) để bấm Back từ trang chi tiết quay lại đúng chỗ. Giá trị
// null = bỏ tham số. Không dùng router để khỏi render lại trang server mỗi lần đổi trang.
export function replaceQuery(updates: Record<string, string | null>) {
  const params = new URLSearchParams(window.location.search)
  for (const [k, v] of Object.entries(updates)) {
    if (v === null) params.delete(k)
    else params.set(k, v)
  }
  const qs = params.toString()
  window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
}

export function pageQuery(p: number): Record<string, string | null> {
  return { page: p > 1 ? String(p) : null }
}

// Cắt 1 trang từ danh sách đã lọc; `current` đã kẹp trong [1, pageCount].
export function paginate<T>(list: T[], page: number) {
  const pageCount = Math.max(1, Math.ceil(list.length / PAGE_SIZE))
  const current = Math.min(Math.max(1, page), pageCount)
  const start = (current - 1) * PAGE_SIZE
  return { current, pageCount, start, visible: list.slice(start, start + PAGE_SIZE) }
}

export function Pager({ current, pageCount, start, shown, total, onPage }: { current: number; pageCount: number; start: number; shown: number; total: number; onPage: (p: number) => void }) {
  if (pageCount <= 1) return null
  return (
    <nav className="ih-pager" aria-label="Phân trang">
      <button type="button" className="ih-pager-btn" disabled={current === 1} onClick={() => onPage(current - 1)} aria-label="Trang trước">
        ‹
      </button>
      {pageItems(current, pageCount).map((p, i) =>
        p === '…' ? (
          <span key={`gap-${i}`} className="ih-pager-gap">
            …
          </span>
        ) : (
          <button key={p} type="button" className="ih-pager-btn" aria-current={p === current ? 'page' : undefined} onClick={() => onPage(p)}>
            {p}
          </button>
        ),
      )}
      <button type="button" className="ih-pager-btn" disabled={current === pageCount} onClick={() => onPage(current + 1)} aria-label="Trang sau">
        ›
      </button>
      <span className="ih-pager-info">
        {start + 1}–{start + shown} / {total}
      </span>
    </nav>
  )
}
