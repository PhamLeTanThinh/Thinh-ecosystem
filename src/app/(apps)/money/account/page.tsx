'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useMoneyStore } from '@/lib/money/store'
import { useMoneyUIStore } from '@/lib/money/uiStore'
import { formatVND, getTotalBalance } from '@/lib/money/calculations'
import type { BackupSummary, MoneyBackupData } from '@/lib/money/types'

const BACKUP_DATETIME_FORMATTER = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function downloadJSON(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function AccountPage() {
  const wallets = useMoneyStore((s) => s.wallets)
  const transactions = useMoneyStore((s) => s.transactions)
  const openWalletPicker = useMoneyUIStore((s) => s.openWalletPicker)

  const debts = useMoneyStore((s) => s.debts)
  const cycleStartDay = useMoneyStore((s) => s.settings.cycleStartDay)
  const updateSettings = useMoneyStore((s) => s.updateSettings)
  const totalBalance = getTotalBalance(wallets, transactions)

  function shiftCycleStartDay(delta: number) {
    updateSettings({ cycleStartDay: Math.min(28, Math.max(1, cycleStartDay + delta)) })
  }

  return (
    <div className="px-4 pt-6">
      <h1 className="text-xl font-bold">Tài khoản</h1>

      <div className="mt-4 rounded-card bg-card p-5">
        <p className="text-sm text-muted">Tổng số dư</p>
        <p className="mt-1 text-2xl font-bold">{formatVND(totalBalance)}</p>
      </div>

      <button
        type="button"
        onClick={openWalletPicker}
        className="mt-4 flex w-full items-center justify-between rounded-card bg-card p-4 text-left"
      >
        <span>Quản lý ví ({wallets.length})</span>
        <span className="text-muted">›</span>
      </button>

      <Link
        href="/money/debts"
        className="mt-3 flex w-full items-center justify-between rounded-card bg-card p-4 text-left"
      >
        <span>Quản lý nợ ({debts.length})</span>
        <span className="text-muted">›</span>
      </Link>

      <div className="mt-4 rounded-card bg-card p-4">
        <p className="text-sm font-medium">Ngày bắt đầu chu kỳ ngân sách</p>
        <p className="mt-0.5 text-xs text-muted">
          Tổng quan và ngân sách sẽ tính &quot;tháng&quot; bắt đầu từ ngày này (ví dụ: ngày lương về).
        </p>
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => shiftCycleStartDay(-1)}
            aria-label="Giảm ngày bắt đầu chu kỳ"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-card-soft text-lg"
          >
            −
          </button>
          <span className="flex-1 text-center text-lg font-semibold">Ngày {cycleStartDay}</span>
          <button
            type="button"
            onClick={() => shiftCycleStartDay(1)}
            aria-label="Tăng ngày bắt đầu chu kỳ"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-card-soft text-lg"
          >
            +
          </button>
        </div>
      </div>

      <BackupSection />
    </div>
  )
}

function BackupSection() {
  const [backups, setBackups] = useState<BackupSummary[]>([])
  const [busy, setBusy] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function refreshBackups() {
    const res = await fetch('/api/money/backups')
    setBackups(await res.json())
  }

  useEffect(() => {
    let cancelled = false
    fetch('/api/money/backups')
      .then((res) => res.json())
      .then((data: BackupSummary[]) => {
        if (!cancelled) setBackups(data)
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function handleCreateAndDownload() {
    setBusy(true)
    try {
      const res = await fetch('/api/money/backups', { method: 'POST' })
      const data: MoneyBackupData = await res.json()
      downloadJSON(data, `money-backup-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`)
      await refreshBackups()
    } finally {
      setBusy(false)
    }
  }

  async function handleRestore(backupId: string, label: string) {
    if (!window.confirm(`Khôi phục dữ liệu về thời điểm "${label}"? Dữ liệu hiện tại sẽ được lưu lại thành 1 bản sao lưu mới trước khi ghi đè.`)) {
      return
    }
    setBusy(true)
    try {
      await fetch('/api/money/backups/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backupId }),
      })
      window.location.reload()
    } finally {
      setBusy(false)
    }
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!window.confirm(`Khôi phục dữ liệu từ file "${file.name}"? Dữ liệu hiện tại sẽ được lưu lại thành 1 bản sao lưu mới trước khi ghi đè.`)) {
      return
    }
    setBusy(true)
    try {
      const data = JSON.parse(await file.text())
      await fetch('/api/money/backups/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      })
      window.location.reload()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-4 rounded-card bg-card p-4">
      <p className="text-sm font-medium">Sao lưu dữ liệu</p>
      <p className="mt-0.5 text-xs text-muted">
        Hệ thống tự tạo 1 bản sao lưu mỗi khi có thay đổi. Bạn cũng có thể tải xuống hoặc khôi phục thủ công.
      </p>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={handleCreateAndDownload}
          disabled={busy}
          className="flex-1 rounded-pill bg-accent py-2.5 text-sm font-semibold text-black disabled:opacity-40"
        >
          Tải xuống bản sao lưu
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={busy}
          className="flex-1 rounded-pill bg-card-soft py-2.5 text-sm font-semibold disabled:opacity-40"
        >
          Khôi phục từ file
        </button>
        <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImportFile} className="hidden" />
      </div>

      {backups.length > 0 && (
        <div className="mt-3 flex flex-col gap-1.5">
          <p className="text-xs text-muted">Bản sao lưu gần đây</p>
          {backups.slice(0, 5).map((b) => (
            <div key={b.id} className="flex items-center justify-between gap-2 rounded-pill bg-card-soft px-3 py-2">
              <span className="text-xs">{BACKUP_DATETIME_FORMATTER.format(new Date(b.createdAt))}</span>
              <button
                type="button"
                disabled={busy}
                onClick={() => handleRestore(b.id, BACKUP_DATETIME_FORMATTER.format(new Date(b.createdAt)))}
                className="text-xs font-medium text-accent disabled:opacity-40"
              >
                Khôi phục
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
