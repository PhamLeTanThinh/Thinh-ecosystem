import type { Metadata } from 'next'
import './study.css'

export const metadata: Metadata = {
  title: 'Study',
  description: 'Toàn bộ bài học trong hệ sinh thái — bấm vào thẻ để mở app tương ứng.',
}

export default function StudyLayout({ children }: { children: React.ReactNode }) {
  return <div className="study-root min-h-dvh">{children}</div>
}
