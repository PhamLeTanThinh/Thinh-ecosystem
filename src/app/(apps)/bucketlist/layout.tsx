import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './bucketlist.css'

// Chữ tiêu đề to kiểu tô sáp màu
// Tự host (src/fonts, tải bằng scripts/download-google-fonts.mjs) thay vì next/font/google — xem ghi chú ở app/layout.tsx.
const bucketLondrinaSolid = localFont({
  src: [
    { path: '../../../fonts/londrina-solid/londrina-solid-400.woff', weight: '400', style: 'normal' },
    { path: '../../../fonts/londrina-solid/londrina-solid-900.woff', weight: '900', style: 'normal' },
  ],
  variable: '--font-bl-title',
  display: 'swap',
})

// Chữ viết tay cho danh sách — có bộ tiếng Việt
const bucketPatrickHand = localFont({
  src: [
    { path: '../../../fonts/patrick-hand/patrick-hand-400.woff', weight: '400', style: 'normal' },
  ],
  variable: '--font-bl-hand',
  display: 'swap',
})

const bucketCaveat = localFont({
  src: [
    { path: '../../../fonts/caveat/caveat-600.woff', weight: '600', style: 'normal' },
    { path: '../../../fonts/caveat/caveat-700.woff', weight: '700', style: 'normal' },
  ],
  variable: '--font-bl-script',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bucket List — 100 điều muốn làm trước khi chết',
  description: '100 điều muốn làm được trong đời.',
}

export default function BucketListLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${bucketLondrinaSolid.variable} ${bucketPatrickHand.variable} ${bucketCaveat.variable} bl-root`}>{children}</div>
}
