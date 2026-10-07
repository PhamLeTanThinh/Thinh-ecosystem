import { assertIeltsAccess } from '@/lib/ielts/access'
import { IeltsPlainShell } from '@/components/ielts/IeltsShell'
import { GrammarHandbook } from '@/components/ielts/grammar/GrammarHandbook'

export const metadata = { title: 'Cẩm nang ngữ pháp — IELTS' }

// Cẩm nang chung: thuật ngữ, bảng các thì, quy tắc "sau từ này dùng gì", cặp dễ nhầm, động từ bất quy tắc, 50 câu ôn tập.
export default async function GrammarHandbookPage() {
  await assertIeltsAccess()
  return (
    <IeltsPlainShell trail={[{ label: 'Ngữ pháp cơ bản', href: '/ielts/grammar' }, { label: 'Cẩm nang chung' }]}>
      <GrammarHandbook />
    </IeltsPlainShell>
  )
}
