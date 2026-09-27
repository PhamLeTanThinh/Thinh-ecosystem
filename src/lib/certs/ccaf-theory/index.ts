import { findTopicIn, topicsByQuestionIn } from '../theory'
import { DOMAIN_1 } from './domain1'
import { DOMAIN_2 } from './domain2'
import { DOMAIN_3 } from './domain3'
import { DOMAIN_4 } from './domain4'
import { DOMAIN_5 } from './domain5'
import type { TheoryDomain, TheoryTopic } from './types'

export type { TheoryBlock, TheoryDomain, TheoryTopic } from './types'

export const CCAF_DOMAINS: TheoryDomain[] = [DOMAIN_1, DOMAIN_2, DOMAIN_3, DOMAIN_4, DOMAIN_5]

export const CCAF_TOPICS: TheoryTopic[] = CCAF_DOMAINS.flatMap((d) => d.topics)

export function findTopic(id: string) {
  return findTopicIn(CCAF_DOMAINS, id)
}

// Câu hỏi → các chủ đề lý thuyết liên quan (để hiện link "Xem lý thuyết" sau khi chấm).
export function topicsByQuestion() {
  return topicsByQuestionIn(CCAF_DOMAINS)
}
