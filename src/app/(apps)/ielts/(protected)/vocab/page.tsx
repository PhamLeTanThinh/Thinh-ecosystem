import { GlobalVocabView } from '@/components/ielts/GlobalVocabView'
import { IeltsPlainShell } from '@/components/ielts/IeltsShell'

// Kho từ vựng chung, không thuộc kỹ năng nào. (Từ vựng riêng của từng kỹ năng nằm ở /ielts/<skill>/vocab.)
export default function GlobalVocabPage() {
  return (
    <IeltsPlainShell trail={[{ label: 'Từ vựng chung', icon: 'note' }]}>
      <GlobalVocabView />
    </IeltsPlainShell>
  )
}
