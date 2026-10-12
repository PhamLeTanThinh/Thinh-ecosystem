'use client'

import { create } from 'zustand'

// Hộp thoại tự vẽ thay cho window.confirm / window.alert của trình duyệt trong /trips (giao diện ở
// components/trips/TripsDialog.tsx, gắn 1 lần trong layout). Gọi được cả ngoài React (vd confirmDeleteFund
// trong store.ts): `if (await askConfirm({ ... })) …`, `showError(e)`.

export interface DialogOptions {
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string | null // null = chỉ có 1 nút (thông báo / lỗi)
  tone?: 'danger' | 'default'
  icon?: string
}

interface DialogState {
  dialog: (DialogOptions & { resolve: (ok: boolean) => void }) | null
}

export const useTripsDialog = create<DialogState>(() => ({ dialog: null }))

export function askConfirm(options: DialogOptions): Promise<boolean> {
  return new Promise((resolve) => {
    // Đang mở hộp khác thì coi như huỷ hộp cũ — app không bao giờ mở 2 hộp chồng nhau
    useTripsDialog.getState().dialog?.resolve(false)
    useTripsDialog.setState({ dialog: { ...options, resolve } })
  })
}

export function closeDialog(ok: boolean) {
  const { dialog } = useTripsDialog.getState()
  if (!dialog) return
  useTripsDialog.setState({ dialog: null })
  dialog.resolve(ok)
}

export function showError(error: unknown) {
  return askConfirm({
    title: 'Có lỗi rồi',
    message: error instanceof Error ? error.message : String(error),
    confirmLabel: 'Đã hiểu',
    cancelLabel: null,
    icon: '⛈️',
  })
}
