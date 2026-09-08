import Link from 'next/link'

export function ExitButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      aria-label="Thoát"
      className="vt-glass"
      style={{
        position: 'absolute',
        top: 28,
        left: 28,
        width: 44,
        height: 44,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M6 6l12 12M18 6L6 18" stroke="var(--color-vt-ink)" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </Link>
  )
}
