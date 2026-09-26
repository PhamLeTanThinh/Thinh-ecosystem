import type { Metadata } from 'next'
import { AdminGate } from '@/components/admin/AdminGate'
import { getAdminAccess } from '@/lib/admin/access'
import { bodyFont } from './fonts'
import './admin.css'

export const metadata: Metadata = {
  title: 'Admin Hub',
  description: 'Trang quản trị dành riêng cho chủ trang.',
  robots: { index: false, follow: false },
}

// Trang quản trị NẰM NGOÀI app IELTS: quyền vào chỉ xét "có phải chủ trang không" (phiên đăng nhập email = chủ),
// không cần chủ là người-được-mời-xem-IELTS — trước đây admin nằm trong /ielts nên chủ chưa đăng nhập IELTS thì
// cũng không vào được để duyệt yêu cầu của người khác. Giao diện riêng (admin.css), không còn dùng chung hệ
// màu/font vui nhộn của IELTS (ih-*) — xem admin.css. Việc chặn quyền thật nằm ở từng API dưới /api/admin/*
// (requireAdminApi), layout này chỉ quyết định hiện gì.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const access = await getAdminAccess()
  return <div className={`${bodyFont.variable} adm-shell`}>{access.ok ? children : <AdminGate />}</div>
}
