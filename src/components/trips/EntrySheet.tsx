'use client'

import { useState } from 'react'
import { nanoid } from 'nanoid'
import { AmountInput } from '@/components/money/AmountInput'
import { BottomSheet } from '@/components/money/BottomSheet'
import { SheetHeader } from '@/components/money/SheetHeader'
import { askConfirm } from '@/lib/trips/dialog'
import { useTrips, type EntryInput } from '@/lib/trips/store'
import { categoriesOf, formatVND, isActiveOn, todayISO, type EntryType, type Fund, type FundMember } from '@/lib/trips/types'
import { DatePicker } from './DatePicker'
import { BusyLabel } from './ui'

// roundId: đợt đang xem (quỹ dùng nhiều đợt) — khoản mới thuộc đợt đó
export function emptyEntry(fundId: string, type: EntryType, roundId: string | null = null): EntryInput {
  return {
    id: nanoid(),
    fundId,
    roundId,
    type,
    amount: 0,
    date: todayISO(),
    dueDate: null,
    done: true,
    memberId: null,
    toMemberId: null,
    splitMode: 'equal',
    splits: [],
    category: categoriesOf(type)[0].key,
    note: '',
  }
}

interface EntrySheetProps {
  fund: Fund
  members: FundMember[] // mọi thành viên của quỹ, kể cả người đã rời
  entry: EntryInput | null // null khi đóng
  isNew: boolean
  onClose: () => void
  // Quỹ chia đợt: người tham gia đợt của khoản này — chỉ họ hiện ra để chọn / mặc định chịu chi phí
  participantIds?: string[] | null
}

export function EntrySheet(props: EntrySheetProps) {
  return (
    <BottomSheet open={!!props.entry} onClose={props.onClose} responsive>
      {props.entry && <EntryForm key={props.entry.id} {...props} entry={props.entry} />}
    </BottomSheet>
  )
}

const chip = (on: boolean, tone: 'accent' | 'income' | 'danger' = 'accent') =>
  `rounded-pill border px-3 py-1.5 text-sm ${
    on
      ? tone === 'income'
        ? 'border-income bg-income/10 text-income'
        : tone === 'danger'
          ? 'border-danger bg-danger-soft text-danger'
          : 'border-accent bg-accent-soft text-accent'
      : 'border-border text-muted'
  }`

const TYPES: {
  key: EntryType
  label: string
  tone: 'income' | 'danger' | 'accent'
}[] = [
  { key: 'in', label: '↓ Thu', tone: 'income' },
  { key: 'out', label: '↑ Chi', tone: 'danger' },
  { key: 'transfer', label: '⇄ Chuyển', tone: 'accent' },
]

// Thêm / sửa 1 khoản. Khi THÊM khoản thu có thể chọn nhiều người cùng lúc → tạo mỗi người 1 khoản cùng số tiền
// (kiểu "mỗi người góp 500k, hạn 20/10"). Danh sách người chỉ gồm ai đang trong quỹ vào ngày của khoản.
function EntryForm({ fund, members, entry, isNew, onClose, participantIds }: EntrySheetProps & { entry: EntryInput }) {
  const saveEntries = useTrips((s) => s.saveEntries)
  const deleteEntry = useTrips((s) => s.deleteEntry)
  const [draft, setDraft] = useState<EntryInput>(entry)
  const [payers, setPayers] = useState<string[]>(entry.memberId ? [entry.memberId] : []) // chỉ dùng cho khoản thu
  const [busy, setBusy] = useState<'save' | 'delete' | null>(null) // thao tác đang chạy → spinner trên đúng nút đó
  const [error, setError] = useState('')

  const patch = (p: Partial<EntryInput>) => setDraft((d) => ({ ...d, ...p }))
  const { type } = draft
  const isIn = type === 'in'
  const carryover = isIn && draft.category === 'carryover'

  // Người hiện ra để chọn: đang trong quỹ vào ngày này + người đã được chọn sẵn ở khoản cũ (dù đã rời)
  const picked = new Set([draft.memberId, draft.toMemberId, ...payers, ...draft.splits.map((s) => s.memberId)])
  const inScope = (m: FundMember) => (participantIds ? participantIds.includes(m.id) : isActiveOn(m, draft.date))
  const pickable = members.filter((m) => inScope(m) || picked.has(m.id))
  const activeIds = members.filter(inScope).map((m) => m.id)
  // Chưa chỉnh danh sách chia → mặc định mọi người đang trong quỹ ngày đó
  const splitIds = draft.splits.length ? draft.splits.map((s) => s.memberId) : activeIds
  const multiPayers = isIn && isNew && payers.length > 1

  function switchType(next: EntryType) {
    if (next === type) return
    patch({
      type: next,
      category: categoriesOf(next)[0].key,
      memberId: null,
      toMemberId: null,
      splits: [],
    })
    setPayers([])
  }

  function togglePayer(id: string) {
    // Sửa khoản đã có → chỉ 1 người; thêm mới → chọn được nhiều
    if (!isNew) return setPayers((p) => (p[0] === id ? [] : [id]))
    setPayers((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  }

  function toggleSplit(id: string) {
    const next = splitIds.includes(id) ? splitIds.filter((x) => x !== id) : [...splitIds, id]
    patch({ splits: next.map((memberId) => ({ memberId, value: null })) })
  }

  async function submit() {
    if (draft.amount <= 0) return setError('Nhập số tiền')
    if (type === 'out' && members.length > 0 && splitIds.length === 0) return setError('Chọn ít nhất 1 người chịu khoản này')
    if (type === 'transfer' && draft.memberId === draft.toMemberId) return setError('Người chuyển và người nhận phải khác nhau')
    setBusy('save')
    setError('')
    try {
      // Luôn lưu RÕ danh sách người chịu — người vào quỹ sau này không bị tính vào khoản cũ
      const base: EntryInput = {
        ...draft,
        splits: type === 'out' ? splitIds.map((memberId) => ({ memberId, value: null })) : [],
      }
      const list: EntryInput[] = isIn
        ? payers.length
          ? payers.map((memberId, i) => ({
              ...base,
              id: i === 0 ? base.id : nanoid(),
              memberId,
            }))
          : [{ ...base, memberId: null }]
        : [base]
      await saveEntries(list, isNew)
      onClose()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(null)
    }
  }

  async function remove() {
    const ok = await askConfirm({
      title: 'Xoá khoản này?',
      message: `${entry.note || categoriesOf(entry.type).find((c) => c.key === entry.category)?.label || ''} · ${formatVND(entry.amount)}\nKhông khôi phục lại được.`,
      confirmLabel: 'Xoá khoản',
      tone: 'danger',
    })
    if (!ok) return
    setBusy('delete')
    try {
      await deleteEntry(entry.id)
      onClose()
    } catch (e) {
      setError((e as Error).message)
      setBusy(null)
    }
  }

  // Chọn nhóm khoản — chọn "Còn lại từ đợt trước" thì mặc định là tiền chung (bỏ người đã chọn)
  const categoryBlock = type !== 'transfer' && (
    <div>
      <p className="text-sm text-muted">Nhóm</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {categoriesOf(type).map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => {
              patch({ category: c.key })
              if (c.key === 'carryover') setPayers([])
            }}
            className={chip(draft.category === c.key)}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>
    </div>
  )

  const titles: Record<EntryType, string> = {
    in: 'Thêm khoản thu',
    out: 'Thêm khoản chi',
    transfer: 'Ghi chuyển tiền',
  }
  const doneLabel = { in: 'Đã thu', out: 'Đã chi', transfer: 'Đã chuyển' }[type]
  const plannedLabel = {
    in: 'Chờ thu (hẹn ngày)',
    out: 'Dự chi (sắp chi)',
    transfer: 'Hẹn chuyển',
  }[type]
  const fundChip = (id: string | null, onPick: (id: string | null) => void, label: string) => (
    <>
      <button type="button" onClick={() => onPick(null)} className={chip(id === null)}>
        💰 {label}
      </button>
      {pickable.map((m) => (
        <button key={m.id} type="button" onClick={() => onPick(m.id)} className={chip(id === m.id)}>
          {m.name}
        </button>
      ))}
    </>
  )

  return (
    <>
      <SheetHeader
        title={isNew ? titles[type] : 'Sửa khoản'}
        onCancel={onClose}
        right={
          <button type="button" onClick={submit} disabled={!!busy} className="disabled:opacity-60">
            <BusyLabel busy={busy === 'save'} label="Đang lưu">
              Lưu
            </BusyLabel>
          </button>
        }
      />

      <div className="flex gap-2 px-4 pt-4">
        {TYPES.map((t) => (
          <button key={t.key} type="button" onClick={() => switchType(t.key)} className={`flex-1 ${chip(type === t.key, t.tone)}`}>
            {t.label}
          </button>
        ))}
      </div>

      <AmountInput
        value={draft.amount}
        onChange={(amount) => patch({ amount })}
        accentColor={isIn ? '#2563eb' : type === 'out' ? '#dc2626' : '#16a34a'}
        autoFocus={isNew}
      />

      <div className="space-y-5 px-4 py-5">
        <div className="flex gap-2">
          <button type="button" onClick={() => patch({ done: true })} className={`flex-1 ${chip(draft.done)}`}>
            ✓ {doneLabel}
          </button>
          <button type="button" onClick={() => patch({ done: false })} className={`flex-1 ${chip(!draft.done)}`}>
            ⏳ {plannedLabel}
          </button>
        </div>

        <DatePicker
          label={draft.done ? `Ngày ${doneLabel.toLowerCase().replace('đã ', '')}` : 'Hạn / ngày dự kiến'}
          value={draft.date}
          onChange={(date) => date && patch({ date })}
        />

        {/* Khoản thu: chọn nhóm trước — "Còn lại từ đợt trước" đổi luôn câu hỏi / gợi ý ở phần chọn người bên dưới */}
        {isIn && categoryBlock}

        {pickable.length > 0 && isIn && (
          <div>
            <p className="text-sm text-muted">
              {carryover ? 'Tiền dư này của ai? (bỏ trống = của chung cả nhóm)' : isNew ? 'Ai góp? (chọn nhiều = mỗi người 1 khoản)' : 'Ai góp?'}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {pickable.map((m) => (
                <button key={m.id} type="button" onClick={() => togglePayer(m.id)} className={chip(payers.includes(m.id), 'income')}>
                  {m.name}
                </button>
              ))}
              {isNew && (
                <button
                  type="button"
                  onClick={() => setPayers(payers.length === activeIds.length ? [] : activeIds)}
                  className="px-2 text-sm text-accent"
                >
                  {payers.length === activeIds.length ? 'Bỏ chọn' : 'Tất cả'}
                </button>
              )}
            </div>
            {payers.length === 0 && (
              <p className="mt-2 text-xs text-muted">
                {carryover
                  ? 'Tiền chung của cả nhóm — chia đều cho mọi người đang trong quỹ, trừ vào phần phải chịu của mỗi người.'
                  : 'Không chọn ai = tiền từ nguồn khác (hoàn tiền, tiền thừa...), chia đều lại cho mọi người.'}
              </p>
            )}
            {multiPayers && draft.amount > 0 && (
              <p className="mt-2 text-xs text-muted">
                Tạo {payers.length} khoản × {formatVND(draft.amount)} = <b>{formatVND(payers.length * draft.amount)}</b>
              </p>
            )}
          </div>
        )}

        {members.length > 0 && type === 'out' && (
          <>
            <div>
              <p className="text-sm text-muted">Ai trả?</p>
              <div className="mt-2 flex flex-wrap gap-2">{fundChip(draft.memberId, (memberId) => patch({ memberId }), 'Quỹ chung')}</div>
            </div>
            <div>
              <p className="text-sm text-muted">
                Chia cho ({splitIds.length} người)
                {draft.amount > 0 && splitIds.length > 0 && ` · ${formatVND(draft.amount / splitIds.length)}/người`}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {pickable.map((m) => (
                  <button key={m.id} type="button" onClick={() => toggleSplit(m.id)} className={chip(splitIds.includes(m.id))}>
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {type === 'transfer' && (
          <>
            <div>
              <p className="text-sm text-muted">Từ</p>
              <div className="mt-2 flex flex-wrap gap-2">{fundChip(draft.memberId, (memberId) => patch({ memberId }), 'Quỹ')}</div>
            </div>
            <div>
              <p className="text-sm text-muted">Đến</p>
              <div className="mt-2 flex flex-wrap gap-2">{fundChip(draft.toMemberId, (toMemberId) => patch({ toMemberId }), 'Quỹ')}</div>
            </div>
          </>
        )}

        {!isIn && categoryBlock}

        <label className="block text-sm text-muted">
          Ghi chú
          <input
            value={draft.note}
            onChange={(e) => patch({ note: e.target.value })}
            placeholder={carryover ? 'VD: dư từ chuyến Đà Lạt' : isIn ? 'VD: đợt 1' : type === 'out' ? 'VD: lẩu gà lá é' : 'VD: trả lại tiền thừa'}
            className="mt-1 w-full rounded-xl bg-card-soft px-3 py-2 text-text outline-none"
          />
        </label>

        {fund.closed && <p className="text-xs text-muted">Quỹ này đã đóng — vẫn sửa được nếu cần.</p>}
        {error && <p className="text-sm text-danger">{error}</p>}

        {!isNew && (
          <button
            type="button"
            onClick={remove}
            disabled={!!busy}
            className="w-full rounded-xl bg-danger-soft py-3 text-sm font-semibold text-danger disabled:opacity-60"
          >
            <BusyLabel busy={busy === 'delete'} label="Đang xoá…">
              Xoá khoản này
            </BusyLabel>
          </button>
        )}
      </div>
    </>
  )
}
