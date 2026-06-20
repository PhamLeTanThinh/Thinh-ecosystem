'use client'

import { useState } from 'react'
import { useMoneyStore } from '@/lib/money/store'
import { useMoneyUIStore } from '@/lib/money/uiStore'
import { toISODate } from '@/lib/money/calculations'
import type { Category, DebtDirection, TransactionType } from '@/lib/money/types'
import { AmountInput } from '../AmountInput'
import { BottomSheet } from '../BottomSheet'
import { CategoryPicker } from '../CategoryPicker'
import { DebtPicker } from '../DebtPicker'
import { Row } from '../Row'
import { SheetHeader } from '../SheetHeader'

// Chỉ category "Trả nợ"/"Thu nợ" mới cho liên kết khoản nợ — "Vay"/"Cho vay" không liên kết được
// vì getDebtPaid() cộng dồn mọi giao dịch theo debtId để TRỪ vào dư nợ, liên kết "Vay" vào sẽ làm
// sai số dư còn lại. "Trả nợ" có thể là category kiểu 'debt' (mặc định) hoặc 'expense' (tự thêm).
function isDebtRepaymentCategory(category: Category | undefined): boolean {
  return category?.name === 'Trả nợ' || category?.name === 'Thu nợ'
}

function debtDirectionForCategory(category: Category | undefined): DebtDirection {
  return category?.name === 'Thu nợ' ? 'owed' : 'owe'
}

const TYPE_TABS: { type: TransactionType; label: string }[] = [
  { type: 'expense', label: 'Khoản chi' },
  { type: 'income', label: 'Khoản thu' },
  { type: 'debt', label: 'Vay/Nợ' },
]

const ACCENT_BY_TYPE: Record<TransactionType, string> = {
  expense: '#dc2626',
  income: '#16a34a',
  debt: '#d97706',
}

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat('vi-VN', { weekday: 'long' })

function formatTxDateLabel(date: Date): string {
  const weekday = WEEKDAY_FORMATTER.format(date)
  const capitalized = weekday.charAt(0).toUpperCase() + weekday.slice(1)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${capitalized}, ${day}/${month}/${date.getFullYear()}`
}

export function AddTransactionModal() {
  const open = useMoneyUIStore((s) => s.addTransactionOpen)
  const resetKey = useMoneyUIStore((s) => s.addTransactionKey)
  const close = useMoneyUIStore((s) => s.closeAddTransaction)

  return (
    <BottomSheet open={open} onClose={close}>
      <AddTransactionForm key={resetKey} onClose={close} />
    </BottomSheet>
  )
}

function AddTransactionForm({ onClose }: { onClose: () => void }) {
  const openWalletPicker = useMoneyUIStore((s) => s.openWalletPicker)

  const wallets = useMoneyStore((s) => s.wallets)
  const currentWalletId = useMoneyStore((s) => s.currentWalletId)
  const categories = useMoneyStore((s) => s.categories)
  const addTransaction = useMoneyStore((s) => s.addTransaction)

  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState(0)
  const [categoryId, setCategoryId] = useState<string | null>(
    () => categories.find((c) => c.type === 'expense')?.id ?? null,
  )
  const [note, setNote] = useState('')
  const [date, setDate] = useState(() => new Date())
  const [showMore, setShowMore] = useState(false)
  const [debtId, setDebtId] = useState<string | undefined>(undefined)

  const wallet = wallets.find((w) => w.id === currentWalletId) ?? wallets[0]
  const category = categories.find((c) => c.id === categoryId)

  function handleTypeChange(nextType: TransactionType) {
    setType(nextType)
    setDebtId(undefined)
    setCategoryId((current) => {
      const stillValid = categories.find((c: Category) => c.id === current)?.type === nextType
      return stillValid ? current : categories.find((c) => c.type === nextType)?.id ?? null
    })
  }

  function handleCategoryChange(nextCategoryId: string) {
    setCategoryId(nextCategoryId)
    setDebtId(undefined)
  }

  function handleSave() {
    if (amount <= 0 || !categoryId || !wallet) return
    addTransaction({
      walletId: wallet.id,
      categoryId,
      type,
      amount,
      note: note.trim() || undefined,
      date: toISODate(date),
      debtId,
    })
    onClose()
  }

  function shiftDate(deltaDays: number) {
    setDate((d) => {
      const next = new Date(d)
      next.setDate(next.getDate() + deltaDays)
      return next
    })
  }

  return (
    <>
      <SheetHeader title="Thêm Giao Dịch" onCancel={onClose} />

      <div className="flex gap-2 p-4">
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.type}
            type="button"
            onClick={() => handleTypeChange(tab.type)}
            className={`flex-1 rounded-pill py-2 text-sm font-medium transition-colors duration-200 ${
              type === tab.type ? 'bg-accent text-black' : 'bg-card-soft text-muted'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Row
        icon={<span className="text-lg">{wallet?.icon ?? '👛'}</span>}
        label="Ví"
        value={wallet?.name ?? 'Chọn ví'}
        onClick={openWalletPicker}
      />

      <AmountInput value={amount} onChange={setAmount} accentColor={ACCENT_BY_TYPE[type]} autoFocus />

      <CategoryPicker type={type} value={categoryId} onChange={handleCategoryChange} />

      {isDebtRepaymentCategory(category) && (
        <DebtPicker direction={debtDirectionForCategory(category)} value={debtId} onChange={setDebtId} />
      )}

      <div className="flex items-center gap-3 border-b border-border px-4 py-4">
        <span className="flex h-8 w-8 items-center justify-center text-lg">📝</span>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ghi chú"
          aria-label="Ghi chú"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
        />
      </div>

      <div className="flex items-center gap-3 border-b border-border px-4 py-4">
        <span className="flex h-8 w-8 items-center justify-center text-lg">📅</span>
        <button type="button" onClick={() => shiftDate(-1)} aria-label="Ngày trước" className="text-muted">
          ‹
        </button>
        <span className="flex-1 text-center text-sm font-medium">{formatTxDateLabel(date)}</span>
        <button type="button" onClick={() => shiftDate(1)} aria-label="Ngày sau" className="text-muted">
          ›
        </button>
      </div>

      <div className="px-4 py-3">
        <button type="button" onClick={() => setShowMore((v) => !v)} className="text-sm font-medium text-accent">
          Thêm chi tiết
        </button>
        {showMore && (
          <p className="mt-2 text-xs text-muted">Đính kèm ảnh hoá đơn, vị trí... — tính năng đang phát triển.</p>
        )}
      </div>

      <div className="flex items-center gap-3 px-4 py-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={amount <= 0}
          className="flex-1 rounded-pill bg-accent py-3.5 text-sm font-semibold text-black disabled:opacity-40"
        >
          Lưu
        </button>
        <button
          type="button"
          title="Quét hoá đơn — sắp ra mắt"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-lg text-black"
        >
          📷
        </button>
      </div>
    </>
  )
}
