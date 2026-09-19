import { TopicChoice } from '@/components/lessons/TopicChoice'
import { APP_BRAND } from '@/lib/apps/brand'

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
        { key: 'machinelearning', icon: '📈', label: 'Machine Learning', meta: '10 bài' },
        { key: 'deeplearning', icon: '🧠', label: 'Deep Learning', meta: '10 bài' },
        { key: 'paper', icon: '📄', label: 'Paper Research', meta: '2 paper' },
      ]}
    />
  )
}
