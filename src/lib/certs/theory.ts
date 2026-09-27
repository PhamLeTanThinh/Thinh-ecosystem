import type { TheoryDomain, TheoryTopic } from './ccaf-theory/types'

// Hàm dùng chung cho phần lý thuyết của mọi chứng chỉ (CCAF ở ccaf-theory/, các cert khác khai báo `theory`
// trong catalog.ts) — cùng cấu trúc domain → topic, chỉ khác bộ dữ liệu truyền vào.

export function findTopicIn(
  domains: TheoryDomain[],
  id: string,
): { topic: TheoryTopic; domain: TheoryDomain; prev: TheoryTopic | null; next: TheoryTopic | null } | null {
  const topics = domains.flatMap((d) => d.topics)
  const i = topics.findIndex((t) => t.id === id)
  if (i < 0) return null
  const topic = topics[i]
  const domain = domains.find((d) => d.topics.includes(topic))!
  return { topic, domain, prev: topics[i - 1] ?? null, next: topics[i + 1] ?? null }
}

// Câu hỏi → các chủ đề lý thuyết liên quan (để hiện link "Xem lý thuyết" sau khi chấm).
export function topicsByQuestionIn(domains: TheoryDomain[]): Record<number, { id: string; title: string }[]> {
  const map: Record<number, { id: string; title: string }[]> = {}
  for (const t of domains.flatMap((d) => d.topics)) for (const q of t.questionIds) (map[q] ??= []).push({ id: t.id, title: t.title })
  return map
}
