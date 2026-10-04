import { LessonShell } from '@/components/lessons/LessonShell'
import { APP_BRAND } from '@/lib/apps/brand'
import { getMlLessonList, ML_BASE_PATH, ML_GROUPS } from '@/lib/it/machineLearning'

// Lưới các bài — mỗi bài có URL riêng ở ./[lesson]
export default function MachineLearningPage() {
  const lessonList = getMlLessonList()
  return (
    <LessonShell
      app="/it"
      trail={[{ label: 'Master AI', href: '/it/master-ai' }, { label: 'Machine Learning' }]}
      accent={APP_BRAND.it}
      topicLabel="Machine Learning"
      topicIcon="📈"
      count={lessonList.length}
      basePath={ML_BASE_PATH}
      lessonList={lessonList}
      groups={ML_GROUPS}
      transitionPrefix="it-ml"
      levelTransitionName="it-ma-level-machinelearning"
    />
  )
}
