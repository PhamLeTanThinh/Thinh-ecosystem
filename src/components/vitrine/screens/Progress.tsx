'use client'

import { getOverallProgress, getScenesByTopicSlug, getTopicProgress, getTopics } from '@/lib/vitrine/queries'
import { useVitrineStore } from '@/lib/vitrine/store'

const ACCENT_VAR: Record<string, string> = {
  teal: 'var(--color-vt-teal)',
  brass: 'var(--color-vt-brass)',
  plum: 'var(--color-vt-plum)',
}

export function ProgressScreen() {
  const learnedPartIds = useVitrineStore((s) => s.learnedPartIds)
  const streakDays = useVitrineStore((s) => s.streakDays)
  const topics = getTopics()
  const overall = getOverallProgress(learnedPartIds)

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '20px 64px 96px' }}>

      <div className="vt-font-display" style={{ fontWeight: 600, fontSize: 34, marginBottom: 8 }}>
        Tiến trình học tập
      </div>
      <div style={{ fontSize: 15, color: 'var(--color-vt-ink-soft)', marginBottom: 40 }}>
        Theo dõi số từ đã học và mức hoàn thành theo từng chủ đề.
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 48, flexWrap: 'wrap' }}>
        <div className="vt-glass" style={{ flex: '1 1 220px', borderRadius: 22, padding: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--color-vt-ink-soft)', marginBottom: 6 }}>Chuỗi ngày học</div>
          <div className="vt-font-display" style={{ fontWeight: 600, fontSize: 32 }}>
            {streakDays} ngày
          </div>
        </div>
        <div className="vt-glass" style={{ flex: '1 1 220px', borderRadius: 22, padding: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--color-vt-ink-soft)', marginBottom: 6 }}>Từ đã học</div>
          <div className="vt-font-display" style={{ fontWeight: 600, fontSize: 32 }}>
            {overall.learned} / {overall.total}
          </div>
        </div>
        <div className="vt-glass" style={{ flex: '1 1 220px', borderRadius: 22, padding: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--color-vt-ink-soft)', marginBottom: 6 }}>Hoàn thành chung</div>
          <div className="vt-font-display" style={{ fontWeight: 600, fontSize: 32 }}>
            {overall.percent}%
          </div>
        </div>
      </div>

      <div style={{ fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--color-vt-teal)', fontWeight: 600, marginBottom: 16 }}>
        Theo chủ đề
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {topics.map((topic) => {
          const progress = getTopicProgress(topic.slug, learnedPartIds)
          const sceneCount = getScenesByTopicSlug(topic.slug).length
          return (
            <div key={topic.id} className="vt-glass" style={{ borderRadius: 18, padding: '18px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
                <div className="vt-font-display" style={{ fontWeight: 600, fontSize: 18 }}>
                  {topic.name}
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-vt-ink-soft)' }}>
                  {progress.learned}/{progress.total} từ · {sceneCount} không gian
                </div>
              </div>
              <div style={{ height: 6, borderRadius: 999, background: 'var(--color-vt-border)', overflow: 'hidden' }}>
                <div style={{ width: `${progress.percent}%`, height: '100%', background: ACCENT_VAR[topic.accent] }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
