import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { NotesHydrator } from '@/components/notes/NotesHydrator'
import { NotesConfirmProvider } from '@/components/notes/ConfirmDialog'
import './notes.css'

// Tự host (src/fonts, tải bằng scripts/download-google-fonts.mjs) thay vì next/font/google — xem ghi chú ở app/layout.tsx.
const notesInter = localFont({
  src: [
    { path: '../../../fonts/inter/inter-400.woff', weight: '400', style: 'normal' },
    { path: '../../../fonts/inter/inter-500.woff', weight: '500', style: 'normal' },
    { path: '../../../fonts/inter/inter-600.woff', weight: '600', style: 'normal' },
    { path: '../../../fonts/inter/inter-700.woff', weight: '700', style: 'normal' },
    { path: '../../../fonts/inter/inter-800.woff', weight: '800', style: 'normal' },
  ],
  variable: '--font-nt-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Notes',
  description: 'A free-form note board, automatically grouped by week / month / year.',
}

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${notesInter.variable} notes-root`}>
      <NotesHydrator />
      <NotesConfirmProvider>{children}</NotesConfirmProvider>
    </div>
  )
}
