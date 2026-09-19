import { TopicChoice } from '@/components/lessons/TopicChoice'
import { APP_BRAND } from '@/lib/apps/brand'

export default function PmPage() {
  return (
    <TopicChoice
      app="/pm"
      accent={APP_BRAND.pm}
      title="Project Manager"
      subtitle="Chọn một chủ đề để bắt đầu ôn tập."
      basePath="/pm"
      transitionPrefix="pm"
      items={[
        { key: 'pmfsoft', icon: '🏢', label: 'PM in FSOFT', meta: '10 bài' },
        { key: 'pmbok', icon: '📘', label: 'PMBOK', meta: 'Sắp ra mắt', muted: true },
      ]}
    />
  )
}
