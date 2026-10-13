'use client'

import { useState } from 'react'
import { categoryOf, formatDate, formatVND, type Fund, type FundEntry, type FundMember } from '@/lib/trips/types'
import { PhotoViewer } from './PhotoViewer'
import { Avatar } from './ui'

// Quỹ góp: tổng hợp + chi tiết chi tiêu của đợt đang xem (hoặc mọi đợt). Phân theo nhóm là 1 chuỗi số liệu (độ lớn
// từng nhóm) → thanh ngang 1 màu sắp giảm dần, ghi số trực tiếp trên từng thanh; danh sách chi tiết bên dưới là bảng số liệu.
export function SpendingTab({
  fund,
  members,
  entries,
  scopeLabel,
  remaining,
  onEdit,
}: {
  fund: Fund
  members: FundMember[]
  entries: FundEntry[] // khoản trong phạm vi đang xem (đợt / tất cả)
  scopeLabel: string
  remaining: number // tiền quỹ còn lại sau các khoản chi này
  onEdit?: (e: FundEntry) => void // không truyền = chỉ xem (trang chia sẻ)
}) {
  const [copied, setCopied] = useState(false)
  const [viewer, setViewer] = useState<{ entry: FundEntry; i: number } | null>(null)
  const spent = entries
    .filter((e) => e.type === 'out' && e.done)
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
  const planned = entries.filter((e) => e.type === 'out' && !e.done)
  const total = spent.reduce((n, e) => n + e.amount, 0)
  const plannedTotal = planned.reduce((n, e) => n + e.amount, 0)
  const advanced = spent.filter((e) => e.memberId).reduce((n, e) => n + e.amount, 0)
  const photos = spent.reduce((n, e) => n + e.attachments.length, 0)

  // Gộp theo nhóm chi, nhiều → ít
  const byCat = new Map<string, { key: string; amount: number; count: number }>()
  for (const e of spent) {
    const c = byCat.get(e.category) ?? { key: e.category, amount: 0, count: 0 }
    c.amount += e.amount
    c.count += 1
    byCat.set(e.category, c)
  }
  const cats = [...byCat.values()].sort((a, b) => b.amount - a.amount)
  const max = cats[0]?.amount ?? 0

  const nameOf = (id: string | null) => (id ? (members.find((m) => m.id === id)?.name ?? '?') : null)

  // Báo cáo chi tiêu dạng văn bản thuần để dán vào nhóm chat
  async function copyReport() {
    const lines = [`${fund.icon} ${fund.name} — chi tiêu ${scopeLabel}`, `Tổng đã chi: ${formatVND(total)} (${spent.length} khoản)`]
    if (plannedTotal) lines.push(`Dự chi thêm: ${formatVND(plannedTotal)}`)
    lines.push(`Quỹ còn lại: ${formatVND(remaining)}`)
    if (cats.length > 1) {
      lines.push('', 'Theo nhóm:')
      for (const c of cats) {
        const cat = categoryOf('out', c.key)
        lines.push(`${cat.icon} ${cat.label}: ${formatVND(c.amount)} (${Math.round((c.amount / total) * 100)}%)`)
      }
    }
    lines.push('', 'Chi tiết:')
    for (const e of [...spent].reverse()) {
      const payer = nameOf(e.memberId)
      lines.push(
        `- ${formatDate(e.date).slice(0, 5)} · ${e.note || categoryOf('out', e.category).label}: ${formatVND(e.amount)}${payer ? ` (${payer} ứng)` : ''}`,
      )
    }
    const text = lines.join('\n')
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Mở qua http (IP mạng LAN) không có Clipboard API → cách cũ
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!spent.length && !planned.length)
    return (
      <div className="tp-ticket mx-auto mt-8 max-w-md p-8 text-center">
        <p className="text-4xl">💸</p>
        <p className="tp-display mt-2 text-lg font-bold">Chưa có khoản chi nào</p>
        <p className="mt-1 text-sm text-muted">Bấm &ldquo;Chi tiêu&rdquo; bên dưới để ghi khoản chi đầu tiên ({scopeLabel}).</p>
      </div>
    )

  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:items-start">
      {/* Tổng hợp */}
      <section className="min-w-0 space-y-4 lg:sticky lg:top-16">
        <div className="tp-ticket p-4">
          <p className="tp-label">Đã chi · {scopeLabel}</p>
          <p className="tp-display text-3xl font-black text-danger">{formatVND(total)}</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <Tile label="Số khoản" value={String(spent.length)} />
            <Tile label="Quỹ còn lại" value={formatVND(remaining)} tone={remaining < 0 ? 'text-danger' : 'text-accent'} />
            {plannedTotal > 0 && <Tile label="Dự chi thêm" value={formatVND(plannedTotal)} />}
            {advanced > 0 && <Tile label="Thành viên ứng" value={formatVND(advanced)} />}
          </div>
          {photos > 0 && <p className="mt-2 text-xs text-muted">📎 {photos} ảnh chứng từ đính kèm</p>}
          <button
            type="button"
            onClick={copyReport}
            className={`mt-3 flex w-full items-center justify-center gap-2 rounded-pill border py-2.5 text-sm font-semibold transition active:scale-[0.98] ${
              copied ? 'border-accent bg-accent text-white' : 'border-accent/40 bg-accent-soft text-accent hover:border-accent'
            }`}
          >
            {copied ? '✓ Đã copy — dán vào nhóm chat' : '📋 Copy báo cáo chi tiêu'}
          </button>
        </div>

        {cats.length > 0 && (
          <div className="tp-ticket p-4">
            <p className="tp-label mb-3">Theo nhóm</p>
            <ul className="space-y-3">
              {cats.map((c) => {
                const cat = categoryOf('out', c.key)
                const pct = total ? (c.amount / total) * 100 : 0
                return (
                  <li key={c.key} title={`${cat.label}: ${formatVND(c.amount)} · ${c.count} khoản · ${Math.round(pct)}%`}>
                    <div className="flex items-baseline justify-between gap-2 text-sm">
                      <span className="truncate font-medium">
                        {cat.icon} {cat.label} <span className="text-xs text-muted">· {c.count} khoản</span>
                      </span>
                      <span className="shrink-0 font-semibold">
                        {formatVND(c.amount)} <span className="text-xs font-normal text-muted">{Math.round(pct)}%</span>
                      </span>
                    </div>
                    {/* Thanh mảnh, đầu thanh bo tròn, nền là track nhạt — độ dài theo nhóm lớn nhất */}
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-card-soft">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${max ? (c.amount / max) * 100 : 0}%` }} />
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </section>

      {/* Chi tiết */}
      <section className="min-w-0">
        <h3 className="tp-display mb-3 text-lg font-bold text-(--tp-ink)">🧾 Chi tiết từng khoản</h3>
        {planned.length > 0 && (
          <p className="mb-3 rounded-xl bg-card-soft px-3 py-2 text-xs text-muted">
            ⏳ {planned.length} khoản dự chi ({formatVND(plannedTotal)}) chưa tính vào tổng — xem ở tab Khoản thu chi.
          </p>
        )}
        <div className="tp-ticket overflow-hidden">
          {spent.map((e) => {
            const cat = categoryOf('out', e.category)
            const payer = members.find((m) => m.id === e.memberId)
            const info = (
              <>
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-semibold">{e.note || cat.label}</span>
                  <span className="tp-mono shrink-0 text-sm font-semibold tracking-normal text-danger">−{formatVND(e.amount)}</span>
                </span>
                <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted">
                  <span>{formatDate(e.date)}</span>
                  <span>·</span>
                  <span>{cat.label}</span>
                  <span>·</span>
                  {payer ? (
                    <span className="inline-flex items-center gap-1">
                      <Avatar id={payer.id} name={payer.name} size={16} />
                      {payer.name} ứng
                    </span>
                  ) : (
                    <span>Quỹ chung</span>
                  )}
                </span>
              </>
            )
            return (
              <div key={e.id} className="flex items-start gap-3 border-b border-dashed border-border px-4 py-3 last:border-b-0">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-danger-soft text-lg">{cat.icon}</span>
                <div className="min-w-0 flex-1">
                  {onEdit ? (
                    <button type="button" onClick={() => onEdit(e)} className="block w-full rounded-lg text-left transition hover:opacity-80">
                      {info}
                    </button>
                  ) : (
                    <div>{info}</div>
                  )}
                  {e.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {e.attachments.slice(0, 4).map((p, i) => (
                        <button
                          key={p.key}
                          type="button"
                          onClick={() => setViewer({ entry: e, i })}
                          aria-label={`Xem ảnh chứng từ ${i + 1}`}
                          className="overflow-hidden rounded-lg"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element -- ảnh R2 domain động */}
                          <img src={p.url} alt="" loading="lazy" className="h-12 w-12 object-cover transition hover:scale-105" />
                        </button>
                      ))}
                      {e.attachments.length > 4 && (
                        <button
                          type="button"
                          onClick={() => setViewer({ entry: e, i: 4 })}
                          className="flex h-12 w-12 items-center justify-center rounded-lg bg-card-soft text-xs font-semibold text-muted"
                        >
                          +{e.attachments.length - 4}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <p className="mt-3 px-1 text-xs text-muted">{onEdit ? 'Bấm 1 khoản để sửa, bấm ảnh để xem lớn.' : 'Bấm ảnh chứng từ để xem lớn.'}</p>
        {viewer && <PhotoViewer fund={fund} entry={viewer.entry} members={members} start={viewer.i} onClose={() => setViewer(null)} />}
      </section>
    </div>
  )
}

function Tile({ label, value, tone = '' }: { label: string; value: string; tone?: string }) {
  return (
    <div className="min-w-0 rounded-xl bg-card-soft px-3 py-2">
      <p className="tp-label truncate">{label}</p>
      <p className={`truncate font-semibold ${tone}`}>{value}</p>
    </div>
  )
}
