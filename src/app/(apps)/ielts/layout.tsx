import type { Metadata } from 'next'
import { IeltsLoading } from '@/components/ielts/IeltsLoading'
import { bodyFont, handFont } from './fonts'
import './ielts.css'

export const metadata: Metadata = {
  title: 'IELTS Knowledge Hub',
  description: 'Gom kiến thức IELTS theo chủ đề/kỹ năng — Listening, Speaking, Reading, Writing, Từ vựng.',
}

// Layout ngoài cùng chỉ lo font/CSS — KHÔNG gate quyền truy cập ở đây, vì /ielts/login (route
// ngoài nhóm (protected)) phải luôn render được cho cả người chưa đăng nhập. Việc kiểm tra quyền
// nằm trong (protected)/layout.tsx, chỉ bọc /ielts. IeltsLoading đặt ở đây (không
// phải trong (protected)) để trang login cũng có loading khi gọi request-link.
export default function IeltsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${handFont.variable} ${bodyFont.variable} ielts-root`}>
      <IeltsLoading />
      {children}
    </div>
  )
}
