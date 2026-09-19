'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LevelLanding, type LandingItem } from '@/components/landing/LevelLanding'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { withViewTransition } from '@/lib/viewTransition'

const ITEMS: LandingItem[] = [
  { key: 'learn', icon: '♪', label: 'Học nốt nhạc', meta: 'Luyện đọc khuông nhạc' },
  { key: 'favorites', icon: '★', label: 'Nhạc yêu thích', meta: 'Lưu bản nhạc bạn thích' },
]

export default function MusicPage() {
  const router = useRouter()

  // Card ở đây và icon tiêu đề trang con (.ms-page-icon, cùng view-transition-name) khiến trình
  // duyệt tự "bay" card sang trang đích — cùng cơ chế với /korean, /chinese (lib/viewTransition.ts),
  // nhưng đây là điều hướng SANG TRANG KHÁC (không phải đổi state trong 1 trang) nên phải prefetch
  // sẵn 2 trang đích: startViewTransition cần DOM trang mới sẵn sàng ngay khi callback trả về, nếu
  // router.push còn phải chờ tải RSC của trang đích thì hiệu ứng bay sẽ bị đứt/nhảy khựng.
  useEffect(() => {
    router.prefetch('/music/learn')
    router.prefetch('/music/favorites')
  }, [router])

  function pickItem(key: string) {
    withViewTransition(() => router.push(`/music/${key}`))
  }

  return (
    <div className="ms-content ms-landing-page">
      <AppBreadcrumb app="/music" />
      <LevelLanding eyebrow="♪ Music" title="Music Hub" subtitle="Chọn một mục để bắt đầu." items={ITEMS} transitionPrefix="ms" onPick={pickItem} />
    </div>
  )
}
