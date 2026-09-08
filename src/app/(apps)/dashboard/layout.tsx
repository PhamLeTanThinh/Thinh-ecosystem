import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './dashboard.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Toàn bộ công cụ trong hệ sinh thái — bấm vào để mở.',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${spaceGrotesk.variable} dashboard-root min-h-dvh`}>{children}</div>
}
