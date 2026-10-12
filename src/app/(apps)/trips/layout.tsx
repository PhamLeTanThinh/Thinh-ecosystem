import type { Metadata } from 'next'
import { Baloo_2, Be_Vietnam_Pro, Fraunces, Oswald, Pacifico, Patrick_Hand } from 'next/font/google'
import { TripsDialog } from '@/components/trips/TripsDialog'
import { TripsLoading } from '@/components/trips/TripsLoading'
// Dùng lại theme Tailwind của app Thu Chi (bộ BottomSheet/AmountInput), rồi trips.css đổi bảng màu sang tông du lịch.
import '../money/money.css'
import './trips.css'

// Tiêu đề serif kiểu tạp chí du lịch
const displayFont = Fraunces({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-tp-display',
  display: 'swap',
})

const bodyFont = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-tp-body',
  display: 'swap',
})

// Font riêng của từng theme chuyến đi (trips.css: .tp-theme-road / trek / beach)
const roadFont = Oswald({ subsets: ['latin', 'vietnamese'], weight: ['500', '700'], variable: '--font-tp-road', display: 'swap' })
const handFont = Patrick_Hand({ subsets: ['latin', 'vietnamese'], weight: '400', variable: '--font-tp-hand', display: 'swap' })
const scriptFont = Pacifico({ subsets: ['latin', 'vietnamese'], weight: '400', variable: '--font-tp-script', display: 'swap' })
const roundFont = Baloo_2({ subsets: ['latin', 'vietnamese'], weight: ['600', '800'], variable: '--font-tp-round', display: 'swap' })

export const metadata: Metadata = {
  title: 'Trip & Quỹ chung',
  description: 'Quản lý thu chi cho chuyến đi và các khoản góp quỹ chung.',
}

export default function TripsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${displayFont.variable} ${bodyFont.variable} ${roadFont.variable} ${handFont.variable} ${scriptFont.variable} ${roundFont.variable} money-root trips-root`}
    >
      <TripsLoading />
      {children}
      <TripsDialog />
    </div>
  )
}
