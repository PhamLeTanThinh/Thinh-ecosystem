import type { Metadata } from 'next'
import { ItLoading } from '@/components/it/ItLoading'
import './it.css'

export const metadata: Metadata = {
  title: 'IT Hub',
  description: 'Ôn kiến thức Master AI và Software Engineer.',
}

export default function ItLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="it-root min-h-dvh">
      <ItLoading />
      {children}
    </div>
  )
}
