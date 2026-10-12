'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { nanoid } from 'nanoid'
import { announceNavigation } from '@/components/loading/NavigationWatcher'
import { showError } from '@/lib/trips/dialog'
import { confirmDeleteFund, useTrips, type EntryInput, type FundInput } from '@/lib/trips/store'
import {
  categoryOf,
  daysBetween,
  effectiveTarget,
  FUND_ID,
  formatDate,
  formatVND,
  isLeft,
  kindOf,
  memberBalances,
  settle,
  summarize,
  todayISO,
  type EntryType,
  type Fund,
  type FundEntry,
  type FundMember,
} from '@/lib/trips/types'
import { EntrySheet, emptyEntry } from './EntrySheet'
import { FundSheet } from './FundSheet'
import { MemberSheet } from './MemberSheet'
import { themeOf } from '@/lib/trips/themes'
import { Avatar, BusyLabel, dateLabels, ticketCode, ticketTag, TripRoute } from './ui'

type Tab = 'entries' | 'members' | 'settle'

const TABS: { key: Tab; label: string }[] = [
  { key: 'entries', label: 'Khoản thu chi' },
  { key: 'members', label: 'Thành viên' },
  { key: 'settle', label: 'Chia tiền' },
]

export function TripDetail({ id }: { id: string }) {
  const router = useRouter()
  const { funds, members: allMembers, entries: allEntries, loadError, load } = useTrips()
  const [tab, setTab] = useState<Tab>('entries')
  const [editingFund, setEditingFund] = useState<FundInput | null>(null)
  const [entryDraft, setEntryDraft] = useState<{
    entry: EntryInput
    isNew: boolean
  } | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    load()
  }, [load])

  const fund = funds?.find((f) => f.id === id)
  const members = useMemo(() => allMembers.filter((m) => m.fundId === id), [allMembers, id])
  const entries = useMemo(() => allEntries.filter((e) => e.fundId === id), [allEntries, id])

  if (loadError) return <p className="p-6 text-sm text-danger">Không tải được dữ liệu: {loadError}</p>
  if (!funds) return <p className="p-6 text-sm text-muted">Đang tải…</p>
  if (!fund)
    return (
      <div className="p-6 text-sm">
        <p>Không tìm thấy.</p>
        <Link href="/trips" className="mt-2 inline-block text-accent">
          ← Về danh sách
        </Link>
      </div>
    )

  const s = summarize(entries)
  const target = effectiveTarget(fund, members)
  const addEntry = (type: EntryType) => setEntryDraft({ entry: emptyEntry(fund.id, type), isNew: true })
  const editEntry = (e: FundEntry) => setEntryDraft({ entry: { ...e }, isNew: false })
  const pct = target > 0 ? Math.min(100, (s.collected / target) * 100) : 0
  const treasurer = members.find((m) => m.id === fund.treasurerId)
  const theme = themeOf(fund.theme)

  return (
    <div className={`tp-theme-${theme.key} tp-themed w-full px-4 pb-28 pt-5 md:px-8`}>
      <div className="flex items-center justify-between">
        <Link href="/trips" className="tp-label hover:text-accent">
          ← Hành trình
        </Link>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEditingFund({ ...fund })}
            className="rounded-pill border border-border bg-card px-3 py-1 text-sm font-medium text-accent hover:border-accent"
          >
            ✎ Sửa
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={async () => {
              if (await confirmDeleteFund(fund, () => setDeleting(true))) {
                announceNavigation('/trips')
                router.push('/trips')
              } else setDeleting(false)
            }}
            className="rounded-pill border border-border bg-card px-3 py-1 text-sm font-medium text-danger hover:border-danger disabled:opacity-70"
          >
            <BusyLabel busy={deleting} label="Đang xoá…">
              🗑 Xoá
            </BusyLabel>
          </button>
        </div>
      </div>

      <section className="tp-ticket mt-4 overflow-hidden">
        <div className="tp-ticket-band flex items-center justify-between px-5 py-3 md:px-7">
          <span className="tp-label text-white/85!">
            {ticketTag(fund)} · {kindOf(fund.kind).label}
          </span>
          <span className="tp-mono text-[11px] text-white/60">{ticketCode(fund.id)}</span>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Phần chính của vé */}
          <div className="relative min-w-0 flex-1 p-5 md:p-7">
            {fund.closed && <span className="tp-stamp right-6 top-5 text-sm">{theme.stamp}</span>}
            <div className="flex items-start gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-card-soft text-4xl">{fund.icon}</span>
              <div className="min-w-0">
                <h1 className="tp-title text-3xl font-black leading-tight text-(--tp-ink) md:text-4xl">{fund.name}</h1>
                {fund.location && <p className="mt-1 text-sm text-muted">📍 {fund.location}</p>}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <HeroField label={dateLabels(fund)[0]} value={fund.startDate ? formatDate(fund.startDate) : '—'} />
              <HeroField label={dateLabels(fund)[1]} value={fund.endDate ? formatDate(fund.endDate) : '—'} />
              <HeroField label={theme.people} value={String(members.filter((m) => !isLeft(m)).length).padStart(2, '0')} />
              <HeroField label="Giữ quỹ" value={treasurer?.name ?? '—'} mono={false} />
            </div>

            {target > 0 && (
              <div className="mt-6">
                <TripRoute pct={pct} theme={theme} />
                <p className="mt-1 text-xs text-muted">
                  Đã gom <b className="text-text">{formatVND(s.collected)}</b> / {formatVND(target)} ({Math.round(pct)}%)
                  {s.collected + s.pendingIn < target && ` · còn ${formatVND(target - s.collected - s.pendingIn)} chưa ai nhận góp`}
                </p>
              </div>
            )}

            {members.length > 0 && (
              <div className="mt-5 flex -space-x-2">
                {members
                  .filter((m) => !isLeft(m))
                  .map((m) => (
                    <span key={m.id} title={m.name}>
                      <Avatar id={m.id} name={m.name} size={32} />
                    </span>
                  ))}
              </div>
            )}
            {fund.note && <p className="mt-4 whitespace-pre-line text-sm text-muted">{fund.note}</p>}
          </div>

          <div className="tp-perf tp-perf--split" />

          {/* Cuống vé: số dư */}
          <div className="flex flex-col justify-between gap-4 p-5 md:w-80 md:p-7">
            <div>
              <p className="tp-label">Còn trong quỹ</p>
              <p className={`tp-display text-4xl font-black ${s.balance < 0 ? 'text-danger' : 'text-(--tp-ink)'}`}>{formatVND(s.balance)}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Stat label="Đã thu" value={s.collected} className="text-income" />
              <Stat label="Đã chi" value={s.spent} className="text-danger" />
              <Stat label="Chờ thu" value={s.pendingIn} />
              <Stat label="Dự chi" value={s.pendingOut} />
            </div>
            {s.spent > s.spentFromFund && (
              <p className="text-xs text-muted">Trong đó {formatVND(s.spent - s.spentFromFund)} do thành viên ứng tiền túi — xem tab Chia tiền.</p>
            )}
            <span className="tp-barcode w-full" aria-hidden="true" />
          </div>
        </div>
      </section>

      <nav className="sticky top-2 z-30 mt-6 flex gap-1 rounded-pill border border-border bg-card/90 p-1 shadow-sm backdrop-blur">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex-1 rounded-pill py-2 text-sm font-medium transition ${
              tab === t.key ? 'bg-(--tp-ink) text-white shadow' : 'text-muted hover:text-text'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'entries' && <EntriesTab fund={fund} members={members} entries={entries} onEdit={editEntry} />}
      {tab === 'members' && <MembersTab fund={fund} members={members} entries={entries} />}
      {tab === 'settle' && <SettleTab fund={fund} members={members} entries={entries} balance={s.balance} />}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/90 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 backdrop-blur md:inset-x-auto md:bottom-6 md:right-8 md:rounded-pill md:border md:p-2 md:shadow-xl">
        <div className="flex gap-3 md:gap-2">
          <button
            type="button"
            onClick={() => addEntry('in')}
            className="flex-1 whitespace-nowrap rounded-pill bg-(--tp-ink) py-3 text-sm font-semibold text-white transition active:scale-95 md:px-7"
          >
            ↓ Thu tiền
          </button>
          <button
            type="button"
            onClick={() => addEntry('out')}
            className="flex-1 whitespace-nowrap rounded-pill bg-danger py-3 text-sm font-semibold text-white transition active:scale-95 md:px-7"
          >
            ↑ Chi tiêu
          </button>
        </div>
      </div>

      <FundSheet open={!!editingFund} fund={editingFund} isNew={false} onClose={() => setEditingFund(null)} onDeleted={() => router.push('/trips')} />
      <EntrySheet
        fund={fund}
        members={members}
        entry={entryDraft?.entry ?? null}
        isNew={entryDraft?.isNew ?? true}
        onClose={() => setEntryDraft(null)}
      />
    </div>
  )
}

function Stat({ label, value, className = '' }: { label: string; value: number; className?: string }) {
  return (
    <div className="min-w-0 rounded-xl bg-card-soft px-3 py-2">
      <p className="tp-label truncate">{label}</p>
      <p className={`truncate font-semibold ${className}`}>{formatVND(value)}</p>
    </div>
  )
}

function HeroField({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="tp-label truncate">{label}</p>
      <p className={`${mono ? 'tp-mono' : 'font-semibold'} truncate text-base font-medium text-(--tp-ink) md:text-lg`}>{value}</p>
    </div>
  )
}

function nameOf(members: FundMember[], id: string | null) {
  if (!id) return null
  return members.find((m) => m.id === id)?.name ?? '(đã xoá)'
}

function entryWho(members: FundMember[], e: FundEntry) {
  const name = nameOf(members, e.memberId)
  if (e.type === 'transfer') return `${name ?? 'Quỹ'} → ${nameOf(members, e.toMemberId) ?? 'Quỹ'}`
  if (e.type === 'in') return name ? `${name} góp` : 'Nguồn khác · chia đều lại'
  const payer = name ? `${name} ứng` : 'Quỹ chung'
  if (!members.length) return payer
  const n = e.splits.length
  return `${payer} · chia ${n ? `${n} người` : 'cả nhóm'}`
}

function EntryRow({
  members,
  e,
  onEdit,
  onMarkDone,
  marking = false,
}: {
  members: FundMember[]
  e: FundEntry
  onEdit: () => void
  onMarkDone?: () => void
  marking?: boolean // đang lưu "đã thu/chi" của dòng này
}) {
  const cat = categoryOf(e.type, e.category)
  const today = todayISO()
  const overdue = !e.done && e.date < today
  const late = e.done && e.dueDate && e.date > e.dueDate ? daysBetween(e.dueDate, e.date) : 0
  const color = e.type === 'in' ? 'text-income' : e.type === 'out' ? 'text-danger' : 'text-accent'
  const tile = e.type === 'in' ? 'bg-income/10' : e.type === 'out' ? 'bg-danger-soft' : 'bg-accent-soft'
  const who = members.find((m) => m.id === e.memberId)
  return (
    <div className="flex items-center gap-3 border-b border-dashed border-border px-4 py-3 transition last:border-b-0 hover:bg-card-soft/50">
      <button type="button" onClick={onEdit} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <span className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-lg ${tile}`}>
          {cat.icon}
          {who && (
            <span className="absolute -bottom-1 -right-1">
              <Avatar id={who.id} name={who.name} size={18} />
            </span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{e.note || cat.label}</span>
          <span className="block truncate text-xs text-muted">
            {!e.done && (
              <span className={overdue ? 'font-semibold text-danger' : ''}>
                {overdue ? 'Quá hạn ' : 'Hạn '}
                {formatDate(e.date)} ·{' '}
              </span>
            )}
            {entryWho(members, e)}
            {late > 0 && <span className="text-danger"> · trễ {late} ngày</span>}
          </span>
        </span>
        <span className={`tp-mono shrink-0 text-sm font-semibold tracking-normal ${color} ${e.done ? '' : 'opacity-60'}`}>
          {e.type === 'in' ? '+' : e.type === 'out' ? '−' : ''}
          {formatVND(e.amount)}
        </span>
      </button>
      {onMarkDone && (
        <button
          type="button"
          onClick={onMarkDone}
          disabled={marking}
          title="Đánh dấu đã xong (ngày = hôm nay)"
          className="shrink-0 rounded-pill border border-accent px-2.5 py-1 text-xs font-semibold text-accent disabled:opacity-70"
        >
          <BusyLabel busy={marking} label="Đang lưu">
            ✓<span className="hidden sm:inline"> {e.type === 'in' ? 'Đã thu' : e.type === 'out' ? 'Đã chi' : 'Đã chuyển'}</span>
          </BusyLabel>
        </button>
      )}
    </div>
  )
}

const WEEKDAY = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

// Tiêu đề 1 ngày trong lịch trình: chuyến đi có ngày khởi hành thì ghi "Ngày N", ngoài khoảng chuyến thì "Trước / Sau chuyến"
function dayTitle(fund: Fund, date: string) {
  const wd = WEEKDAY[new Date(date + 'T00:00:00').getDay()]
  const base = `${wd}, ${formatDate(date)}`
  if (fund.kind !== 'trip' || !fund.startDate) return { main: base, sub: '' }
  const n = daysBetween(fund.startDate, date) + 1
  if (n < 1) return { main: base, sub: 'Trước chuyến' }
  if (fund.endDate && date > fund.endDate) return { main: base, sub: 'Sau chuyến' }
  return { main: `Ngày ${n}`, sub: base }
}

function EntriesTab({ fund, members, entries, onEdit }: { fund: Fund; members: FundMember[]; entries: FundEntry[]; onEdit: (e: FundEntry) => void }) {
  const theme = themeOf(fund.theme)
  const saveEntries = useTrips((s) => s.saveEntries)
  const today = todayISO()
  const planned = entries.filter((e) => !e.done).sort((a, b) => a.date.localeCompare(b.date))
  const done = entries.filter((e) => e.done).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))

  const days: { date: string; items: FundEntry[] }[] = []
  for (const e of done) {
    const last = days[days.length - 1]
    if (last?.date === e.date) last.items.push(e)
    else days.push({ date: e.date, items: [e] })
  }

  // Bấm "✓" ở khoản dự kiến → ghi nhận đã xong, ngày thực tế = hôm nay; giữ hạn gốc ở dueDate để biết trễ bao lâu
  const [marking, setMarking] = useState<Set<string>>(new Set())
  const markDone = async (e: FundEntry) => {
    setMarking((s) => new Set(s).add(e.id))
    try {
      await saveEntries([{ ...e, done: true, date: today, dueDate: e.dueDate ?? e.date }], false)
    } catch (err) {
      showError(err)
    } finally {
      setMarking((s) => {
        const next = new Set(s)
        next.delete(e.id)
        return next
      })
    }
  }

  if (!entries.length)
    return (
      <div className="tp-ticket mx-auto mt-8 max-w-md p-8 text-center">
        <p className="text-4xl">{theme.emptyLog}</p>
        <p className="tp-display mt-2 text-lg font-bold">Lịch trình còn trống</p>
        <p className="mt-1 text-sm text-muted">Bấm Thu / Chi bên dưới để ghi khoản đầu tiên.</p>
      </div>
    )

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] xl:items-start">
      {planned.length > 0 && (
        <section className="min-w-0 xl:sticky xl:top-16">
          <h3 className="tp-display mb-3 flex items-center gap-2 text-lg font-bold text-(--tp-ink)">
            {theme.upcoming} <span className="rounded-pill bg-accent-soft px-2 text-xs font-semibold text-accent">{planned.length}</span>
          </h3>
          <div className="tp-ticket overflow-hidden">
            {planned.map((e) => (
              <EntryRow key={e.id} members={members} e={e} onEdit={() => onEdit(e)} onMarkDone={() => markDone(e)} marking={marking.has(e.id)} />
            ))}
          </div>
        </section>
      )}

      <section className={`min-w-0 ${planned.length ? '' : 'xl:col-span-2'}`}>
        {days.length > 0 && <h3 className="tp-display mb-3 text-lg font-bold text-(--tp-ink)">{theme.log}</h3>}
        <div className="tp-timeline space-y-6">
          {days.map((d) => {
            const inSum = d.items.filter((e) => e.type === 'in').reduce((n, e) => n + e.amount, 0)
            const outSum = d.items.filter((e) => e.type === 'out').reduce((n, e) => n + e.amount, 0)
            const t = dayTitle(fund, d.date)
            return (
              <div key={d.date} className="relative">
                <span className="tp-day-dot" />
                <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 px-1">
                  <p>
                    <span className="tp-display text-base font-bold text-(--tp-ink)">{t.main}</span>
                    {t.sub && <span className="tp-label ml-2">{t.sub}</span>}
                    {d.date === today && (
                      <span className="ml-2 rounded-pill bg-(--tp-sun) px-2 py-0.5 text-[10px] font-bold text-(--tp-ink)">HÔM NAY</span>
                    )}
                  </p>
                  <span className="tp-mono text-xs">
                    {inSum > 0 && <span className="text-income">+{formatVND(inSum)} </span>}
                    {outSum > 0 && <span className="text-danger">−{formatVND(outSum)}</span>}
                  </span>
                </div>
                <div className="tp-ticket overflow-hidden">
                  {d.items.map((e) => (
                    <EntryRow key={e.id} members={members} e={e} onEdit={() => onEdit(e)} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function MembersTab({ fund, members, entries }: { fund: Fund; members: FundMember[]; entries: FundEntry[] }) {
  const theme = themeOf(fund.theme)
  const addMember = useTrips((s) => s.addMember)
  const balances = useMemo(() => memberBalances(members, entries), [members, entries])
  const [newName, setNewName] = useState('')
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState<FundMember | null>(null)
  const used = useMemo(
    () => new Set(entries.flatMap((e) => [e.memberId, e.toMemberId, ...e.splits.map((s) => s.memberId)]).filter(Boolean) as string[]),
    [entries],
  )

  async function add() {
    if (busy) return
    const names = newName
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean)
    if (!names.length) return
    setBusy(true)
    try {
      // Quỹ đã có khoản đã xong → người mới vào từ hôm nay (không gánh các khoản chi trước đó); quỹ còn trống → có mặt từ đầu
      const joinedAt = entries.some((e) => e.done) ? todayISO() : null
      for (const [i, name] of names.entries()) {
        await addMember({
          id: nanoid(),
          fundId: fund.id,
          name,
          joinedAt,
          sortOrder: members.length + i,
        })
      }
      setNewName('')
    } catch (e) {
      showError(e)
    } finally {
      setBusy(false)
    }
  }

  const active = balances.filter((b) => !isLeft(b.member))
  const left = balances.filter((b) => isLeft(b.member))

  const card = (b: (typeof balances)[number]) => {
    const m = b.member
    const owe = fund.perMemberTarget ? fund.perMemberTarget - b.contributed - b.pendingIn : 0
    const status = b.net > 0.5 ? 'plus' : b.net < -0.5 ? 'minus' : 'even'
    return (
      <button
        key={m.id}
        type="button"
        onClick={() => setEditing(m)}
        className={`tp-ticket group overflow-hidden text-left transition hover:-translate-y-0.5 ${isLeft(m) ? 'opacity-70' : ''}`}
      >
        {/* Trang hộ chiếu: ảnh (avatar) + thông tin hành khách */}
        <div className="flex items-center gap-4 p-4">
          <Avatar id={m.id} name={m.name} size={52} faded={isLeft(m)} />
          <div className="min-w-0 flex-1">
            <p className="tp-label">
              {theme.person}
              {fund.treasurerId === m.id && ' · giữ quỹ 💰'}
            </p>
            <p className="tp-display truncate text-xl font-bold text-(--tp-ink)">{m.name}</p>
            <p className="tp-mono text-[11px] tracking-normal text-muted">
              {m.joinedAt ? `IN ${formatDate(m.joinedAt)}` : 'IN —'}
              {m.leftAt && ` · OUT ${formatDate(m.leftAt)}`}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="tp-label">{status === 'plus' ? 'Được nhận' : status === 'minus' ? 'Còn thiếu' : 'Trạng thái'}</p>
            <p className={`tp-display text-lg font-bold ${status === 'plus' ? 'text-income' : status === 'minus' ? 'text-danger' : 'text-muted'}`}>
              {status === 'even' ? 'Đã hoà ✓' : formatVND(Math.abs(b.net))}
            </p>
          </div>
        </div>
        <div className="tp-perf" />
        <div className="grid grid-cols-2 gap-2 p-4 text-sm sm:grid-cols-4">
          <Stat label="Đã góp" value={b.contributed} className="text-income" />
          <Stat label="Ứng trả hộ" value={b.advanced} />
          <Stat label="Phải chịu" value={b.share} className="text-danger" />
          <Stat label="Chờ góp" value={b.pendingIn} />
        </div>
        {owe > 0 && !isLeft(m) && (
          <p className="-mt-1 px-4 pb-4 text-xs text-danger">
            Mỗi người góp {formatVND(fund.perMemberTarget)} — còn {formatVND(owe)} chưa có khoản thu
          </p>
        )}
      </button>
    )
  }

  return (
    <div className="mt-6">
      <div className="tp-ticket flex gap-2 p-2">
        <span className="flex items-center pl-2 text-lg" aria-hidden="true">
          🧳
        </span>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder={theme.addPeople}
          className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm outline-none"
        />
        <button
          type="button"
          onClick={add}
          disabled={busy || !newName.trim()}
          className="rounded-pill bg-(--tp-ink) px-5 text-sm font-semibold text-white disabled:opacity-60"
        >
          <BusyLabel busy={busy} label="Đang thêm">
            Thêm
          </BusyLabel>
        </button>
      </div>

      {active.length > 0 && <div className="mt-5 grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">{active.map(card)}</div>}
      {left.length > 0 && (
        <>
          <h3 className="tp-display mb-3 mt-8 text-lg font-bold text-muted">
            {theme.leftGroup} ({left.length})
          </h3>
          <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">{left.map(card)}</div>
        </>
      )}
      {members.length > 0 && (
        <p className="mt-4 px-1 text-xs text-muted">
          Bấm vào 1 người để sửa, cho rời quỹ hoặc quay lại. Phải chịu = tổng các khoản đã chi được chia cho người đó. Được nhận / còn thiếu = đã góp
          + ứng trả hộ − phải chịu ± tiền đã chuyển khi chia (chưa tính khoản dự kiến).
        </p>
      )}

      <MemberSheet member={editing} used={!!editing && used.has(editing.id)} onClose={() => setEditing(null)} />
    </div>
  )
}

function SettleTab({ fund, members, entries, balance }: { fund: Fund; members: FundMember[]; entries: FundEntry[]; balance: number }) {
  const theme = themeOf(fund.theme)
  const saveEntries = useTrips((s) => s.saveEntries)
  const [busy, setBusy] = useState<number | null>(null) // chỉ số chặng đang ghi "đã chuyển"
  const transfers = useMemo(() => settle(memberBalances(members, entries), balance), [members, entries, balance])
  const treasurer = nameOf(members, fund.treasurerId)

  const party = (id: string) => {
    if (id === FUND_ID)
      return (
        <span className="flex min-w-0 flex-col items-center gap-1">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-(--tp-sun)/20 text-xl ring-2 ring-card">💰</span>
          <span className="max-w-full truncate text-xs font-semibold">Quỹ{treasurer && ` (${treasurer})`}</span>
        </span>
      )
    const m = members.find((x) => x.id === id)
    return (
      <span className="flex min-w-0 flex-col items-center gap-1">
        <Avatar id={id} name={m?.name ?? '?'} size={44} />
        <span className="max-w-full truncate text-xs font-semibold">{m?.name ?? '?'}</span>
      </span>
    )
  }

  // Ghi lại 1 lần chuyển tiền đã làm → khoản "transfer", số liệu chia tiền tự cập nhật
  async function markPaid(t: { from: string; to: string; amount: number }, i: number) {
    setBusy(i)
    try {
      const toId = (id: string) => (id === FUND_ID ? null : id)
      await saveEntries(
        [
          {
            ...emptyEntry(fund.id, 'transfer'),
            amount: t.amount,
            memberId: toId(t.from),
            toMemberId: toId(t.to),
            category: 'settle',
            note: 'Chia tiền',
          },
        ],
        true,
      )
    } catch (e) {
      showError(e)
    } finally {
      setBusy(null)
    }
  }

  if (!members.length) return <p className="mt-8 text-center text-sm text-muted">Thêm thành viên để tính chia tiền.</p>

  return (
    <div className="mt-6">
      {transfers.length === 0 ? (
        <div className="tp-ticket relative mx-auto max-w-md overflow-hidden p-8 text-center">
          <span className="tp-stamp left-1/2 top-4 -translate-x-1/2">SETTLED</span>
          <p className="mt-8 text-4xl">🤝</p>
          <p className="tp-display mt-2 text-xl font-bold">Mọi người đã hoà</p>
          <p className="mt-1 text-sm text-muted">{theme.settled}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {transfers.map((t, i) => (
            <div key={i} className="tp-ticket overflow-hidden">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 pb-3 pt-4">
                {party(t.from)}
                <span className="flex flex-col items-center">
                  <span className="tp-mono text-base font-bold tracking-normal text-(--tp-ink)">{formatVND(t.amount)}</span>
                  <span className="mt-1 flex w-24 items-center gap-1 text-accent">
                    <span className="flex-1 border-t-2 border-dashed border-current" />
                    <span className="tp-vehicle">{theme.vehicle}</span>
                  </span>
                </span>
                {party(t.to)}
              </div>
              <div className="tp-perf" />
              <div className="flex items-center justify-between px-4 py-3">
                <span className="tp-label">
                  {theme.leg} {String(i + 1).padStart(2, '0')}
                </span>
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() => markPaid(t, i)}
                  className="rounded-pill bg-accent px-3 py-1.5 text-xs font-semibold text-white transition active:scale-95 disabled:opacity-60"
                >
                  <BusyLabel busy={busy === i} label="Đang ghi…">
                    ✓ Đã chuyển
                  </BusyLabel>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="mt-4 px-1 text-xs text-muted">
        Gợi ý số lần chuyển tiền ít nhất để mọi người hoà, dựa trên các khoản đã thu / đã chi. &ldquo;Quỹ → ai đó&rdquo; nghĩa là người giữ quỹ trả
        lại tiền thừa; &ldquo;ai đó → Quỹ&rdquo; là góp thêm vì quỹ đang âm. Bấm &ldquo;Đã chuyển&rdquo; để ghi lại — khoản chuyển hiện trong danh
        sách thu chi và sửa / xoá được. Làm tròn tới 1.000đ.
      </p>
    </div>
  )
}
