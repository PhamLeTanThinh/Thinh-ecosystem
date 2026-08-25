import type { ReactNode } from 'react'

interface SheetHeaderProps {
  title: string
  onCancel: () => void
  cancelLabel?: string
  right?: ReactNode
}

export function SheetHeader({ title, onCancel, cancelLabel = 'Huỷ', right }: SheetHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 pb-4 pt-2">
      <button type="button" onClick={onCancel} className="text-sm text-muted">
        {cancelLabel}
      </button>
      <h2 className="text-base font-bold">{title}</h2>
      <div className="min-w-[44px] text-right text-sm font-semibold text-accent">{right}</div>
    </div>
  )
}
