import type { Metadata } from 'next'
import { MusicLoading } from '@/components/music/MusicLoading'
import './music.css'

export const metadata: Metadata = {
  title: 'Music Hub',
  description: 'Học nốt nhạc và lưu lại những bản nhạc yêu thích của bạn.',
}

export default function MusicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="music-root min-h-dvh">
      <MusicLoading />
      {children}
    </div>
  )
}
