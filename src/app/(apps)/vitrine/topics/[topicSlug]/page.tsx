'use client'

import { use } from 'react'
import { TopicDetailScreen } from '@/components/vitrine/screens/TopicDetail'

export default function TopicPage({ params }: { params: Promise<{ topicSlug: string }> }) {
  const { topicSlug } = use(params)
  return <TopicDetailScreen topicSlug={topicSlug} />
}
