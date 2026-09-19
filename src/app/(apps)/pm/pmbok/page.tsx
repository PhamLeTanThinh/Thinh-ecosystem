import { ComingSoon } from '@/components/lessons/ComingSoon'
import { APP_BRAND } from '@/lib/apps/brand'

export default function PmbokPage() {
  return (
    <ComingSoon app="/pm" trail={[{ label: 'PMBOK' }]} accent={APP_BRAND.pm} title="PMBOK" icon="📘" transitionName="pm-level-pmbok" />
  )
}
