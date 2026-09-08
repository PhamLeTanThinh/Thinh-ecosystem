'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { VitrineHeader } from './VitrineHeader'
import { PageTransition } from './PageTransition'

// Header giống hệt nhau ở Discover/Chủ đề/Tiến trình/Hồ sơ nên đưa lên layout, render
// 1 lần duy nhất — trước đây mỗi trang tự vẽ lại header (kính + backdrop-filter) bên
// trong vùng opacity đang animate của PageTransition, khiến trình duyệt phải tính lại
// blur nền mỗi frame trong lúc chuyển trang, gây giật. Ẩn hẳn ở Học 3D vì màn đó phải
// tối giản tuyệt đối (yêu cầu UI bắt buộc), không có nav/chrome nào khác ngoài 2 nút góc.
function isLearningSceneRoute(pathname: string | null) {
  return /^\/vitrine\/topics\/[^/]+\/[^/]+$/.test(pathname ?? '')
}

export function VitrineChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const showHeader = !isLearningSceneRoute(pathname)

  return (
    <>
      {showHeader && (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 64px 0' }}>
          <VitrineHeader />
        </div>
      )}
      <PageTransition>{children}</PageTransition>
    </>
  )
}
