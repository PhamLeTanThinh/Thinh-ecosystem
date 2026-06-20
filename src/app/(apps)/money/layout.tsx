import type { Metadata } from 'next'
import { BottomNav } from '@/components/money/BottomNav'
import { MoneyHydrator } from '@/components/money/MoneyHydrator'
import { Sidebar } from '@/components/money/Sidebar'
import { AddBudgetModal } from '@/components/money/modals/AddBudgetModal'
import { AddDebtModal } from '@/components/money/modals/AddDebtModal'
import { AddTransactionModal } from '@/components/money/modals/AddTransactionModal'
import { WalletPickerModal } from '@/components/money/modals/WalletPickerModal'
import './money.css'

export const metadata: Metadata = {
  title: 'Quản lý Thu Chi',
  description: 'Theo dõi thu chi cá nhân theo ví, theo tháng.',
}

export default function MoneyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="money-root flex min-h-dvh flex-col md:flex-row">
      <MoneyHydrator />
      <Sidebar />
      <main className="flex-1 pb-28 md:pb-10">
        <div className="mx-auto w-full max-w-4xl md:px-8 md:py-6">{children}</div>
      </main>
      <BottomNav />
      <AddTransactionModal />
      <AddBudgetModal />
      <AddDebtModal />
      <WalletPickerModal />
    </div>
  )
}
