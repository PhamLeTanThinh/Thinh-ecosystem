'use client'

import { use } from 'react'
import { LearningSceneScreen } from '@/components/vitrine/screens/LearningScene'

export default function ScenePage({ params }: { params: Promise<{ topicSlug: string; sceneSlug: string }> }) {
  const { topicSlug, sceneSlug } = use(params)
  // `key` buộc remount toàn bộ màn hình khi đổi cảnh (kể cả điều hướng giữa 2 route
  // [sceneSlug] khác nhau) — nhờ đó state nội bộ như trạng thái tải model tự reset
  // đúng theo vòng đời thay vì phải đồng bộ bằng effect.
  return <LearningSceneScreen key={`${topicSlug}/${sceneSlug}`} topicSlug={topicSlug} sceneSlug={sceneSlug} />
}
