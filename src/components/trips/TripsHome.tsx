'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { announceNavigation } from '@/components/loading/NavigationWatcher'
import { confirmDeleteFund, useTrips, type FundInput } from '@/lib/trips/store'
import { effectiveTarget, formatDate, formatVND, isLeft, summarize, todayISO, type Fund, type FundEntry, type FundMember } from '@/lib/trips/types'
import { emptyFund, FundSheet } from './FundSheet'
import { FUND_THEME, fundTheme, TRIP_THEMES } from '@/lib/trips/themes'
import { HeroScene } from './HeroScene'
import { Avatar, dateLabels, Spinner, ticketCode, ticketTag, TripRoute } from './ui'

// Nút tạo nhanh: mỗi theme chuyến đi + 1 nút quỹ góp mua đồ (giao diện mặc định, không chọn theme)
const QUICK_STARTS = [
  ...TRIP_THEMES.map((theme) => ({ theme, make: () => emptyFund(theme.key) })),
  { theme: FUND_THEME, make: () => ({ ...emptyFund(), kind: 'fund' as const, icon: FUND_THEME.emoji }) },
]

export function dateRange(fund: Fund) {
  if (fund.startDate && fund.endDate) return `${formatDate(fund.startDate)} → ${formatDate(fund.endDate)}`
  if (fund.startDate) return `Từ ${formatDate(fund.startDate)}`
  if (fund.endDate) return `Hạn ${formatDate(fund.endDate)}`
  return ''
}

// /trips — danh sách các chuyến đi / quỹ chung dạng "boarding pass", chia "Đang mở" và "Đã đóng".
export function TripsHome() {
  const router = useRouter()
  const { funds, members, entries, loadError, load } = useTrips()
  const [creating, setCreating] = useState<FundInput | null>(null)

  useEffect(() => {
    load()
  }, [load])

  const byFund = useMemo(() => {
    const map = new Map<string, FundEntry[]>()
    for (const e of entries) map.set(e.fundId, [...(map.get(e.fundId) ?? []), e])
    return map
  }, [entries])

  const open = (funds ?? []).filter((f) => !f.closed)
  const closed = (funds ?? []).filter((f) => f.closed)
  const today = todayISO()
  const openIds = new Set(open.map((f) => f.id))
  const openEntries = entries.filter((e) => openIds.has(e.fundId))
  const totalBalance = summarize(openEntries).balance
  const overdue = openEntries.filter((e) => !e.done && e.date < today).length

  return (
    <div className="w-full px-4 pb-24 pt-5 md:px-8">
      <Link href="/tools" className="tp-label hover:text-accent">
        ← Tools
      </Link>

      <header className="tp-hero relative mt-4 overflow-hidden rounded-[28px] px-6 pb-6 pt-7 text-(--tp-ink) md:px-10 md:pb-8 md:pt-10">
        <HeroScene />

        <div className="relative max-w-2xl">
          <p className="tp-mono text-[11px] uppercase text-[#c2552f]">🧭 Travel wallet</p>
          <h1 className="tp-display mt-2 text-4xl font-black leading-[1.05] md:text-5xl">
            Hành trình <span className="font-medium italic text-[#e0703a]">&</span> Quỹ chung
          </h1>
          <p className="mt-2 max-w-md text-sm text-[#4b5560]">Bay, phượt, trekking hay ra biển — ai góp bao nhiêu, chi gì, ngày nào, cuối chuyến ai trả ai.</p>

          <button
            type="button"
            onClick={() => setCreating(emptyFund())}
            className="mt-5 rounded-pill bg-(--tp-ink) px-5 py-3 text-sm font-bold text-white shadow-lg shadow-black/15 transition hover:brightness-110 active:scale-95"
          >
            + Chuyến / quỹ mới
          </button>

          {/* Tạo nhanh theo kiểu đi — mở form với theme chọn sẵn */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="tp-label mr-1">Đi kiểu gì?</span>
            {QUICK_STARTS.map(({ theme: t, make }) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setCreating(make())}
                className="flex items-center gap-1.5 rounded-pill border border-white/80 bg-white/70 py-1.5 pl-2 pr-3 text-xs font-semibold shadow-sm backdrop-blur transition hover:bg-white active:scale-95"
              >
                <span className="h-2 w-2 rounded-full" style={{ background: t.swatch[1] }} />
                {t.emoji} {t.name}
              </button>
            ))}
          </div>

          {funds && funds.length > 0 && (
            // Mobile: số dư (dài nhất) chiếm cả hàng đầu, 2 ô nhỏ xuống hàng dưới; từ sm xếp 3 ô 1 hàng
            <div className="mt-6 grid max-w-lg grid-cols-2 gap-2 sm:grid-cols-[1.6fr_1fr_1fr]">
              <HeroStat label="Còn trong quỹ" value={formatVND(totalBalance)} className="col-span-2 sm:col-span-1" />
              <HeroStat label="Đang mở" value={String(open.length)} />
              <HeroStat label="Quá hạn" value={String(overdue)} warn={overdue > 0} />
            </div>
          )}
        </div>
      </header>

      {loadError && <p className="mt-6 text-sm text-danger">Không tải được dữ liệu: {loadError}</p>}
      {!funds && !loadError && <p className="tp-label mt-8 text-center">Đang tải hành trình…</p>}
      {funds && funds.length === 0 && (
        <section className="mt-10 text-center">
          <p className="text-5xl">🧳</p>
          <p className="tp-display mt-3 text-2xl font-bold text-(--tp-ink)">Chưa có chuyến nào</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted">Chọn kiểu đi để bắt đầu — mỗi kiểu có giao diện riêng, đổi lại lúc nào cũng được.</p>
          <div className="mx-auto mt-6 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {QUICK_STARTS.map(({ theme: t, make }) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setCreating(make())}
                className={`tp-theme-${t.key} tp-ticket group overflow-hidden text-left transition hover:-translate-y-1 hover:shadow-xl`}
              >
                <span className="tp-ticket-band flex items-center justify-between px-4 py-2">
                  <span className="tp-mono text-[10px] uppercase text-white/80">{t.tag}</span>
                  <span className="text-lg transition group-hover:scale-110">{t.emoji}</span>
                </span>
                <span className="block px-4 pb-4 pt-3">
                  <span className="tp-title block text-2xl font-bold text-(--tp-ink)">{t.name}</span>
                  <span className="mt-0.5 block text-xs text-muted">{t.blurb}</span>
                  <span className="mt-3 flex items-center gap-1.5 text-sm">
                    <span className="tp-vehicle">{t.vehicle}</span>
                    <span className="h-0 flex-1 border-t-2 border-dashed border-border" />
                    {t.destination}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {open.length > 0 && (
        <>
          <SectionTitle>Sắp & đang diễn ra</SectionTitle>
          <FundGrid funds={open} byFund={byFund} members={members} />
        </>
      )}
      {closed.length > 0 && (
        <>
          <SectionTitle>Đã hoàn thành</SectionTitle>
          <FundGrid funds={closed} byFund={byFund} members={members} />
        </>
      )}

      <FundSheet
        open={!!creating}
        fund={creating}
        isNew
        onClose={() => setCreating(null)}
        onSaved={(f) => {
          announceNavigation(`/trips/${f.id}`)
          router.push(`/trips/${f.id}`)
        }}
      />
    </div>
  )
}

function HeroStat({ label, value, warn = false, className = '' }: { label: string; value: string; warn?: boolean; className?: string }) {
  return (
    <div className={'min-w-0 rounded-2xl border border-white/80 bg-white/70 px-3 py-2 backdrop-blur ' + className}>
      <p className="tp-label truncate">{label}</p>
      <p className={`truncate text-base font-bold md:text-lg ${warn ? 'text-danger' : ''}`}>{value}</p>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="tp-display mb-4 mt-9 flex items-center gap-3 text-xl font-bold text-(--tp-ink)">
      {children}
      <span className="h-px flex-1 border-t-2 border-dashed border-border" />
    </h2>
  )
}

function FundGrid({ funds, byFund, members }: { funds: Fund[]; byFund: Map<string, FundEntry[]>; members: FundMember[] }) {
  const today = todayISO()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function remove(f: Fund) {
    await confirmDeleteFund(f, () => setDeletingId(f.id))
    setDeletingId(null)
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {funds.map((f) => {
        const list = byFund.get(f.id) ?? []
        const s = summarize(list)
        const overdue = list.filter((e) => !e.done && e.date < today).length
        const fundMembers = members.filter((m) => m.fundId === f.id && !isLeft(m))
        const target = effectiveTarget(f, fundMembers)
        const pct = target > 0 ? (s.collected / target) * 100 : 0
        const [l1, l2] = dateLabels(f)
        const theme = fundTheme(f)
        const deleting = deletingId === f.id
        return (
          // Nút xoá là anh em của Link (không lồng bên trong): NavigationWatcher bắt click ở pha capture trên
          // document nên nút lồng trong <a> sẽ kịp bật overlay chuyển trang trước khi preventDefault.
          <div
            key={f.id}
            className={`tp-theme-${theme.key} group relative transition duration-300 hover:-translate-y-1 ${deleting ? 'pointer-events-none opacity-60' : ''}`}
          >
            <button
              type="button"
              aria-label={`Xoá ${f.name}`}
              title="Xoá"
              onClick={() => remove(f)}
              disabled={deleting}
              // Mobile luôn hiện, desktop hiện khi rê chuột vào vé
              className={`absolute right-2.5 top-1.5 z-10 flex h-7 w-7 items-center justify-center rounded-full text-xs text-white/75 transition hover:bg-white/15 hover:text-white focus-visible:opacity-100 ${
                deleting ? '' : 'md:opacity-0 md:group-hover:opacity-100'
              }`}
            >
              {deleting ? <Spinner /> : '🗑'}
            </button>
            {deleting && (
              <span className="tp-label absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center gap-2 text-(--tp-ink)">
                <Spinner /> Đang xoá…
              </span>
            )}
            <Link
              href={`/trips/${f.id}`}
              className={`tp-ticket block overflow-hidden transition duration-300 group-hover:shadow-xl ${f.closed ? 'saturate-50' : ''}`}
            >
              <div className="tp-ticket-band flex items-center justify-between gap-2 py-2.5 pl-4 pr-11">
                <span className="tp-mono text-[10px] uppercase text-white/80">{ticketTag(f)}</span>
                <span className="tp-mono text-[10px] text-white/60">{ticketCode(f.id)}</span>
              </div>

              <div className="relative px-4 pb-4 pt-4">
                {f.closed && <span className="tp-stamp right-4 top-3">{theme.stamp}</span>}
                <div className="flex items-start gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card-soft text-2xl transition group-hover:-rotate-6">
                    {f.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="tp-title truncate text-xl font-bold leading-tight text-(--tp-ink)">{f.name}</p>
                    <p className="truncate text-xs text-muted">{f.location ? `📍 ${f.location}` : ' '}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <TicketField label={l1} value={f.startDate ? formatDate(f.startDate).slice(0, 5) : '—'} />
                  <TicketField label={l2} value={f.endDate ? formatDate(f.endDate).slice(0, 5) : '—'} />
                  <TicketField label={theme.people} value={String(fundMembers.length).padStart(2, '0')} />
                </div>

                {target > 0 && (
                  <div className="mt-4">
                    <TripRoute pct={pct} theme={theme} />
                    <p className="mt-0.5 flex justify-between text-[11px] text-muted">
                      <span>Đã gom {Math.round(Math.min(pct, 999))}%</span>
                      <span>{formatVND(target)}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="tp-perf" />

              <div className="flex items-end justify-between gap-3 px-4 pb-4 pt-4">
                <div className="min-w-0">
                  <p className="tp-label">Còn trong quỹ</p>
                  <p className={`tp-display truncate text-2xl font-bold ${s.balance < 0 ? 'text-danger' : 'text-(--tp-ink)'}`}>
                    {formatVND(s.balance)}
                  </p>
                  <p className="mt-0.5 text-[11px]">
                    <span className="text-income">↓ {formatVND(s.collected)}</span>
                    <span className="mx-1.5 text-border">|</span>
                    <span className="text-danger">↑ {formatVND(s.spent)}</span>
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  {fundMembers.length > 0 && (
                    <span className="flex -space-x-2">
                      {fundMembers.slice(0, 4).map((m) => (
                        <Avatar key={m.id} id={m.id} name={m.name} size={26} />
                      ))}
                      {fundMembers.length > 4 && (
                        <span className="inline-flex h-6.5 w-6.5 items-center justify-center rounded-full bg-card-soft text-[10px] font-semibold ring-2 ring-card">
                          +{fundMembers.length - 4}
                        </span>
                      )}
                    </span>
                  )}
                  <span className="tp-barcode w-20" aria-hidden="true" />
                </div>
              </div>

              {(s.pendingIn > 0 || overdue > 0) && (
                <div className="flex flex-wrap gap-1.5 px-4 pb-4 text-[11px]">
                  {s.pendingIn > 0 && (
                    <span className="rounded-pill bg-accent-soft px-2 py-0.5 text-accent">⏳ Chờ thu {formatVND(s.pendingIn)}</span>
                  )}
                  {overdue > 0 && <span className="rounded-pill bg-danger-soft px-2 py-0.5 font-semibold text-danger">{overdue} khoản quá hạn</span>}
                </div>
              )}
            </Link>
          </div>
        )
      })}
    </div>
  )
}

function TicketField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="tp-label truncate">{label}</p>
      <p className="tp-mono truncate text-base font-medium text-(--tp-ink)">{value}</p>
    </div>
  )
}
