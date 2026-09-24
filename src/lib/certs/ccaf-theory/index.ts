import { DOMAIN_1 } from './domain1'
import { DOMAIN_2 } from './domain2'
import { DOMAIN_3 } from './domain3'
import { DOMAIN_4 } from './domain4'
import { DOMAIN_5 } from './domain5'
import type { TheoryDomain, TheoryTopic } from './types'

export type { TheoryBlock, TheoryDomain, TheoryTopic } from './types'

export const CCAF_DOMAINS: TheoryDomain[] = [DOMAIN_1, DOMAIN_2, DOMAIN_3, DOMAIN_4, DOMAIN_5]

export const CCAF_TOPICS: TheoryTopic[] = CCAF_DOMAINS.flatMap((d) => d.topics)

export function findTopic(id: string): { topic: TheoryTopic; domain: TheoryDomain; prev: TheoryTopic | null; next: TheoryTopic | null } | null {
  const i = CCAF_TOPICS.findIndex((t) => t.id === id)
  if (i < 0) return null
  const topic = CCAF_TOPICS[i]
  const domain = CCAF_DOMAINS.find((d) => d.topics.includes(topic))!
  return { topic, domain, prev: CCAF_TOPICS[i - 1] ?? null, next: CCAF_TOPICS[i + 1] ?? null }
}

// Câu hỏi → các chủ đề lý thuyết liên quan (để hiện link "Xem lý thuyết" sau khi chấm).
export function topicsByQuestion(): Record<number, { id: string; title: string }[]> {
  const map: Record<number, { id: string; title: string }[]> = {}
  for (const t of CCAF_TOPICS) for (const q of t.questionIds) (map[q] ??= []).push({ id: t.id, title: t.title })
  return map
}
