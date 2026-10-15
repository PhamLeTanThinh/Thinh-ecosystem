import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { TripsDialog } from '@/components/trips/TripsDialog'
import { TripsLoading } from '@/components/trips/TripsLoading'
// Dùng lại theme Tailwind của app Thu Chi (bộ BottomSheet/AmountInput), rồi trips.css đổi bảng màu sang tông du lịch.
import '../money/money.css'
import './trips.css'

// Tiêu đề serif kiểu tạp chí du lịch
// Tự host (src/fonts, tải bằng scripts/download-google-fonts.mjs) thay vì next/font/google — xem ghi chú ở app/layout.tsx.
const tripsFraunces = localFont({
  src: [
    { path: '../../../fonts/fraunces/fraunces-500.woff', weight: '500', style: 'normal' },
    { path: '../../../fonts/fraunces/fraunces-500-italic.woff', weight: '500', style: 'italic' },
    { path: '../../../fonts/fraunces/fraunces-700.woff', weight: '700', style: 'normal' },
    { path: '../../../fonts/fraunces/fraunces-700-italic.woff', weight: '700', style: 'italic' },
    { path: '../../../fonts/fraunces/fraunces-900.woff', weight: '900', style: 'normal' },
    { path: '../../../fonts/fraunces/fraunces-900-italic.woff', weight: '900', style: 'italic' },
  ],
  variable: '--font-tp-display',
  display: 'swap',
})

const tripsBeVietnamPro = localFont({
  src: [
    { path: '../../../fonts/be-vietnam-pro/be-vietnam-pro-400.woff', weight: '400', style: 'normal' },
    { path: '../../../fonts/be-vietnam-pro/be-vietnam-pro-500.woff', weight: '500', style: 'normal' },
    { path: '../../../fonts/be-vietnam-pro/be-vietnam-pro-600.woff', weight: '600', style: 'normal' },
    { path: '../../../fonts/be-vietnam-pro/be-vietnam-pro-700.woff', weight: '700', style: 'normal' },
  ],
  variable: '--font-tp-body',
  display: 'swap',
})

// Font riêng của từng theme chuyến đi (trips.css: .tp-theme-road / trek / beach)
const tripsOswald = localFont({
  src: [
    { path: '../../../fonts/oswald/oswald-500.woff', weight: '500', style: 'normal' },
    { path: '../../../fonts/oswald/oswald-700.woff', weight: '700', style: 'normal' },
  ],
  variable: '--font-tp-road',
  display: 'swap',
})
const tripsPatrickHand = localFont({
  src: [
    { path: '../../../fonts/patrick-hand/patrick-hand-400.woff', weight: '400', style: 'normal' },
  ],
  variable: '--font-tp-hand',
  display: 'swap',
})
const tripsPacifico = localFont({
  src: [
    { path: '../../../fonts/pacifico/pacifico-400.woff', weight: '400', style: 'normal' },
  ],
  variable: '--font-tp-script',
  display: 'swap',
})
const tripsBaloo2 = localFont({
  src: [
    { path: '../../../fonts/baloo-2/baloo-2-600.woff', weight: '600', style: 'normal' },
    { path: '../../../fonts/baloo-2/baloo-2-800.woff', weight: '800', style: 'normal' },
  ],
  variable: '--font-tp-round',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Trip & Quỹ chung',
  description: 'Quản lý thu chi cho chuyến đi và các khoản góp quỹ chung.',
}

export default function TripsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${tripsFraunces.variable} ${tripsBeVietnamPro.variable} ${tripsOswald.variable} ${tripsPatrickHand.variable} ${tripsPacifico.variable} ${tripsBaloo2.variable} money-root trips-root`}
    >
      <TripsLoading />
      {children}
      <TripsDialog />
    </div>
  )
}
