import type { Metadata } from 'next'
import { Bricolage_Grotesque, Instrument_Sans } from 'next/font/google'
import { VitrineHydrator } from '@/components/vitrine/VitrineHydrator'
import { VitrineChrome } from '@/components/vitrine/VitrineChrome'
import './vitrine.css'

// Font riêng cho app này (khác Cormorant/DM Sans của portfolio) — bản sắc thị giác
// "Vitrine" đã được duyệt riêng, không dùng chung font mặc định của root layout.
const displayFont = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-vt-display',
  display: 'swap',
})

const bodyFont = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-vt-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Vitrine — Học từ vựng qua không gian 3D',
  description: 'Khám phá từ vựng đa ngôn ngữ (Tiếng Việt, English, 日本語, 한국어) qua các vật thể 3D.',
}

export default function VitrineLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${displayFont.variable} ${bodyFont.variable} vitrine-root`}>
      <VitrineHydrator />
      <VitrineChrome>{children}</VitrineChrome>
    </div>
  )
}
