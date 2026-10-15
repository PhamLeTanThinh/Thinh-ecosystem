import localFont from 'next/font/local'

// Tự host (src/fonts, tải bằng scripts/download-google-fonts.mjs) thay vì next/font/google — xem ghi chú ở app/layout.tsx.

// Font riêng cho app IELTS — chữ viết tay cho tiêu đề/nhãn, Inter cho nội dung tài liệu.
// Caveat (bản cũ) không có bộ glyph tiếng Việt (Google Fonts không xuất bản subset 'vietnamese'
// cho Caveat) nên các dấu (ế, ứ…) bị vỡ font/tự fallback sang font hệ thống. Shantell Sans có
// subset 'vietnamese' đầy đủ và cùng các weight 500/600/700 nên giữ nguyên style hiện có.
// Tách ra file riêng vì trang /admin (ngoài app IELTS) dùng lại đúng bộ font + style này.
const ieltsShantellSans = localFont({
  src: [
    { path: '../../../fonts/shantell-sans/shantell-sans-500.woff', weight: '500', style: 'normal' },
    { path: '../../../fonts/shantell-sans/shantell-sans-600.woff', weight: '600', style: 'normal' },
    { path: '../../../fonts/shantell-sans/shantell-sans-700.woff', weight: '700', style: 'normal' },
  ],
  variable: '--font-ih-hand',
  display: 'swap',
})

const ieltsInter = localFont({
  src: [
    { path: '../../../fonts/inter/inter-400.woff', weight: '400', style: 'normal' },
    { path: '../../../fonts/inter/inter-500.woff', weight: '500', style: 'normal' },
    { path: '../../../fonts/inter/inter-600.woff', weight: '600', style: 'normal' },
    { path: '../../../fonts/inter/inter-700.woff', weight: '700', style: 'normal' },
  ],
  variable: '--font-ih-body',
  display: 'swap',
})

// next/font/local đặt tên font-family theo TÊN BIẾN khai báo — để tên duy nhất trong toàn site (các app khác cũng
// có "bodyFont"/"handFont", trùng tên thì @font-face của app này đè app kia khi chuyển trang), rồi export theo tên cũ.
export const handFont = ieltsShantellSans
export const bodyFont = ieltsInter
