'use client'

import { useState } from 'react'
import { BottomSheet } from '@/components/money/BottomSheet'
import { SheetHeader } from '@/components/money/SheetHeader'
import { askConfirm } from '@/lib/trips/dialog'
import { useTrips } from '@/lib/trips/store'
import { todayISO, type FundMember } from '@/lib/trips/types'
import { DatePicker } from './DatePicker'
import { BusyLabel } from './ui'
import { ErrorBanner } from './ErrorBanner'
import { useDirty } from './useDirty'

interface MemberSheetProps {
  member: FundMember | null // null khi đóng
  used: boolean // đã có khoản thu chi nhắc tới người này → không xoá hẳn được
  onClose: () => void
}

// Sửa 1 thành viên: tên, ngày vào / rời quỹ, liên hệ. Rời quỹ = đặt ngày rời (giữ nguyên số liệu cũ);
// chỉ xoá hẳn được khi người đó chưa dính khoản nào.
export function MemberSheet(props: MemberSheetProps) {
  return (
    <BottomSheet open={!!props.member} onClose={props.onClose} responsive closeOnBackdrop={false}>
      {props.member && <MemberForm key={props.member.id} {...props} member={props.member} />}
    </BottomSheet>
  )
}

function MemberForm({ member, used, onClose }: MemberSheetProps & { member: FundMember }) {
  const updateMember = useTrips((s) => s.updateMember)
  const deleteMember = useTrips((s) => s.deleteMember)
  const [draft, setDraft] = useState(member)
  const [busy, setBusy] = useState<'save' | 'leave' | 'delete' | null>(null) // thao tác đang chạy → spinner trên đúng nút
  const [error, setError] = useState('')
  // Chưa thay đổi gì so với lúc mở form → tắt nút Lưu
  const dirty = useDirty({ draft })
  const patch = (p: Partial<FundMember>) => setDraft((d) => ({ ...d, ...p }))

  async function run(action: 'save' | 'leave' | 'delete', fn: () => Promise<void>) {
    setBusy(action)
    setError('')
    try {
      await fn()
      onClose()
    } catch (e) {
      setError((e as Error).message)
      setBusy(null)
    }
  }

  const save = () =>
    run('save', () => {
      if (!draft.name.trim()) throw new Error('Nhập tên')
      const { id, name, joinedAt, leftAt, note, contact } = draft
      return updateMember({ id, name, joinedAt, leftAt, note, contact })
    })

  return (
    <>
      <SheetHeader
        title="Thành viên"
        onCancel={onClose}
        right={
          <button
            type="button"
            onClick={save}
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
        <input
          value={draft.name}
          onChange={(e) => patch({ name: e.target.value })}
          className="h-12 w-full border-b border-border bg-transparent text-lg font-semibold outline-none"
        />

        <div className="grid grid-cols-2 gap-3">
          <DatePicker label="Vào quỹ từ" value={draft.joinedAt} clearable onChange={(joinedAt) => patch({ joinedAt })} />
          <DatePicker label="Rời quỹ" value={draft.leftAt} min={draft.joinedAt} clearable align="right" onChange={(leftAt) => patch({ leftAt })} />
        </div>
        <p className="-mt-3 text-xs text-muted">
          Để trống &ldquo;Vào quỹ từ&rdquo; = có mặt từ đầu. Khoản chi trước ngày vào / sau ngày rời sẽ không mặc định chia cho người này.
        </p>

        <label className="block text-sm text-muted">
          Liên hệ (SĐT / số tài khoản)
          <input
            value={draft.contact}
            onChange={(e) => patch({ contact: e.target.value })}
            className="mt-1 w-full rounded-xl bg-card-soft px-3 py-2 text-text outline-none"
          />
        </label>
        <label className="block text-sm text-muted">
          Ghi chú
          <input
            value={draft.note}
            onChange={(e) => patch({ note: e.target.value })}
            className="mt-1 w-full rounded-xl bg-card-soft px-3 py-2 text-text outline-none"
          />
        </label>

        {member.leftAt ? (
          <button
            type="button"
            disabled={!!busy}
            onClick={() => run('leave', () => updateMember({ id: member.id, leftAt: null }))}
            className="w-full rounded-xl bg-accent-soft py-3 text-sm font-semibold text-accent disabled:opacity-60"
          >
            <BusyLabel busy={busy === 'leave'}>↩ Quay lại quỹ</BusyLabel>
          </button>
        ) : (
          <button
            type="button"
            disabled={!!busy}
            onClick={() => run('leave', () => updateMember({ id: member.id, leftAt: todayISO() }))}
            className="w-full rounded-xl bg-card-soft py-3 text-sm font-semibold disabled:opacity-60"
          >
            <BusyLabel busy={busy === 'leave'}>🚪 Cho rời quỹ từ hôm nay</BusyLabel>
          </button>
        )}
        <button
          type="button"
          disabled={!!busy || used}
          onClick={async () => {
            const ok = await askConfirm({
              title: `Xoá hẳn ${member.name}?`,
              message: 'Người này sẽ biến mất khỏi quỹ. Nếu chỉ muốn tạm rời đoàn thì dùng "Cho rời quỹ".',
              confirmLabel: 'Xoá hẳn',
              tone: 'danger',
              icon: '👋',
            })
            if (ok) run('delete', () => deleteMember(member.id))
          }}
          className="w-full rounded-xl bg-danger-soft py-3 text-sm font-semibold text-danger disabled:opacity-40"
        >
          <BusyLabel busy={busy === 'delete'} label="Đang xoá…">
            Xoá hẳn
          </BusyLabel>
        </button>
        {used && <p className="-mt-3 text-center text-xs text-muted">Đã có khoản thu chi liên quan — chỉ cho rời quỹ được, không xoá hẳn.</p>}
      </div>
    </>
  )
}
