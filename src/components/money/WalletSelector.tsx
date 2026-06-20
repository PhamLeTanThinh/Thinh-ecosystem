'use client'

import { useMoneyStore } from '@/lib/money/store'
import { useMoneyUIStore } from '@/lib/money/uiStore'

export function WalletSelector() {
  const wallets = useMoneyStore((s) => s.wallets)
  const currentWalletId = useMoneyStore((s) => s.currentWalletId)
  const openWalletPicker = useMoneyUIStore((s) => s.openWalletPicker)
  const current = wallets.find((w) => w.id === currentWalletId)

  return (
    <button
      type="button"
      onClick={openWalletPicker}
      className="flex items-center gap-1.5 rounded-pill bg-card-soft px-3 py-1.5 text-sm font-medium"
    >
      <span>{current?.icon ?? '👛'}</span>
      <span>{current?.name ?? 'Chọn ví'}</span>
      <span className="text-xs text-muted">⌄</span>
    </button>
  )
}
