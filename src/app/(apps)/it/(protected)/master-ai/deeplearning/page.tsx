import { LessonShell } from '@/components/lessons/LessonShell'
import { APP_BRAND } from '@/lib/apps/brand'
import { assertHubAccess } from '@/lib/hub/access'

export default async function DeepLearningPage() {
  await assertHubAccess('it')
  return (
    <LessonShell
      app="/it"
      trail={[{ label: 'Master AI', href: '/it/master-ai' }, { label: 'Deep Learning' }]}
      accent={APP_BRAND.it}
      topicLabel="Deep Learning"
      topicIcon="🧠"
      count={10}
      transitionPrefix="it-dl"
      levelTransitionName="it-ma-level-deeplearning"
    />
  )
}
