'use client'

import { useState } from 'react'
import { useMoneyStore } from '@/lib/money/store'
import { useMoneyUIStore } from '@/lib/money/uiStore'
import { formatVND, getTotalBalance, getWalletBalance } from '@/lib/money/calculations'
import { BottomSheet } from '../BottomSheet'

const WALLET_ICONS = ['👛', '💰', '🏦', '💳', '🐷', '🎯']

export function WalletPickerModal() {
  const open = useMoneyUIStore((s) => s.walletPickerOpen)
  const close = useMoneyUIStore((s) => s.closeWalletPicker)

  const wallets = useMoneyStore((s) => s.wallets)
  const transactions = useMoneyStore((s) => s.transactions)
  const currentWalletId = useMoneyStore((s) => s.currentWalletId)
  const setCurrentWalletId = useMoneyStore((s) => s.setCurrentWalletId)
  const updateWallet = useMoneyStore((s) => s.updateWallet)
  const addWallet = useMoneyStore((s) => s.addWallet)
  const deleteWallet = useMoneyStore((s) => s.deleteWallet)

  const [editMode, setEditMode] = useState(false)
  const [addingWallet, setAddingWallet] = useState(false)
  const [newWalletName, setNewWalletName] = useState('')

  const totalBalance = getTotalBalance(wallets, transactions)

  function handleAddWallet() {
    const name = newWalletName.trim()
    if (!name) return
    const wallet = addWallet({ name, icon: WALLET_ICONS[wallets.length % WALLET_ICONS.length] })
    setCurrentWalletId(wallet.id)
    setNewWalletName('')
    setAddingWallet(false)
  }

  function handleDeleteWallet(wallet: { id: string; name: string }) {
    if (wallets.length <= 1) return
    if (!window.confirm(`Xoá ví "${wallet.name}"? Toàn bộ giao dịch và ngân sách của ví này sẽ bị xoá theo.`)) return
    deleteWallet(wallet.id)
  }

  return (
    <BottomSheet open={open} onClose={close}>
      <div className="flex items-center justify-between border-b border-border px-4 py-4">
        <button type="button" onClick={close} className="text-sm text-muted">
          Đóng
        </button>
        <h2 className="text-base font-semibold">Chọn Ví</h2>
        <button type="button" onClick={() => setEditMode((v) => !v)} className="text-sm font-medium text-accent">
          {editMode ? 'Xong' : 'Sửa'}
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 rounded-card bg-card-soft p-4">
          <span className="text-xl">🌐</span>
          <div>
            <p className="text-xs text-muted">Tổng cộng</p>
            <p className="text-base font-semibold">{formatVND(totalBalance)}</p>
          </div>
        </div>
      </div>

      <p className="px-4 text-xs font-medium tracking-wide text-muted">TÍNH VÀO TỔNG</p>

      <div className="mt-2">
        {wallets.map((wallet) => (
          <div key={wallet.id} className="flex items-center gap-3 border-b border-border px-4 py-3.5 last:border-b-0">
            <button
              type="button"
              onClick={() => {
                setCurrentWalletId(wallet.id)
                if (!editMode) close()
              }}
              className="flex flex-1 items-center gap-3 text-left"
            >
              <span className="text-lg">{wallet.icon}</span>
              {editMode ? (
                <input
                  value={wallet.name}
                  onChange={(e) => updateWallet(wallet.id, { name: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 rounded-md bg-card-soft px-2 py-1 text-sm outline-none"
                />
              ) : (
                <span className={`flex-1 text-sm ${wallet.id === currentWalletId ? 'font-semibold' : ''}`}>{wallet.name}</span>
              )}
              <span className="text-sm font-medium">{formatVND(getWalletBalance(wallet.id, transactions))}</span>
            </button>
            {editMode && wallets.length > 1 && (
              <button
                type="button"
                onClick={() => handleDeleteWallet(wallet)}
                aria-label={`Xoá ví ${wallet.name}`}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-danger"
              >
                🗑
              </button>
            )}
            <button
              type="button"
              onClick={() => updateWallet(wallet.id, { includeInTotal: !wallet.includeInTotal })}
              aria-label="Tính vào tổng"
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs transition-colors duration-150 ${
                wallet.includeInTotal ? 'bg-accent text-black' : 'bg-card-soft text-transparent'
              }`}
            >
              ✓
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 px-4 py-4">
        {addingWallet ? (
          <div className="flex items-center gap-2">
            <input
              value={newWalletName}
              onChange={(e) => setNewWalletName(e.target.value)}
              placeholder="Tên ví mới"
              autoFocus
              className="flex-1 rounded-card bg-card-soft px-3 py-2.5 text-sm outline-none placeholder:text-muted"
            />
            <button type="button" onClick={handleAddWallet} className="rounded-pill bg-accent px-4 py-2.5 text-sm font-semibold text-black">
              Thêm
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setAddingWallet(true)} className="flex items-center gap-2 py-2 text-sm font-medium text-accent">
            <span>＋</span> Thêm ví
          </button>
        )}

        <button
          type="button"
          title="Liên kết dịch vụ — sắp ra mắt"
          className="flex items-center gap-2 py-2 text-sm font-medium text-muted"
        >
          <span>🔗</span> Liên kết dịch vụ
        </button>
      </div>
    </BottomSheet>
  )
}
