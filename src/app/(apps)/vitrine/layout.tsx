import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { VitrineHydrator } from '@/components/vitrine/VitrineHydrator'
import { VitrineChrome } from '@/components/vitrine/VitrineChrome'
import './vitrine.css'

// Font riêng cho app này (khác Cormorant/DM Sans của portfolio) — bản sắc thị giác
// "Vitrine" đã được duyệt riêng, không dùng chung font mặc định của root layout.
// Tự host (src/fonts, tải bằng scripts/download-google-fonts.mjs) thay vì next/font/google — xem ghi chú ở app/layout.tsx.
const vitrineBricolageGrotesque = localFont({
  src: [
    { path: '../../../fonts/bricolage-grotesque/bricolage-grotesque-500.woff', weight: '500', style: 'normal' },
    { path: '../../../fonts/bricolage-grotesque/bricolage-grotesque-600.woff', weight: '600', style: 'normal' },
    { path: '../../../fonts/bricolage-grotesque/bricolage-grotesque-700.woff', weight: '700', style: 'normal' },
  ],
  variable: '--font-vt-display',
  display: 'swap',
})

const vitrineInstrumentSans = localFont({
  src: [
    { path: '../../../fonts/instrument-sans/instrument-sans-400.woff', weight: '400', style: 'normal' },
    { path: '../../../fonts/instrument-sans/instrument-sans-500.woff', weight: '500', style: 'normal' },
    { path: '../../../fonts/instrument-sans/instrument-sans-600.woff', weight: '600', style: 'normal' },
  ],
  variable: '--font-vt-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Vitrine — Học từ vựng qua không gian 3D',
  description: 'Khám phá từ vựng đa ngôn ngữ (Tiếng Việt, English, 日本語, 한국어) qua các vật thể 3D.',
}

export default function VitrineLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${vitrineBricolageGrotesque.variable} ${vitrineInstrumentSans.variable} vitrine-root`}>
      <VitrineHydrator />
      <VitrineChrome>{children}</VitrineChrome>
    </div>
  )
}
