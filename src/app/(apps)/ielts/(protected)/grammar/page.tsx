import { assertIeltsAccess } from '@/lib/ielts/access'
import { IeltsPlainShell } from '@/components/ielts/IeltsShell'
import { GrammarIndex } from '@/components/ielts/grammar/GrammarIndex'

export const metadata = { title: 'Ngữ pháp cơ bản — IELTS' }

// Ngữ pháp cơ bản — 45 bài chia nhóm + Cẩm nang chung (không thuộc kỹ năng nào, giống Học qua phim).
export default async function GrammarIndexPage() {
  await assertIeltsAccess()
  return (
    <IeltsPlainShell trail={[{ label: 'Ngữ pháp cơ bản' }]}>
      <GrammarIndex />
    </IeltsPlainShell>
  )
}
