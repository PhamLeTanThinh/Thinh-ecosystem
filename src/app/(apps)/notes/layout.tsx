import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NotesHydrator } from '@/components/notes/NotesHydrator'
import { NotesConfirmProvider } from '@/components/notes/ConfirmDialog'
import './notes.css'

const bodyFont = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-nt-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Notes',
  description: 'A free-form note board, automatically grouped by week / month / year.',
}

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${bodyFont.variable} notes-root`}>
      <NotesHydrator />
      <NotesConfirmProvider>{children}</NotesConfirmProvider>
    </div>
  )
}
