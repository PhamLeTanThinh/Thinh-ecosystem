import type { Metadata } from 'next'
import { Lexend } from 'next/font/google'
import './study.css'

// Sans hình học nét mảnh, chữ rộng — hợp phong cách thẻ kính hoàng hôn của trang này. Có subset
// 'vietnamese' (DM Sans ở layout gốc chỉ nạp 'latin' nên thiếu một số dấu tiếng Việt).
const lexend = Lexend({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sd',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Study',
  description: 'Toàn bộ bài học trong hệ sinh thái — bấm vào thẻ để mở app tương ứng.',
}

export default function StudyLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${lexend.variable} study-root min-h-dvh`}>{children}</div>
}
