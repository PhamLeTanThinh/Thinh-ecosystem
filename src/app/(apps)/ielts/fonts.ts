import { Shantell_Sans, Inter } from 'next/font/google'

// Font riêng cho app IELTS — chữ viết tay cho tiêu đề/nhãn, Inter cho nội dung tài liệu.
// Caveat (bản cũ) không có bộ glyph tiếng Việt (Google Fonts không xuất bản subset 'vietnamese'
// cho Caveat) nên các dấu (ế, ứ…) bị vỡ font/tự fallback sang font hệ thống. Shantell Sans có
// subset 'vietnamese' đầy đủ và cùng các weight 500/600/700 nên giữ nguyên style hiện có.
// Tách ra file riêng vì trang /admin (ngoài app IELTS) dùng lại đúng bộ font + style này.
export const handFont = Shantell_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700'],
  variable: '--font-ih-hand',
  display: 'swap',
})

export const bodyFont = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ih-body',
  display: 'swap',
})
