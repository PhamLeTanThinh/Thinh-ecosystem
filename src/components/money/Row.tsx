import type { ReactNode } from 'react'

interface RowProps {
  icon?: ReactNode
  label: string
  value?: ReactNode
  onClick?: () => void
  chevron?: boolean
}

export function Row({ icon, label, value, onClick, chevron = true }: RowProps) {
  const content = (
    <>
      {icon && <span className="flex h-8 w-8 shrink-0 items-center justify-center">{icon}</span>}
      <span className="flex-1 text-sm text-muted">{label}</span>
      {value !== undefined && <span className="text-sm font-medium">{value}</span>}
      {chevron && onClick && <span className="text-muted">›</span>}
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-3 border-b border-border px-4 py-4 text-left last:border-b-0"
      >
        {content}
      </button>
    )
  }

  return <div className="flex w-full items-center gap-3 border-b border-border px-4 py-4 last:border-b-0">{content}</div>
}
