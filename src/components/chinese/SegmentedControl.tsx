'use client'

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  dense?: boolean
}

export function SegmentedControl<T extends string>({ options, value, onChange, dense }: SegmentedControlProps<T>) {
  return (
    <div className="flex gap-1 rounded-2xl bg-card-soft p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={`flex-1 whitespace-nowrap rounded-xl font-medium transition-all duration-200 ${
            dense ? 'px-2 py-1.5 text-xs' : 'px-3 py-2 text-sm'
          } ${value === option.value ? 'bg-card text-text shadow-sm' : 'text-muted'}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
