'use client'

import { useCallback, useEffect, useState } from 'react'
import { fundTheme } from '@/lib/trips/themes'
import {
  effectiveTarget,
  formatDate,
  formatVND,
  isLeft,
  isOpeningEntry,
  kindOf,
  memberBalances,
  openingEntryId,
  roundMemberView,
  roundSummaries,
  sortRounds,
  summarize,
  type Fund,
  type FundEntry,
  type FundMember,
  type FundRound,
} from '@/lib/trips/types'
import { BottomSheet } from '@/components/money/BottomSheet'
import { SheetHeader } from '@/components/money/SheetHeader'
import { SpendingTab } from './SpendingTab'
import { DuesTab, SettleTab } from './TripDetail'
import { Avatar, dateLabels, ticketCode, ticketTag, TripRoute } from './ui'

async function fetchShared(slug: string): Promise<SharedData> {
  const res = await fetch(`/api/trips/share/${encodeURIComponent(slug)}`, { cache: 'no-store' })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.error ?? `Lỗi ${res.status}`)
  return json as SharedData
}

interface SharedData {
  fund: Fund
  members: FundMember[]
  rounds: FundRound[]
  entries: FundEntry[]
}

// Trang xem qua link chia sẻ (/trips/share/[slug]) — CHỈ XEM: không có nút sửa / xoá / ghi nhận nào. Gom tổng quan và
// chi tiết vào 1 màn hình: thông tin chung + số dư → (quỹ góp) chọn đợt → tình hình đóng góp → chi tiêu → (chuyến đi) chia tiền.
export function SharedTripView({ slug }: { slug: string }) {
  const [data, setData] = useState<SharedData | null>(null)
  const [error, setError] = useState('')
  const [loadedAt, setLoadedAt] = useState<Date | null>(null)
  const [roundSel, setRoundSel] = useState<string | null>(null) // null = đợt mới nhất, 'all' = gộp mọi đợt
  const [detailOpen, setDetailOpen] = useState(false) // popup chi tiết đóng góp

  // Tải (và tải lại khi bấm "Cập nhật"): state chỉ set trong callback của promise
  const load = useCallback(() => {
    fetchShared(slug).then(
      (d) => {
        setData(d)
        setLoadedAt(new Date())
        setError('')
      },
      (e: Error) => setError(e.message),
    )
  }, [slug])

  useEffect(() => {
    let alive = true
    fetchShared(slug).then(
      (d) => {
        if (!alive) return
        setData(d)
        setLoadedAt(new Date())
      },
      (e: Error) => alive && setError(e.message),
    )
    return () => {
      alive = false
    }
  }, [slug])

  if (error && !data)
    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <div className="tp-ticket max-w-sm p-8 text-center">
          <p className="text-5xl">🔒</p>
          <p className="tp-display mt-3 text-xl font-bold text-(--tp-ink)">Không xem được</p>
          <p className="mt-1 text-sm text-muted">{error}</p>
          <p className="mt-3 text-xs text-muted">Hỏi lại người gửi link mới nhé.</p>
        </div>
      </div>
    )
  if (!data) return null

  const { fund, members, entries } = data
  const rounds = sortRounds(data.rounds)
  const theme = fundTheme(fund)
  const usesRounds = fund.kind !== 'trip'
  const summaries = roundSummaries(rounds, entries)
  const latest = rounds.at(-1) ?? null
  const round = usesRounds && roundSel !== 'all' ? (rounds.find((r) => r.id === roundSel) ?? latest) : null
  const rs = round ? summaries.find((x) => x.round.id === round.id) : undefined
  const initial = round ? (entries.find((e) => e.id === openingEntryId(round.id))?.amount ?? 0) : 0
  const viewEntries = round ? entries.filter((e) => e.roundId === round.id && !isOpeningEntry(e)) : entries
  const base = rs ?? summarize(entries)
  const s = { ...base, collected: base.collected - initial }
  const opening = (rs?.opening ?? 0) + initial
  const balance = rs ? rs.closing : s.balance
  const participants = round ? members.filter((m) => round.memberIds.includes(m.id)) : members.filter((m) => !isLeft(m))
  const target = round ? round.target || round.perMemberTarget * participants.length : usesRounds ? 0 : effectiveTarget(fund, members)
  const gathered = opening + s.collected
  const pct = target > 0 ? Math.min(100, (gathered / target) * 100) : 0
  const startDate = round ? round.startDate : fund.startDate
  const endDate = round ? round.endDate : fund.endDate
  const scopeLabel = round ? round.name : usesRounds ? 'tất cả đợt' : 'cả chuyến'

  return (
    <div className={`tp-theme-${theme.key} tp-themed w-full px-4 pb-16 pt-5 md:px-8`}>
      {/* Thanh trên: nhắc đây là chế độ chỉ xem */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-card px-3 py-1 text-xs font-semibold text-muted">
          👀 Chế độ chỉ xem
        </span>
        <button
          type="button"
          onClick={load}
          className="rounded-pill border border-border bg-card px-3 py-1 text-xs font-medium text-accent hover:border-accent"
          title="Tải lại số liệu mới nhất"
        >
          ↻ Cập nhật{loadedAt && ` · ${loadedAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`}
        </button>
      </div>

      {/* Vé tổng quan */}
      <section className="tp-ticket mt-4 overflow-hidden">
        <div className="tp-ticket-band flex items-center justify-between px-5 py-3 md:px-7">
          <span className="tp-label text-white/85!">
            {ticketTag(fund)} · {kindOf(fund.kind).label}
            {round && ` · ${round.name}`}
          </span>
          <span className="tp-mono text-[11px] text-white/60">{ticketCode(fund.id)}</span>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="relative min-w-0 flex-1 p-5 md:p-7">
            {(fund.closed || round?.closed) && <span className="tp-stamp right-6 top-5 text-sm">{theme.stamp}</span>}
            <div className="flex items-start gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-card-soft text-4xl">{fund.icon}</span>
              <div className="min-w-0">
                <h1 className="tp-title text-3xl font-black leading-tight text-(--tp-ink) md:text-4xl">{fund.name}</h1>
                {round && <p className="mt-1 text-sm font-semibold text-accent">🔁 {round.name}</p>}
                {fund.location && <p className="mt-1 text-sm text-muted">📍 {fund.location}</p>}
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Field label={dateLabels(fund)[0]} value={startDate ? formatDate(startDate) : '—'} />
              <Field label={dateLabels(fund)[1]} value={endDate ? formatDate(endDate) : '—'} />
              <Field label={round ? 'Tham gia đợt' : theme.people} value={String(participants.length).padStart(2, '0')} />
            </div>
            {target > 0 && (
              <div className="mt-6">
                <TripRoute pct={pct} theme={theme} />
                <p className="mt-1 text-xs text-muted">
                  Đã gom <b className="text-text">{formatVND(gathered)}</b> / {formatVND(target)} ({Math.round(pct)}%)
                </p>
              </div>
            )}
            {participants.length > 0 && (
              <div className="mt-5 flex flex-wrap -space-x-2">
                {participants.map((m) => (
                  <span key={m.id} title={m.name}>
                    <Avatar id={m.id} name={m.name} size={30} />
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="tp-perf tp-perf--split" />
          <div className="flex flex-col gap-4 p-5 md:w-80 md:p-7">
            <div>
              <p className="tp-label">{round && round.id !== latest?.id ? 'Còn cuối đợt' : 'Còn trong quỹ'}</p>
              <p className={`tp-display text-4xl font-black ${balance < 0 ? 'text-danger' : 'text-(--tp-ink)'}`}>{formatVND(balance)}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {round && <Stat label={round.id === rounds[0]?.id ? '💰 Dư ban đầu' : '♻️ Dư đầu đợt'} value={opening} tone="text-accent" />}
              <Stat label="Đã thu" value={s.collected} tone="text-income" />
              <Stat label="Đã chi" value={s.spent} tone="text-danger" />
              <Stat label="Chờ thu" value={s.pendingIn} />
            </div>
            <span className="tp-barcode w-full" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Chọn đợt (quỹ góp) — chỉ để xem, không tạo / sửa đợt */}
      {usesRounds && rounds.length > 0 && (
        <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden">
          {rounds.map((r, i) => {
            const on = r.id === round?.id
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setRoundSel(r.id)}
                className={`shrink-0 rounded-2xl border px-3.5 py-2 text-left transition ${
                  on ? 'border-(--tp-ink) bg-(--tp-ink) text-white shadow' : 'border-border bg-card hover:border-accent'
                }`}
              >
                <span className="block text-sm font-semibold">
                  {r.closed ? '✓ ' : ''}
                  {r.name}
                </span>
                <span className={`block text-[11px] ${on ? 'text-white/70' : 'text-muted'}`}>
                  Đợt {i + 1} · {r.memberIds.length} người
                </span>
              </button>
            )
          })}
          {rounds.length > 1 && (
            <button
              type="button"
              onClick={() => setRoundSel('all')}
              className={`shrink-0 rounded-2xl border px-3.5 py-2 text-sm font-semibold transition ${
                roundSel === 'all' ? 'border-(--tp-ink) bg-(--tp-ink) text-white' : 'border-border bg-card text-muted hover:border-accent'
              }`}
            >
              Tất cả đợt
            </button>
          )}
        </div>
      )}

      {/* Chi tiêu — phần người xem quan tâm nhất nên đặt trên cùng */}
      <Section title="💸 Chi tiêu">
        <SpendingTab fund={fund} members={members} entries={viewEntries} scopeLabel={scopeLabel} remaining={balance} />
      </Section>

      {/* Đóng góp — thẻ tóm tắt gọn, chi tiết mở trong popup */}
      <Section title={usesRounds ? '📋 Tình hình đóng góp' : `👥 ${theme.people} & đóng góp`}>
        {usesRounds ? (
          <DuesCompact members={members} entries={entries} rounds={rounds} round={round ?? latest} onOpen={() => setDetailOpen(true)} />
        ) : (
          <TripCompact members={members} entries={entries} rounds={rounds} onOpen={() => setDetailOpen(true)} />
        )}
      </Section>
      <BottomSheet open={detailOpen} onClose={() => setDetailOpen(false)} responsive>
        <SheetHeader
          title={usesRounds ? `Chi tiết đóng góp · ${(round ?? latest)?.name ?? ''}` : 'Chi tiết đóng góp'}
          onCancel={() => setDetailOpen(false)}
          cancelLabel="Đóng"
        />
        <div className="px-4 pb-6">
          {usesRounds ? (
            <DuesTab
              members={members}
              entries={entries}
              rounds={rounds}
              round={round ?? latest}
              fund={fund}
              cash={summarize(entries).balance}
              readOnly
            />
          ) : (
            <TripContributions members={members} entries={entries} rounds={rounds} />
          )}
        </div>
      </BottomSheet>

      {/* Chia tiền — chỉ chuyến đi */}
      {!usesRounds && (
        <Section title="🔁 Chia tiền">
          <SettleTab fund={fund} members={members} entries={entries} rounds={rounds} balance={summarize(entries).balance} readOnly />
        </Section>
      )}

      <p className="mt-10 text-center text-xs text-muted">Trang chỉ xem do người quản lý quỹ chia sẻ · số liệu cập nhật khi tải lại trang</p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="tp-display flex items-center gap-3 text-xl font-bold text-(--tp-ink)">
        {title}
        <span className="h-px flex-1 border-t-2 border-dashed border-border" />
      </h2>
      {children}
    </section>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="tp-label truncate">{label}</p>
      <p className="tp-mono truncate text-base font-medium text-(--tp-ink) md:text-lg">{value}</p>
    </div>
  )
}

function Stat({ label, value, tone = '' }: { label: string; value: number; tone?: string }) {
  return (
    <div className="min-w-0 rounded-xl bg-card-soft px-3 py-2">
      <p className="tp-label truncate">{label}</p>
      <p className={`truncate font-semibold ${tone}`}>{formatVND(value)}</p>
    </div>
  )
}

// Chuyến đi: mỗi người đã góp / phải chịu / được nhận hay còn thiếu (bảng gọn, chỉ xem)
function TripContributions({ members, entries, rounds }: { members: FundMember[]; entries: FundEntry[]; rounds: FundRound[] }) {
  const rows = memberBalances(members, entries, rounds).sort((a, b) => a.member.name.localeCompare(b.member.name, 'vi', { sensitivity: 'base' }))
  if (!rows.length) return <p className="mt-4 text-sm text-muted">Chưa có thành viên.</p>
  return (
    <div className="tp-ticket mt-4 overflow-hidden">
      {rows.map((b) => (
        <div key={b.member.id} className="flex items-center gap-3 border-b border-dashed border-border px-4 py-3 last:border-b-0">
          <Avatar id={b.member.id} name={b.member.name} size={36} faded={isLeft(b.member)} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{b.member.name}</p>
            <p className="truncate text-xs text-muted">
              Đã góp {formatVND(b.contributed)}
              {b.advanced > 0 && ` · ứng ${formatVND(b.advanced)}`} · phải chịu {formatVND(b.share)}
            </p>
          </div>
          <p className={`shrink-0 text-right text-sm font-semibold ${b.net > 0.5 ? 'text-income' : b.net < -0.5 ? 'text-danger' : 'text-muted'}`}>
            {b.net > 0.5 ? `Được nhận ${formatVND(b.net)}` : b.net < -0.5 ? `Còn thiếu ${formatVND(-b.net)}` : 'Đã hoà ✓'}
          </p>
        </div>
      ))}
    </div>
  )
}

// Thẻ tóm tắt đóng góp của 1 đợt (quỹ góp): đã đóng X/Y, còn thiếu bao nhiêu, ai còn thiếu (chip), ai đã đủ (avatar)
function DuesCompact({
  members,
  entries,
  rounds,
  round,
  onOpen,
}: {
  members: FundMember[]
  entries: FundEntry[]
  rounds: FundRound[]
  round: FundRound | null
  onOpen: () => void
}) {
  if (!round) return <p className="mt-4 text-sm text-muted">Chưa có đợt nào.</p>
  const per = round.perMemberTarget
  const rows = roundMemberView(round, rounds, members, entries)
    .filter((b) => b.inRound)
    .map((b) => {
      const need = per > 0 ? Math.max(0, per - b.carryIn) : 0
      const remaining = per > 0 ? Math.max(0, need - b.contributed) : 0
      const done = per > 0 ? remaining === 0 : b.contributed > 0
      return { b, remaining, done }
    })
  const byName = (a: (typeof rows)[number], b: (typeof rows)[number]) => a.b.member.name.localeCompare(b.b.member.name, 'vi', { sensitivity: 'base' })
  const owing = rows.filter((r) => !r.done).sort((a, b) => b.remaining - a.remaining || byName(a, b))
  const paid = rows.filter((r) => r.done).sort(byName)
  const missing = owing.reduce((n, r) => n + r.remaining, 0)
  const pct = rows.length ? (paid.length / rows.length) * 100 : 0

  return (
    <button
      type="button"
      onClick={onOpen}
      className="tp-ticket group mt-4 block w-full p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="tp-label">Đã đóng</p>
          <p className="tp-display text-2xl font-bold text-(--tp-ink)">
            {paid.length}/{rows.length} <span className="text-base font-semibold text-muted">người</span>
          </p>
        </div>
        {per > 0 && (
          <div className="text-right">
            <p className="tp-label">Còn thiếu</p>
            <p className={`tp-display text-2xl font-bold ${missing > 0 ? 'text-danger' : 'text-accent'}`}>
              {missing > 0 ? formatVND(missing) : 'Đủ rồi ✓'}
            </p>
          </div>
        )}
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-card-soft">
        <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
      </div>

      {owing.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold text-danger">❌ Chưa đóng đủ ({owing.length})</p>
          <div className="flex flex-wrap gap-1.5">
            {owing.slice(0, 8).map((r) => (
              <span
                key={r.b.member.id}
                className="inline-flex items-center gap-1.5 rounded-pill bg-danger-soft py-1 pl-1 pr-2.5 text-xs font-medium text-danger"
              >
                <Avatar id={r.b.member.id} name={r.b.member.name} size={20} />
                {r.b.member.name}
                {per > 0 && <span className="font-semibold">· {formatVND(r.remaining)}</span>}
              </span>
            ))}
            {owing.length > 8 && (
              <span className="rounded-pill bg-card-soft px-2.5 py-1 text-xs font-semibold text-muted">+{owing.length - 8} người</span>
            )}
          </div>
        </div>
      )}
      {paid.length > 0 && (
        <div className="mt-4 flex items-center gap-3">
          <span className="flex -space-x-2">
            {paid.slice(0, 10).map((r) => (
              <Avatar key={r.b.member.id} id={r.b.member.id} name={r.b.member.name} size={26} />
            ))}
          </span>
          <span className="text-xs font-semibold text-accent">
            ✅ {paid.length} người đã đóng{paid.length > 10 ? ` (+${paid.length - 10})` : ''}
          </span>
        </div>
      )}
      <span className="mt-4 flex items-center justify-center gap-1 rounded-pill bg-card-soft py-2.5 text-sm font-semibold text-accent transition group-hover:bg-accent-soft">
        Xem chi tiết đóng góp →
      </span>
    </button>
  )
}

// Thẻ tóm tắt cho chuyến đi: ai còn thiếu / ai được nhận lại
function TripCompact({ members, entries, rounds, onOpen }: { members: FundMember[]; entries: FundEntry[]; rounds: FundRound[]; onOpen: () => void }) {
  const rows = memberBalances(members, entries, rounds)
  const owing = rows.filter((b) => b.net < -0.5).sort((a, b) => a.net - b.net)
  const receiving = rows.filter((b) => b.net > 0.5)
  const contributed = rows.reduce((n, b) => n + b.contributed, 0)
  return (
    <button
      type="button"
      onClick={onOpen}
      className="tp-ticket group mt-4 block w-full p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="rounded-xl bg-card-soft px-3 py-2">
          <p className="tp-label truncate">Thành viên</p>
          <p className="font-semibold">{rows.length}</p>
        </div>
        <div className="rounded-xl bg-card-soft px-3 py-2">
          <p className="tp-label truncate">Đã góp</p>
          <p className="truncate font-semibold text-income">{formatVND(contributed)}</p>
        </div>
        <div className="rounded-xl bg-card-soft px-3 py-2">
          <p className="tp-label truncate">Còn thiếu</p>
          <p className="font-semibold text-danger">{owing.length} người</p>
        </div>
      </div>
      {owing.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {owing.slice(0, 8).map((b) => (
            <span
              key={b.member.id}
              className="inline-flex items-center gap-1.5 rounded-pill bg-danger-soft py-1 pl-1 pr-2.5 text-xs font-medium text-danger"
            >
              <Avatar id={b.member.id} name={b.member.name} size={20} />
              {b.member.name} · {formatVND(-b.net)}
            </span>
          ))}
        </div>
      )}
      {receiving.length > 0 && <p className="mt-3 text-xs font-semibold text-income">↩ {receiving.length} người được nhận lại tiền</p>}
      <span className="mt-4 flex items-center justify-center gap-1 rounded-pill bg-card-soft py-2.5 text-sm font-semibold text-accent transition group-hover:bg-accent-soft">
        Xem chi tiết đóng góp →
      </span>
    </button>
  )
}
