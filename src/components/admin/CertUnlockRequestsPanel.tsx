'use client'

import { useEffect, useState } from 'react'
import { useAdminAction } from '@/components/admin/AdminDialog'
import { formatAdminDate } from '@/components/admin/format'
import { MascotEm } from '@/components/mascot/MascotDialog'
import type { UnlockRequestRow } from '@/lib/certs/unlock'

// Khung "Yêu cầu mở cert" ở tab Certs của /admin: người xem bấm "Xin quyền xem" ở cert đang khoá → hiện ở đây.
// Duyệt = cộng cert vào quyền xem riêng của người đó (bảng "Ai được xem cert nào" cập nhật theo qua onChanged).
// Không có yêu cầu nào thì ẩn hẳn. Xem lib/certs/unlock.ts.
export function CertUnlockRequestsPanel({ onChanged }: { onChanged: () => void }) {
  const runAction = useAdminAction()
  const [rows, setRows] = useState<UnlockRequestRow[]>([])

  useEffect(() => {
    fetch('/api/certs/unlock-requests')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  function decide(r: UnlockRequestRow, action: 'approve' | 'reject') {
    const approve = action === 'approve'
    return runAction({
      bubble: (
        <>
          {approve ? 'Mở' : 'Từ chối mở'} <MascotEm>{r.code}</MascotEm> cho <MascotEm>{r.fullName || r.label}</MascotEm> hả ông chủ?
        </>
      ),
      sub: approve ? 'Bạn ấy tải lại trang Certs là vào học được liền nha 🐾' : 'Bạn ấy sẽ không xin lại cert này được nữa đâu nha 🐾',
      confirmLabel: approve ? 'Mở nè' : 'Từ chối nè',
      danger: !approve,
      run: async () => {
        const res = await fetch('/api/certs/unlock-requests', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject: r.subject, certId: r.certId, action }),
        })
        if (!res.ok) return { ok: false, error: 'Chưa làm được rồi, ông chủ thử lại sau chút nha' }
        setRows((v) => v.filter((x) => !(x.subject === r.subject && x.certId === r.certId)))
        if (approve) onChanged()
        return {
          ok: true,
          bubble: (
            <>
              {approve ? 'Đã mở' : 'Đã từ chối'} <MascotEm>{r.code}</MascotEm> cho <MascotEm>{r.fullName || r.label}</MascotEm> rồi nha
            </>
          ),
        }
      },
    })
  }

  if (rows.length === 0) return null
  return (
    <div className="adm-panel">
      <div className="adm-toolbar">
        <h2 className="adm-panel-title">
          Yêu cầu mở cert <span className="adm-count">{rows.length}</span>
        </h2>
      </div>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Người xin</th>
              <th>Cert</th>
              <th>Xin lúc</th>
              <th className="adm-col-actions">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.subject}|${r.certId}`}>
                <td>
                  <div className="adm-cell-main">{r.fullName || '(không ghi tên)'}</div>
                  <div className="adm-cell-sub">{r.label}</div>
                </td>
                <td>
                  <span className="adm-pill adm-pill-accent">{r.code}</span>
                </td>
                <td>{formatAdminDate(r.requestedAt)}</td>
                <td className="adm-col-actions">
                  <div className="adm-actions">
                    <button type="button" className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => decide(r, 'approve')}>
                      Duyệt
                    </button>
                    <button type="button" className="adm-btn adm-btn-outline adm-danger adm-btn-sm" onClick={() => decide(r, 'reject')}>
                      Từ chối
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
