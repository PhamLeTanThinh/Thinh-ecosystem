'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ADMIN_TOKENS } from '@/components/admin/adminTokens'
import { ActionDialog } from '@/components/mascot/ActionDialog'
import type { ActionSpec } from '@/components/mascot/ActionDialog'

// Mọi thao tác thêm/sửa/xoá ở /admin đi qua popup mèo hỏi–xong dùng chung (mascot/ActionDialog.tsx) thay vì
// window.confirm mặc định của trình duyệt — file này chỉ bọc thêm: 1 popup mở tại 1 thời điểm, gọi bằng hook,
// màu riêng của /admin (xem adminTokens.ts).
// Dùng: const runAction = useAdminAction(); const done = await runAction({ bubble, confirmLabel, run }).
export type { ActionResult } from '@/components/mascot/ActionDialog'
export type AdminAction = ActionSpec

interface Pending {
  id: number
  spec: AdminAction
  resolve: (ok: boolean) => void
}

const ActionContext = createContext<((spec: AdminAction) => Promise<boolean>) | null>(null)

// Trả về true nếu thao tác đã chạy xong thành công (và người dùng đã bấm OK ở popup thành công), false nếu huỷ.
export function useAdminAction() {
  const runAction = useContext(ActionContext)
  if (!runAction) throw new Error('useAdminAction phải nằm trong <AdminActionProvider>')
  return runAction
}

export function AdminActionProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<Pending | null>(null)
  const openRef = useRef(false) // đang có popup: bỏ qua yêu cầu mở thêm (không xếp chồng 2 popup)
  const seq = useRef(0)

  const runAction = useCallback((spec: AdminAction) => {
    if (openRef.current) return Promise.resolve(false)
    openRef.current = true
    return new Promise<boolean>((resolve) => setPending({ id: ++seq.current, spec, resolve }))
  }, [])

  function close(ok: boolean) {
    pending?.resolve(ok)
    openRef.current = false
    setPending(null)
  }

  return (
    <ActionContext.Provider value={runAction}>
      {children}
      {pending && <ActionDialog key={pending.id} spec={pending.spec} onClose={close} style={ADMIN_TOKENS} />}
    </ActionContext.Provider>
  )
}
