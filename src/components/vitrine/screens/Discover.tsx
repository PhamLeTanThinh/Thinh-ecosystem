'use client'

import Link from 'next/link'
import { getScenesByTopicSlug, getSceneBySlug, getSceneProgress, getTopicProgress, getTopics } from '@/lib/vitrine/queries'
import { useVitrineStore } from '@/lib/vitrine/store'
import { FlowLayout, FlowItem } from '../FlowLayout'
import { TopicCluster } from '../TopicCluster'
import { ObjectPreview } from '../ObjectPreview'

// "Tiếp tục học" trỏ tới cảnh được xem gần nhất — chưa có backend theo dõi lịch sử
// xem, nên tạm cố định vào cảnh đầu tiên của chủ đề đầu tiên.
const CONTINUE_TOPIC_SLUG = 'nha-o'
const CONTINUE_SCENE_SLUG = 'phong-khach'

export function DiscoverScreen() {
  const learnedPartIds = useVitrineStore((s) => s.learnedPartIds)
  const topics = getTopics()
  const continueScene = getSceneBySlug(CONTINUE_TOPIC_SLUG, CONTINUE_SCENE_SLUG)
  const continueProgress = continueScene
    ? getSceneProgress(continueScene.id, learnedPartIds)
    : { learned: 0, total: 0, percent: 0 }
  const completedTopics = topics.filter((t) => getTopicProgress(t.slug, learnedPartIds).percent === 100).length

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 64px 96px' }}>
      <div style={{ display: 'flex', gap: 36, alignItems: 'stretch', marginBottom: 64, flexWrap: 'wrap' }}>
        <div
          className="vt-glass-strong"
          style={{
            flex: '1 1 640px',
            borderRadius: 28,
            padding: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          <div style={{ maxWidth: 280 }}>
            <div style={{ fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--color-vt-teal)', fontWeight: 600, marginBottom: 10 }}>
              Tiếp tục học
            </div>
            <div className="vt-font-display" style={{ fontWeight: 600, fontSize: 32, lineHeight: 1.1, marginBottom: 8 }}>
              {continueScene?.name ?? 'Phòng khách'}
            </div>
            <div style={{ fontSize: 14, color: 'var(--color-vt-ink-soft)', marginBottom: 20 }}>
              Nhà ở · {continueProgress.learned}/{continueProgress.total} từ đã học
            </div>
            <div style={{ height: 6, borderRadius: 999, background: 'var(--color-vt-border)', overflow: 'hidden', marginBottom: 22 }}>
              <div style={{ width: `${continueProgress.percent}%`, height: '100%', background: 'var(--color-vt-teal)' }} />
            </div>
            <Link
              href={`/vitrine/topics/${CONTINUE_TOPIC_SLUG}/${CONTINUE_SCENE_SLUG}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'linear-gradient(135deg, var(--color-vt-teal), var(--color-vt-teal-deep))',
                color: '#fff',
                fontSize: 14,
                fontWeight: 500,
                padding: '11px 20px',
                borderRadius: 999,
                textDecoration: 'none',
                boxShadow: '0 10px 28px -8px rgba(13,156,120,.55)',
              }}
            >
              Học tiếp
            </Link>
          </div>
          <ObjectPreview accent="teal" seed={0} size={240} />
        </div>

        <div style={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="vt-glass" style={{ borderRadius: 22, padding: 22 }}>
            <div style={{ fontSize: 12, color: 'var(--color-vt-ink-soft)', marginBottom: 6 }}>Tổng số từ đã học</div>
            <div className="vt-font-display" style={{ fontWeight: 600, fontSize: 30 }}>
              {learnedPartIds.size}
            </div>
          </div>
          <div className="vt-glass" style={{ borderRadius: 22, padding: 22 }}>
            <div style={{ fontSize: 12, color: 'var(--color-vt-ink-soft)', marginBottom: 6 }}>Chủ đề hoàn thành</div>
            <div className="vt-font-display" style={{ fontWeight: 600, fontSize: 30 }}>
              {completedTopics} / {topics.length}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--color-vt-teal)', fontWeight: 600, marginBottom: 8 }}>
          Chủ đề
        </div>
        <div className="vt-font-display" style={{ fontWeight: 600, fontSize: 26 }}>
          Khám phá theo không gian
        </div>
      </div>

      <FlowLayout>
        {topics.map((topic, i) => (
          <FlowItem key={topic.id} id={topic.id} index={i}>
            <TopicCluster topic={topic} sceneCount={getScenesByTopicSlug(topic.slug).length} seed={i} />
          </FlowItem>
        ))}
      </FlowLayout>
    </div>
  )
}
