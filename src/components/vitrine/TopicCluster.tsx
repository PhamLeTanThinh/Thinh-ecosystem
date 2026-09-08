'use client'

import Link from 'next/link'
import type { Topic } from '@/lib/vitrine/types'
import { useFlowTransition } from '@/lib/vitrine/flow-transition'
import { ObjectPreview } from './ObjectPreview'

interface TopicClusterProps {
  topic: Topic
  sceneCount: number
  seed: number
}

export function TopicCluster({ topic, sceneCount, seed }: TopicClusterProps) {
  const { activate } = useFlowTransition()
  const href = `/vitrine/topics/${topic.slug}`

  return (
    <Link
      href={href}
      onClick={(e) => {
        e.preventDefault()
        activate(topic.id, href)
      }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 230, textDecoration: 'none', color: 'inherit' }}
    >
      <ObjectPreview accent={topic.accent} seed={seed} size={210} />
      <div className="vt-font-display" style={{ fontWeight: 600, fontSize: 19, marginTop: 6 }}>
        {topic.name}
      </div>
      <div style={{ fontSize: 12, color: 'var(--color-vt-ink-soft)', marginTop: 2 }}>{sceneCount} không gian</div>
    </Link>
  )
}
