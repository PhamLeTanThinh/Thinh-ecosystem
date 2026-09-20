'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAdminAction } from '@/components/admin/AdminDialog'
import { MascotEm } from '@/components/mascot/MascotDialog'
import type { FeedbackItem } from '@/lib/feedback/admin'

const fmt = (iso: string) => new Date(iso).toLocaleString('vi-VN')

// Tab "Góp ý" của /admin — đọc góp ý gửi qua DonateWidget (tab "Góp ý" ở /study), chỉ chủ trang xem
// được (API chặn bằng requireAdminApi). Không sửa được, chỉ đọc rồi xoá khi đã xử lý xong.
export function FeedbackAdmin() {
  const runAction = useAdminAction()
  const [items, setItems] = useState<FeedbackItem[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoadError(null)
    try {
      const res = await fetch('/api/admin/feedback')
      if (res.status === 403) throw new Error('Phiên đăng nhập đã hết hạn — tải lại trang để đăng nhập lại nhé.')
      if (!res.ok) throw new Error('Không tải được danh sách góp ý, thử lại sau.')
      setItems(await res.json())
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Không tải được danh sách góp ý.')
    }
  }, [])

  useEffect(() => {
    // Gọi load() trong effect là đúng chỗ để đồng bộ với API bên ngoài; setState chạy sau await nên không gây render dây chuyền.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, [load])

  function remove(item: FeedbackItem) {
    return runAction({
      bubble: <>Xoá góp ý này hả ông chủ?</>,
      sub: <MascotEm>{item.message.length > 80 ? `${item.message.slice(0, 80)}…` : item.message}</MascotEm>,
      confirmLabel: 'Xoá luôn',
      danger: true,
      run: async () => {
        const res = await fetch(`/api/admin/feedback/${encodeURIComponent(item.id)}`, { method: 'DELETE' })
        if (!res.ok) return { ok: false, error: 'Chưa xoá được rồi, ông chủ thử lại sau chút nha' }
        setItems((v) => (v ? v.filter((x) => x.id !== item.id) : v))
        return { ok: true, bubble: <>Đã xoá góp ý rồi nha</> }
      },
    })
  }

  return (
    <div>
      <div className="adm-toolbar">
        <h2 className="ih-font-hand adm-subtitle">Góp ý{items ? ` (${items.length})` : ''}</h2>
        <button type="button" className="ih-btn-outline" onClick={load}>
          Tải lại
        </button>
      </div>
      <p className="adm-note">Góp ý gửi qua nút &quot;Mua pate cho Diên&quot; ở /study (tab Góp ý) — mới nhất lên trước.</p>

      {loadError && <p className="ih-vocab-empty adm-error">{loadError}</p>}
      {!loadError && items === null && <p className="ih-vocab-empty">Đang tải…</p>}
      {items && items.length === 0 && <p className="ih-vocab-empty">Chưa có góp ý nào.</p>}

      <div className="adm-list">
        {items?.map((item) => (
          <div key={item.id} className="ih-glass adm-feedback-item">
            <div className="adm-feedback-main">
              <p className="adm-feedback-message">{item.message}</p>
              <div className="adm-meta">
                {fmt(item.createdAt)}
                {item.page && (
                  <>
                    {' · '}
                    <span className="adm-feedback-page">{item.page}</span>
                  </>
                )}
              </div>
            </div>
            <div className="adm-actions">
              <button type="button" className="ih-btn-outline adm-danger" onClick={() => remove(item)}>
                Xoá
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
