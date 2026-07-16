import type { Metadata } from 'next'
import { BottomNav } from '@/components/habits/BottomNav'
import { HabitsHydrator } from '@/components/habits/HabitsHydrator'
import { Sidebar } from '@/components/habits/Sidebar'
import { AddHabitModal } from '@/components/habits/modals/AddHabitModal'
import './habits.css'

export const metadata: Metadata = {
  title: 'Theo Dõi Thói Quen',
  description: 'Theo dõi thói quen, streak và sức khoẻ mỗi ngày.',
}

export default function HabitsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="habits-root flex min-h-dvh flex-col md:flex-row">
      <HabitsHydrator />
      <Sidebar />
      <main className="flex-1 pb-28 md:pb-10">
        <div className="mx-auto w-full max-w-4xl md:px-8 md:py-6">{children}</div>
      </main>
      <BottomNav />
      <AddHabitModal />
    </div>
  )
}
