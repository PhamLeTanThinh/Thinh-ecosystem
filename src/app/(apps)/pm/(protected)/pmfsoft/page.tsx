import { LessonShell } from '@/components/lessons/LessonShell'
import { APP_BRAND } from '@/lib/apps/brand'
import { assertHubAccess } from '@/lib/hub/access'

export default async function PmFsoftPage() {
  await assertHubAccess('pm')
  return (
    <LessonShell
      app="/pm"
      trail={[{ label: 'PM in FSOFT' }]}
      accent={APP_BRAND.pm}
      topicLabel="PM in FSOFT"
      topicIcon="🏢"
      count={10}
      transitionPrefix="pm-pmfsoft"
      levelTransitionName="pm-level-pmfsoft"
    />
  )
}
