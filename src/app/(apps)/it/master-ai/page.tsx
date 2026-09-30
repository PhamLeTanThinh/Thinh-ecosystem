import { TopicChoice } from '@/components/lessons/TopicChoice'
import { APP_BRAND } from '@/lib/apps/brand'
import { RESEARCH_PAPERS } from '@/lib/it/papers'

export default function MasterAiPage() {
  return (
    <TopicChoice
      app="/it"
      trail={[{ label: 'Master AI' }]}
      accent={APP_BRAND.it}
      title="Master AI"
      subtitle="Chọn một chủ đề để bắt đầu ôn tập."
      basePath="/it/master-ai"
      transitionPrefix="it-ma"
      incomingIcon="🤖"
      incomingTransitionName="it-level-master-ai"
      items={[
        { key: 'machinelearning', icon: '📈', label: 'Machine Learning', meta: '10 bài', accent: '#2b8a3e', glyph: 'ML', desc: 'Hồi quy · Phân loại · Phân cụm' },
        { key: 'deeplearning', icon: '🧠', label: 'Deep Learning', meta: '10 bài', accent: '#6741d9', glyph: 'DL', desc: 'Mạng nơ-ron · CNN · Transformer' },
        { key: 'paper', icon: '📄', label: 'Paper Research', meta: `${RESEARCH_PAPERS.length} paper`, accent: '#c2410c', glyph: '¶', desc: 'Đọc hiểu bài báo khoa học' },
      ]}
    />
  )
}
