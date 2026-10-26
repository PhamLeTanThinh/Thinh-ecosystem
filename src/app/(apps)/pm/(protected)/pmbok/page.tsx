import { ComingSoon } from '@/components/lessons/ComingSoon'
import { APP_BRAND } from '@/lib/apps/brand'
import { assertHubAccess } from '@/lib/hub/access'

export default async function PmbokPage() {
  await assertHubAccess('pm')
  return (
    <ComingSoon app="/pm" trail={[{ label: 'PMBOK' }]} accent={APP_BRAND.pm} title="PMBOK" icon="📘" transitionName="pm-level-pmbok" />
  )
}
