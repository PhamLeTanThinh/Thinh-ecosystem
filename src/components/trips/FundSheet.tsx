'use client'

import { useState } from 'react'
import { nanoid } from 'nanoid'
import { BottomSheet } from '@/components/money/BottomSheet'
import { SheetHeader } from '@/components/money/SheetHeader'
import { confirmDeleteFund, useTrips, type FundInput } from '@/lib/trips/store'
import { FUND_KINDS, isLeft, kindOf, todayISO, type Fund } from '@/lib/trips/types'
import { DatePicker } from './DatePicker'
import { DEFAULT_THEME, fundTheme, TRIP_THEMES, themeOf, type TripThemeKey } from '@/lib/trips/themes'
import { BusyLabel } from './ui'
import { ErrorBanner } from './ErrorBanner'
import { useDirty } from './useDirty'

// theme: mở form với theme chọn sẵn (nút tạo nhanh ở trang danh sách) — icon mặc định lấy theo theme
// Icon mặc định: chuyến đi theo theme, quỹ góp / khác theo loại quỹ
function defaultIcon(d: Pick<FundInput, 'kind' | 'theme'>) {
  return d.kind === 'trip' ? themeOf(d.theme).emoji : kindOf(d.kind).icon
}

export function emptyFund(theme: TripThemeKey = DEFAULT_THEME): FundInput {
  return {
    id: nanoid(),
    name: '',
    kind: 'trip',
    icon: themeOf(theme).emoji,
    theme,
    note: '',
    location: '',
    currency: 'VND',
    startDate: null,
    endDate: null,
    target: 0,
    perMemberTarget: 0,
    treasurerId: null,
    closed: false,
  }
}

interface FundSheetProps {
  open: boolean
  fund: FundInput | null // null khi đóng
  isNew: boolean
  onClose: () => void
  onSaved?: (fund: Fund) => void
  onDeleted?: () => void
}

// Bottom sheet tạo / sửa 1 quỹ. Lúc tạo nhập luôn danh sách thành viên ban đầu; sau đó thêm / bớt người ở tab
// Thành viên của trang chi tiết (vì cần ghi ngày vào / rời quỹ).
export function FundSheet(props: FundSheetProps) {
  return (
    <BottomSheet open={props.open} onClose={props.onClose} responsive closeOnBackdrop={false}>
      {props.fund && <FundForm key={props.fund.id} {...props} fund={props.fund} />}
    </BottomSheet>
  )
}

const VND = new Intl.NumberFormat('vi-VN')

export function MoneyField({ label, value, onChange, hint }: { label: string; value: number; onChange: (v: number) => void; hint?: string }) {
  return (
    <label className="block text-sm text-muted">
      {label}
      <span className="mt-1 flex items-center rounded-xl bg-card-soft px-3">
        <input
          inputMode="numeric"
          value={value > 0 ? VND.format(value) : ''}
          onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, '')) || 0)}
          placeholder="0"
          className="min-w-0 flex-1 bg-transparent py-2 font-medium text-text outline-none"
        />
        <span className="text-xs">đ</span>
      </span>
      {hint && <span className="mt-1 block text-xs">{hint}</span>}
    </label>
  )
}

function FundForm({ fund, isNew, onClose, onSaved, onDeleted }: FundSheetProps & { fund: FundInput }) {
  const createFund = useTrips((s) => s.createFund)
  const setRoundOpening = useTrips((s) => s.setRoundOpening)
  const updateFund = useTrips((s) => s.updateFund)
  const allMembers = useTrips((s) => s.members)
  const members = allMembers.filter((m) => m.fundId === fund.id && !isLeft(m))
  const [draft, setDraft] = useState<FundInput>(fund)
  const [names, setNames] = useState<{ id: string; name: string }[]>([]) // chỉ dùng khi tạo mới
  const [newName, setNewName] = useState('')
  const [roundName, setRoundName] = useState('') // tên đợt đầu khi tạo quỹ góp
  const [initial, setInitial] = useState(0) // số dư ban đầu (tiền quỹ có sẵn) — ghi vào đợt đầu
  const [busy, setBusy] = useState<'save' | 'delete' | null>(null) // thao tác đang chạy → spinner trên đúng nút đó
  const [error, setError] = useState('')
  // Chưa thay đổi gì so với lúc mở form → tắt nút Lưu
  const dirty = useDirty({ draft, names, newName: newName.trim(), roundName: roundName.trim(), initial })

  const patch = (p: Partial<FundInput>) => setDraft((d) => ({ ...d, ...p }))

  // Cho dán nhiều tên 1 lúc, cách nhau bằng dấu phẩy
  const pendingNames = () =>
    newName
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean)
      .map((name) => ({ id: nanoid(), name }))

  function addNames() {
    const added = pendingNames()
    if (!added.length) return
    setNames((n) => [...n, ...added])
    setNewName('')
  }

  async function submit() {
    if (!draft.name.trim()) return setError('Nhập tên trước đã')
    setBusy('save')
    setError('')
    try {
      // Tên đang gõ dở mà chưa bấm "Thêm" thì vẫn lưu luôn
      const saved = isNew ? await createFund(draft, [...names, ...pendingNames()], roundName.trim() || 'Đợt 1') : await updateFund(draft)
      // Quỹ góp: server tạo sẵn đợt đầu id = <quỹ>-r1 → ghi số dư ban đầu vào đợt đó
      if (isNew && !isTrip && initial > 0) await setRoundOpening({ id: saved.id + '-r1', fundId: saved.id }, initial, draft.startDate ?? todayISO())
      onSaved?.(saved)
      onClose()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(null)
    }
  }

  async function remove() {
    if (await confirmDeleteFund(fund, () => setBusy('delete'))) {
      onClose()
      onDeleted?.()
    } else setBusy(null)
  }

  const isTrip = draft.kind === 'trip'
  const headcount = isNew ? names.length : members.length

  return (
    // Bọc theo giao diện đang chọn → cả form đổi màu / font ngay khi chọn theme (xem trước); quỹ góp dùng giao diện mặc định
    <div className={`tp-theme-${fundTheme(draft).key}`}>
      <SheetHeader
        title={isNew ? 'Tạo mới' : isTrip ? 'Sửa chuyến đi' : 'Sửa quỹ'}
        onCancel={onClose}
        right={
          <button
            type="button"
            onClick={submit}
            disabled={!!busy || !dirty}
            title={!dirty && !busy ? 'Chưa có thay đổi nào' : undefined}
            className={busy ? 'disabled:opacity-60' : 'disabled:cursor-not-allowed disabled:opacity-35'}
          >
            <BusyLabel busy={busy === 'save'} label="Đang lưu">
              Lưu
            </BusyLabel>
          </button>
        }
      />

      <div className="space-y-5 px-4 py-5">
        <ErrorBanner error={error} />
        {/* Loại quỹ chỉ chọn lúc tạo — sau đó cố định (quỹ góp đã chia đợt, chuyến đi có theme... đổi qua lại dễ rối) */}
        {isNew && (
          <div className="flex gap-2">
            {FUND_KINDS.map((k) => (
              <button
                key={k.key}
                type="button"
                onClick={() =>
                  patch({
                    kind: k.key,
                    // Icon đang là icon mặc định → đổi theo loại mới; icon tự chọn thì giữ
                    icon: draft.icon === defaultIcon(draft) ? defaultIcon({ ...draft, kind: k.key }) : draft.icon,
                  })
                }
                className={`flex-1 rounded-pill border px-2 py-2 text-xs font-semibold ${
                  draft.kind === k.key ? 'border-accent bg-accent-soft text-accent' : 'border-border text-muted'
                }`}
              >
                {k.icon} {k.label}
              </button>
            ))}
          </div>
        )}

        {/* Theme chỉ dành cho chuyến đi — quỹ góp mua đồ / khác luôn dùng 1 giao diện mặc định */}
        {isTrip && (
          <div>
            <p className="text-sm text-muted">Theme</p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {TRIP_THEMES.map((t) => {
                const on = draft.theme === t.key
                return (
                  <button
                    key={t.key}
                    type="button"
                    aria-pressed={on}
                    // Icon đang là icon mặc định của theme cũ → đổi theo theme mới; icon tự chọn thì giữ
                    onClick={() => patch({ theme: t.key, icon: draft.icon === defaultIcon(draft) ? t.emoji : draft.icon })}
                    className={`tp-theme-${t.key} overflow-hidden rounded-2xl border-2 text-left transition ${
                      on ? 'border-accent shadow-md' : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <span className="tp-ticket-band flex items-center justify-between px-2.5 py-1.5">
                      <span className="text-lg">{t.emoji}</span>
                      <span className="flex gap-1">
                        {t.swatch.map((c) => (
                          <span key={c} className="h-2.5 w-2.5 rounded-full ring-1 ring-white/60" style={{ background: c }} />
                        ))}
                      </span>
                    </span>
                    <span className="block bg-card px-2.5 py-2">
                      <span className="tp-title block truncate text-base font-bold text-(--tp-ink)">{t.name}</span>
                      <span className="block truncate text-[11px] text-muted">{t.blurb}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <input
            value={draft.icon}
            onChange={(e) => patch({ icon: e.target.value })}
            aria-label="Icon"
            className="h-12 w-12 rounded-xl bg-card-soft text-center text-2xl outline-none"
          />
          <input
            value={draft.name}
            onChange={(e) => patch({ name: e.target.value })}
            placeholder={isTrip ? 'VD: Đà Lạt 3N2Đ' : 'VD: Quà sinh nhật Minh'}
            autoFocus={isNew}
            className="h-12 min-w-0 flex-1 border-b border-border bg-transparent text-lg font-semibold outline-none"
          />
        </div>

        {isTrip && (
          <label className="block text-sm text-muted">
            Địa điểm
            <input
              value={draft.location}
              onChange={(e) => patch({ location: e.target.value })}
              placeholder="VD: Đà Lạt, Lâm Đồng"
              className="mt-1 w-full rounded-xl bg-card-soft px-3 py-2 text-text outline-none"
            />
          </label>
        )}

        {/* Quỹ góp / khác dùng nhiều đợt: lúc tạo nhập luôn đợt đầu; sau đó ngày, mức góp, người tham gia chỉnh theo từng đợt */}
        {!isTrip && isNew && (
          <label className="block text-sm text-muted">
            Đợt đầu tiên
            <input
              value={roundName}
              onChange={(e) => setRoundName(e.target.value)}
              placeholder="VD: 20/10 — để trống = Đợt 1"
              className="mt-1 w-full rounded-xl bg-card-soft px-3 py-2 text-text outline-none"
            />
            <span className="mt-1 block text-xs">
              Ngày, mức góp và thành viên bên dưới áp dụng cho đợt này. Lần sau chỉ cần &ldquo;+ Đợt mới&rdquo; — tiền dư tự chuyển sang.
            </span>
          </label>
        )}
        {!isTrip && isNew && (
          <div>
            <MoneyField label="💰 Số dư ban đầu" value={initial} onChange={setInitial} />
            <p className="mt-1 text-xs text-muted">Tiền quỹ đang có sẵn (để 0 nếu bắt đầu từ con số 0). Sửa lại được ở đợt đầu.</p>
          </div>
        )}
        {!isTrip && !isNew && (
          <p className="rounded-2xl bg-accent-soft px-4 py-3 text-xs text-accent">
            🔁 Quỹ này chia theo đợt — ngày, mức góp và ai tham gia chỉnh ở từng đợt (nút &ldquo;Sửa đợt&rdquo; trong trang quỹ).
          </p>
        )}

        {(isTrip || isNew) && (
          <div className="grid grid-cols-2 gap-3">
            <DatePicker
              label={isTrip ? 'Ngày đi' : 'Bắt đầu gom'}
              value={draft.startDate}
              clearable
              // Ngày về trước ngày đi mới chọn thì bỏ ngày về
              onChange={(startDate) =>
                patch({
                  startDate,
                  endDate: startDate && draft.endDate && draft.endDate < startDate ? null : draft.endDate,
                })
              }
            />
            <DatePicker
              label={isTrip ? 'Ngày về' : 'Hạn chót'}
              value={draft.endDate}
              min={draft.startDate}
              clearable
              align="right"
              onChange={(endDate) => patch({ endDate })}
            />
          </div>
        )}

        {(isTrip || isNew) && (
          <div className="grid grid-cols-2 gap-3">
            <MoneyField label="Mỗi người góp" value={draft.perMemberTarget} onChange={(perMemberTarget) => patch({ perMemberTarget })} />
            <MoneyField
              label="Tổng cần gom"
              value={draft.target}
              onChange={(target) => patch({ target })}
              hint={
                !draft.target && draft.perMemberTarget && headcount
                  ? `Để trống = ${VND.format(draft.perMemberTarget * headcount)} đ (${headcount} người)`
                  : undefined
              }
            />
          </div>
        )}

        {isNew ? (
          <div>
            <p className="text-sm text-muted">Thành viên ({names.length})</p>
            {names.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {names.map((m) => (
                  <span key={m.id} className="flex items-center gap-1 rounded-pill bg-card-soft py-1 pl-3 pr-1 text-sm">
                    {m.name}
                    <button
                      type="button"
                      aria-label={`Bỏ ${m.name}`}
                      onClick={() => setNames((n) => n.filter((x) => x.id !== m.id))}
                      className="h-6 w-6 rounded-full text-muted"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="mt-2 flex gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addNames()
                  }
                }}
                placeholder="Tên (nhiều người cách nhau dấu phẩy)"
                className="min-w-0 flex-1 rounded-xl bg-card-soft px-3 py-2 text-sm outline-none"
              />
              <button type="button" onClick={addNames} className="rounded-xl bg-accent px-4 text-sm font-semibold text-white">
                Thêm
              </button>
            </div>
            <p className="mt-1 text-xs text-muted">Sau này thêm / cho rời quỹ ở tab Thành viên.</p>
          </div>
        ) : (
          members.length > 0 && (
            <div>
              <p className="text-sm text-muted">Ai đang giữ tiền quỹ?</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[{ id: null, name: 'Chưa chọn' }, ...members].map((m) => (
                  <button
                    key={m.id ?? 'none'}
                    type="button"
                    onClick={() => patch({ treasurerId: m.id })}
                    className={`rounded-pill border px-3 py-1.5 text-sm ${
                      draft.treasurerId === m.id ? 'border-accent bg-accent-soft text-accent' : 'border-border text-muted'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          )
        )}

        <label className="block text-sm text-muted">
          Ghi chú
          <textarea
            value={draft.note}
            onChange={(e) => patch({ note: e.target.value })}
            rows={2}
            className="mt-1 w-full resize-none rounded-xl bg-card-soft px-3 py-2 text-text outline-none"
          />
        </label>

        {!isNew && (
          <label className="flex items-center justify-between text-sm">
            <span>Đã kết thúc / đóng quỹ</span>
            <input
              type="checkbox"
              checked={draft.closed}
              onChange={(e) => patch({ closed: e.target.checked })}
              className="h-5 w-5 accent-(--color-accent)"
            />
          </label>
        )}

        {!isNew && (
          <button
            type="button"
            onClick={remove}
            disabled={!!busy}
            className="w-full rounded-xl bg-danger-soft py-3 text-sm font-semibold text-danger disabled:opacity-60"
          >
            <BusyLabel busy={busy === 'delete'} label="Đang xoá…">
              🗑 {isTrip ? 'Xoá chuyến đi này' : 'Xoá quỹ này'}
            </BusyLabel>
          </button>
        )}
      </div>
    </div>
  )
}
