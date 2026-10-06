import { IeltsPlainShell } from '@/components/ielts/IeltsShell'
import { TvIndex } from '@/components/ielts/tv/TvIndex'

// Học qua phim — danh sách tập phim (không thuộc kỹ năng nào, giống Từ vựng chung).
export default function TvIndexPage() {
  return (
    <IeltsPlainShell trail={[{ label: 'Học qua phim' }]}>
      <TvIndex />
    </IeltsPlainShell>
  )
}
