import type { Metadata } from 'next'
import { CertsLoading } from '@/components/certs/CertsLoading'
import './certs.css'

export const metadata: Metadata = {
  title: 'Certs Hub',
  description: 'Tổng hợp đề thi các chứng chỉ — CCAF...',
}

export default function CertsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="certs-root">
      <CertsLoading />
      {children}
    </div>
  )
}
