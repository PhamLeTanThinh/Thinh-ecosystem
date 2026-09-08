'use client'

import Link from 'next/link'
import type { AccentColor, Scene } from '@/lib/vitrine/types'
import type { ProgressStat } from '@/lib/vitrine/queries'
import { useFlowTransition } from '@/lib/vitrine/flow-transition'
import { ObjectPreview } from './ObjectPreview'

interface SceneCardProps {
  scene: Scene
  topicSlug: string
  accent: AccentColor
  progress: ProgressStat
  seed: number
}

export function SceneCard({ scene, topicSlug, accent, progress, seed }: SceneCardProps) {
  const { activate } = useFlowTransition()
  const href = `/vitrine/topics/${topicSlug}/${scene.slug}`

  return (
    <Link
      href={href}
      onClick={(e) => {
        e.preventDefault()
        activate(scene.id, href)
      }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 280, textDecoration: 'none', color: 'inherit' }}
    >
      <ObjectPreview accent={accent} seed={seed} size={280} />
      <div className="vt-font-display" style={{ fontWeight: 600, fontSize: 21, marginTop: 8 }}>
        {scene.name}
      </div>
      <div style={{ fontSize: 13, color: 'var(--color-vt-ink-soft)', marginTop: 2 }}>
        {progress.learned}/{progress.total} từ
      </div>
    </Link>
  )
}
