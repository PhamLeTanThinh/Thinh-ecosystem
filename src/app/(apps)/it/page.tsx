import { TopicChoice } from '@/components/lessons/TopicChoice'
import { APP_BRAND } from '@/lib/apps/brand'

export default function ItPage() {
  return (
    <TopicChoice
      app="/it"
      accent={APP_BRAND.it}
      title="IT Hub"
      subtitle="Chọn một mục để bắt đầu ôn tập."
      basePath="/it"
      transitionPrefix="it"
      items={[
        { key: 'master-ai', icon: '🤖', label: 'Master AI', meta: 'ML · DL · Paper' },
        { key: 'software-engineer', icon: '💻', label: 'Software Engineer', meta: 'Ôn kiến thức lập trình' },
      ]}
    />
  )
}
