import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NotesHydrator } from '@/components/notes/NotesHydrator'
import './notes.css'

const bodyFont = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-nt-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ghi Chú',
  description: 'Bảng ghi chú tự do, tự động nhóm theo tuần / tháng / năm.',
}

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${bodyFont.variable} notes-root`}>
      <NotesHydrator />
      {children}
    </div>
  )
}
