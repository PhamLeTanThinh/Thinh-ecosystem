'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAdminAction } from '@/components/admin/AdminDialog'
import { formatAdminDate } from '@/components/admin/format'
import { MascotEm } from '@/components/mascot/MascotDialog'
import type { FeedbackItem } from '@/lib/feedback/admin'


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
    <div className="adm-panel">
      <div className="adm-toolbar">
        <h2 className="adm-panel-title">
          Góp ý {items && <span className="adm-count">{items.length}</span>}
        </h2>
        <button type="button" className="adm-btn adm-btn-outline" onClick={load}>
          Tải lại
        </button>
      </div>
      <p className="adm-note">Góp ý gửi qua nút &quot;Mua pate cho Diên&quot; ở /study (tab Góp ý) — mới nhất lên trước.</p>

      {loadError && <p className="adm-note adm-error">{loadError}</p>}

      {!loadError && (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Nội dung</th>
                <th>Trang</th>
                <th>Gửi lúc</th>
                <th className="adm-col-actions">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {items === null && (
                <tr className="adm-empty-row">
                  <td colSpan={4}>Đang tải…</td>
                </tr>
              )}
              {items && items.length === 0 && (
                <tr className="adm-empty-row">
                  <td colSpan={4}>Chưa có góp ý nào.</td>
                </tr>
              )}
              {items?.map((item) => (
                <tr key={item.id}>
                  <td>
                    <p className="adm-message">{item.message}</p>
                  </td>
                  <td className="adm-mono">{item.page || '—'}</td>
                  <td className="adm-cell-sub">{formatAdminDate(item.createdAt)}</td>
                  <td className="adm-col-actions">
                    <button type="button" className="adm-btn adm-btn-outline adm-danger adm-btn-sm" onClick={() => remove(item)}>
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
