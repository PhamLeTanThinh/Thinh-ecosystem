'use client'

import { useMemo, useState } from 'react'
import { nanoid } from 'nanoid'
import { BottomSheet } from '@/components/money/BottomSheet'
import { SheetHeader } from '@/components/money/SheetHeader'
import { askConfirm } from '@/lib/trips/dialog'
import { useTrips, type RoundInput } from '@/lib/trips/store'
import { formatVND, isLeft, openingEntryId, roundSummaries, sortRounds, todayISO, type Fund, type FundRound } from '@/lib/trips/types'
import { DatePicker } from './DatePicker'
import { MoneyField } from './FundSheet'
import { Avatar, BusyLabel } from './ui'
import { ErrorBanner } from './ErrorBanner'

// Đợt mới của 1 quỹ dùng nhiều lần: mặc định copy người tham gia + mức góp của đợt gần nhất, tiền dư tự mang sang.
export function newRoundDraft(fund: Fund, rounds: FundRound[]): RoundInput {
  const last = sortRounds(rounds.filter((r) => r.fundId === fund.id)).at(-1)
  return {
    id: nanoid(),
    fundId: fund.id,
    name: '',
    note: '',
    startDate: null,
    endDate: null,
    target: 0,
    perMemberTarget: last?.perMemberTarget ?? fund.perMemberTarget,
    memberIds: last?.memberIds ?? [],
    closed: false,
  }
}

interface RoundSheetProps {
  fund: Fund
  round: RoundInput | null // null khi đóng
  isNew: boolean
  onClose: () => void
  onSaved?: (round: FundRound) => void
  onDeleted?: () => void
}

export function RoundSheet(props: RoundSheetProps) {
  return (
    <BottomSheet open={!!props.round} onClose={props.onClose} responsive closeOnBackdrop={false}>
      {props.round && <RoundForm key={props.round.id} {...props} round={props.round} />}
    </BottomSheet>
  )
}

function RoundForm({ fund, round, isNew, onClose, onSaved, onDeleted }: RoundSheetProps & { round: RoundInput }) {
  const { members: allMembers, rounds: allRounds, entries: allEntries, createRound, updateRound, deleteRound, setRoundOpening } = useTrips()
  const members = allMembers.filter((m) => m.fundId === fund.id && !isLeft(m))
  const rounds = useMemo(() => allRounds.filter((r) => r.fundId === fund.id), [allRounds, fund.id])
  const entries = useMemo(() => allEntries.filter((e) => e.fundId === fund.id), [allEntries, fund.id])
  const [draft, setDraft] = useState<RoundInput>(round)
  const [names, setNames] = useState<{ id: string; name: string }[]>([])
  const [newName, setNewName] = useState('')
  const [busy, setBusy] = useState<'save' | 'delete' | null>(null)
  const [error, setError] = useState('')
  const patch = (p: Partial<RoundInput>) => setDraft((d) => ({ ...d, ...p }))

  // Tiền mang sang: đợt mới = số dư cuối đợt gần nhất; sửa đợt cũ = số dư đầu của chính đợt đó
  const summaries = roundSummaries(rounds, entries)
  const carry = isNew ? (summaries.at(-1)?.closing ?? 0) : (summaries.find((s) => s.round.id === round.id)?.opening ?? 0)
  // Chỉ đợt đầu tiên của quỹ mới nhập được số dư ban đầu (tiền có sẵn trước khi dùng app). Các đợt sau: số dư đầu đợt
  // luôn = số dư cuối đợt trước, tự tính, không cho sửa tay để số liệu không lệch.
  const isFirst = isNew ? rounds.length === 0 : sortRounds(rounds)[0]?.id === round.id
  const [initial, setInitial] = useState(() => entries.find((e) => e.id === openingEntryId(round.id))?.amount ?? 0)
  const hasEntries = entries.some((e) => e.roundId === round.id && e.id !== openingEntryId(round.id))
  const headcount = draft.memberIds.length + names.length

  const toggle = (id: string) =>
    patch({ memberIds: draft.memberIds.includes(id) ? draft.memberIds.filter((x) => x !== id) : [...draft.memberIds, id] })

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
    if (!draft.name.trim()) return setError('Đặt tên cho đợt (VD: 8/3, Tết 2027)')
    setBusy('save')
    setError('')
    try {
      const newMembers = [...names, ...pendingNames()]
      if (isNew) {
        // Quỹ cũ chưa chia đợt (vd vừa đổi từ "Chuyến đi" sang) → khoản đang có gom vào đợt đầu tiên này
        const saved = await createRound(draft, { newMembers, adoptOrphans: rounds.length === 0 })
        if (isFirst) await setRoundOpening(saved, initial, draft.startDate ?? todayISO())
        onSaved?.(saved)
      } else {
        const { id, name, note, startDate, endDate, target, perMemberTarget, memberIds, closed } = draft
        await updateRound({ id, name, note, startDate, endDate, target, perMemberTarget, memberIds, closed })
        if (isFirst) await setRoundOpening(round, initial, startDate ?? todayISO())
      }
      onClose()
    } catch (e) {
      setError((e as Error).message)
      setBusy(null)
    }
  }

  async function remove() {
    const ok = await askConfirm({
      title: `Xoá đợt "${round.name}"?`,
      message: 'Đợt chưa có khoản nào nên xoá không ảnh hưởng số liệu.',
      confirmLabel: 'Xoá đợt',
      tone: 'danger',
    })
    if (!ok) return
    setBusy('delete')
    try {
      await setRoundOpening(round, 0, todayISO())
      await deleteRound(round.id)
      onClose()
      onDeleted?.()
    } catch (e) {
      setError((e as Error).message)
      setBusy(null)
    }
  }

  return (
    <>
      <SheetHeader
        title={isNew ? 'Đợt mới' : 'Sửa đợt'}
        onCancel={onClose}
        right={
          <button type="button" onClick={submit} disabled={!!busy} className="disabled:opacity-60">
            <BusyLabel busy={busy === 'save'} label="Đang lưu">
              Lưu
            </BusyLabel>
          </button>
        }
      />
      <div className="space-y-5 px-4 py-5">
        <ErrorBanner error={error} />
        <input
          value={draft.name}
          onChange={(e) => patch({ name: e.target.value })}
          placeholder="Tên đợt — VD: 8/3, Tết 2027"
          autoFocus={isNew}
          className="h-12 w-full border-b border-border bg-transparent text-lg font-semibold outline-none"
        />

        {isFirst ? (
          // Đợt đầu: nhập tiền quỹ đang có sẵn (VD dư từ trước khi dùng app) — chỉ chỗ này sửa được số dư
          <div className="rounded-2xl bg-accent-soft px-4 py-3">
            <MoneyField label="💰 Số dư ban đầu" value={initial} onChange={setInitial} />
            <p className="mt-1 text-xs text-muted">Tiền quỹ đang có sẵn trước đợt này (để 0 nếu bắt đầu từ con số 0). Số dư các đợt sau tự tính.</p>
          </div>
        ) : (
          // Đợt sau: số dư đầu đợt = số dư cuối đợt trước — chỉ hiển thị, không sửa
          <div className="flex items-center gap-3 rounded-2xl bg-accent-soft px-4 py-3">
            <span className="text-2xl">♻️</span>
            <div className="min-w-0">
              <p className="text-xs text-muted">Số dư đầu đợt — tự mang sang từ đợt trước</p>
              <p className={`text-lg font-bold ${carry < 0 ? 'text-danger' : 'text-accent'}`}>{formatVND(carry)}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <DatePicker
            label="Bắt đầu gom"
            value={draft.startDate}
            clearable
            onChange={(startDate) => patch({ startDate, endDate: startDate && draft.endDate && draft.endDate < startDate ? null : draft.endDate })}
          />
          <DatePicker
            label="Hạn chót"
            value={draft.endDate}
            min={draft.startDate}
            clearable
            align="right"
            onChange={(endDate) => patch({ endDate })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <MoneyField label="Mỗi người góp" value={draft.perMemberTarget} onChange={(perMemberTarget) => patch({ perMemberTarget })} />
          <MoneyField
            label="Tổng cần gom"
            value={draft.target}
            onChange={(target) => patch({ target })}
            hint={
              !draft.target && draft.perMemberTarget && headcount
                ? `Để trống = ${formatVND(draft.perMemberTarget * headcount)} (${headcount} người)`
                : undefined
            }
          />
        </div>

        <div>
          <p className="text-sm text-muted">
            Ai tham gia đợt này? ({headcount}/{members.length + names.length})
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {members.map((m) => {
              const on = draft.memberIds.includes(m.id)
              return (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(m.id)}
                  className={`flex items-center gap-1.5 rounded-pill border py-1 pl-1 pr-3 text-sm transition ${
                    on ? 'border-accent bg-accent-soft text-accent' : 'border-border text-muted opacity-70'
                  }`}
                >
                  <Avatar id={m.id} name={m.name} size={22} faded={!on} />
                  {m.name}
                </button>
              )
            })}
            {names.map((m) => (
              <span
                key={m.id}
                className="flex items-center gap-1 rounded-pill border border-accent bg-accent-soft py-1 pl-3 pr-1 text-sm text-accent"
              >
                {m.name} <span className="text-[10px] uppercase">mới</span>
                <button
                  type="button"
                  aria-label={`Bỏ ${m.name}`}
                  onClick={() => setNames((n) => n.filter((x) => x.id !== m.id))}
                  className="h-6 w-6 rounded-full"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          {members.length > 0 && (
            <div className="mt-2 flex gap-3 text-xs">
              <button type="button" onClick={() => patch({ memberIds: members.map((m) => m.id) })} className="text-accent">
                Chọn tất cả
              </button>
              <button type="button" onClick={() => patch({ memberIds: [] })} className="text-muted">
                Bỏ chọn
              </button>
            </div>
          )}
          <div className="mt-3 flex gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addNames()
                }
              }}
              placeholder="Người mới (nhiều tên cách nhau dấu phẩy)"
              className="min-w-0 flex-1 rounded-xl bg-card-soft px-3 py-2 text-sm outline-none"
            />
            <button type="button" onClick={addNames} className="rounded-xl bg-accent px-4 text-sm font-semibold text-white">
              Thêm
            </button>
          </div>
          <p className="mt-2 text-xs text-muted">
            Ai góp dư / còn thiếu ở đợt trước sẽ được tính tiếp vào &ldquo;cần góp đợt này&rdquo;. Người không tham gia vẫn giữ phần dư của mình.
          </p>
        </div>

        <label className="block text-sm text-muted">
          Ghi chú
          <input
            value={draft.note}
            onChange={(e) => patch({ note: e.target.value })}
            placeholder="VD: mua hoa + bánh"
            className="mt-1 w-full rounded-xl bg-card-soft px-3 py-2 text-text outline-none"
          />
        </label>

        {!isNew && (
          <label className="flex items-center justify-between text-sm">
            <span>Đã xong đợt này</span>
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
            disabled={!!busy || hasEntries}
            className="w-full rounded-xl bg-danger-soft py-3 text-sm font-semibold text-danger disabled:opacity-40"
          >
            <BusyLabel busy={busy === 'delete'} label="Đang xoá…">
              Xoá đợt
            </BusyLabel>
          </button>
        )}
        {!isNew && hasEntries && (
          <p className="-mt-3 text-center text-xs text-muted">Đợt đã có khoản thu chi — xoá các khoản trước nếu muốn xoá đợt.</p>
        )}
      </div>
    </>
  )
}
