import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './study.css'

// Sans hình học nét mảnh, chữ rộng — hợp phong cách thẻ kính hoàng hôn của trang này. Có subset
// 'vietnamese' (DM Sans ở layout gốc chỉ nạp 'latin' nên thiếu một số dấu tiếng Việt).
// Tự host (src/fonts, tải bằng scripts/download-google-fonts.mjs) thay vì next/font/google — xem ghi chú ở app/layout.tsx.
const studyLexend = localFont({
  src: [
    { path: '../../../fonts/lexend/lexend-300.woff', weight: '300', style: 'normal' },
    { path: '../../../fonts/lexend/lexend-400.woff', weight: '400', style: 'normal' },
    { path: '../../../fonts/lexend/lexend-500.woff', weight: '500', style: 'normal' },
    { path: '../../../fonts/lexend/lexend-600.woff', weight: '600', style: 'normal' },
  ],
  variable: '--font-sd',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Study',
  description: 'Toàn bộ bài học trong hệ sinh thái — bấm vào thẻ để mở app tương ứng.',
}

export default function StudyLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${studyLexend.variable} study-root min-h-dvh`}>{children}</div>
}
