import type { Metadata } from 'next'
import { Shantell_Sans, Inter } from 'next/font/google'
import './ielts.css'

// Font riêng cho app này — chữ viết tay cho tiêu đề/nhãn, Inter cho nội dung tài liệu.
// Caveat (bản cũ) không có bộ glyph tiếng Việt (Google Fonts không xuất bản subset 'vietnamese'
// cho Caveat) nên các dấu (ế, ứ…) bị vỡ font/tự fallback sang font hệ thống. Shantell Sans có
// subset 'vietnamese' đầy đủ và cùng các weight 500/600/700 nên giữ nguyên style hiện có.
const handFont = Shantell_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700'],
  variable: '--font-ih-hand',
  display: 'swap',
})

const bodyFont = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ih-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'IELTS Knowledge Hub',
  description: 'Gom kiến thức IELTS theo chủ đề/kỹ năng — Listening, Speaking, Reading, Writing, Từ vựng.',
}

// Layout ngoài cùng chỉ lo font/CSS — KHÔNG gate quyền truy cập ở đây, vì /ielts/login (route
// ngoài nhóm (protected)) phải luôn render được cho cả người chưa đăng nhập. Việc kiểm tra quyền
// nằm trong (protected)/layout.tsx, chỉ bọc /ielts và /ielts/admin.
export default function IeltsLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${handFont.variable} ${bodyFont.variable} ielts-root`}>{children}</div>
}
