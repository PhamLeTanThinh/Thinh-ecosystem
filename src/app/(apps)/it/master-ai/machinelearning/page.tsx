import { LessonShell } from '@/components/lessons/LessonShell'
import { APP_BRAND } from '@/lib/apps/brand'

export default function MachineLearningPage() {
  return (
    <LessonShell
      app="/it"
      trail={[{ label: 'Master AI', href: '/it/master-ai' }, { label: 'Machine Learning' }]}
      accent={APP_BRAND.it}
      topicLabel="Machine Learning"
      topicIcon="📈"
      count={10}
      transitionPrefix="it-ml"
      levelTransitionName="it-ma-level-machinelearning"
    />
  )
}
