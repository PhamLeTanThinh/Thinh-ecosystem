import type { Metadata } from 'next'
import { PmLoading } from '@/components/pm/PmLoading'
import './pm.css'

export const metadata: Metadata = {
  title: 'Project Manager',
  description: 'Ôn kiến thức quản lý dự án — Agile, Scrum, PMBOK, quản trị rủi ro.',
}

export default function PmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pm-root">
      <PmLoading />
      {children}
    </div>
  )
}
