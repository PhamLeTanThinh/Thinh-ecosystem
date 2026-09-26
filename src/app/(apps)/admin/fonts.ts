import { Inter } from 'next/font/google'

// Font riêng của /admin — chỉ 1 font trung tính (Inter) cho toàn trang, không dùng font chữ viết tay của IELTS
// nữa (trang quản trị cần đọc nhanh, chuyên nghiệp hơn là dễ thương). Popup xác nhận (AdminDialog) vẫn giữ
// nguyên mèo Diên, không liên quan tới font này.
export const bodyFont = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-adm-body',
  display: 'swap',
})
