'use client'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSceneProgress, getScenesByTopicSlug, getTopicBySlug, getTopicProgress } from '@/lib/vitrine/queries'
import { useVitrineStore } from '@/lib/vitrine/store'
import { FlowLayout, FlowItem } from '../FlowLayout'
import { SceneCard } from '../SceneCard'

interface TopicDetailProps {
  topicSlug: string
}

export function TopicDetailScreen({ topicSlug }: TopicDetailProps) {
  const learnedPartIds = useVitrineStore((s) => s.learnedPartIds)
  const topic = getTopicBySlug(topicSlug)
  const scenes = topic ? getScenesByTopicSlug(topicSlug) : []
  const topicProgress = topic ? getTopicProgress(topicSlug, learnedPartIds) : { learned: 0, total: 0, percent: 0 }

  if (!topic) notFound()

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 64px 96px' }}>
      <Link
        href="/vitrine"
        className="vt-glass-soft"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: 'var(--color-vt-ink-soft)',
          fontSize: 13,
          marginBottom: 32,
          textDecoration: 'none',
          width: 'fit-content',
          padding: '8px 16px 8px 12px',
          borderRadius: 999,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Chủ đề</span>
      </Link>

      <div className="vt-font-display" style={{ fontWeight: 600, fontSize: 44, letterSpacing: '-0.01em', marginBottom: 10 }}>
        {topic.name}
      </div>
      <div style={{ fontSize: 15, color: 'var(--color-vt-ink-soft)', marginBottom: 64 }}>
        {scenes.length} không gian để khám phá · {topicProgress.learned}/{topicProgress.total} từ đã học
      </div>

      <FlowLayout>
        {scenes.map((scene, i) => (
          <FlowItem key={scene.id} id={scene.id} index={i}>
            <SceneCard scene={scene} topicSlug={topic.slug} accent={topic.accent} progress={getSceneProgress(scene.id, learnedPartIds)} seed={i} />
          </FlowItem>
        ))}
      </FlowLayout>
    </div>
  )
}
