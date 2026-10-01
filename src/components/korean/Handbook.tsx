'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { GrammarHandbook } from '@/components/shared/GrammarHandbook'
import { SegmentedControl } from '@/components/korean/SegmentedControl'
import { HANDBOOK_CATEGORIES, HANDBOOK_GROUPS, HANDBOOK_ITEMS, handbookKey } from '@/lib/korean/handbook'
import { TOPIK_LABEL, lessonDisplayNumber, lessonLevel, type TopikLevel } from '@/lib/korean/lessons'
import type { HandbookEntry } from '@/lib/handbook/types'
import type { ExampleDetail } from '@/lib/korean/exampleDetail'
import type { KoreanCard } from '@/lib/korean/types'

type LevelFilter = 'all' | TopikLevel

const LEVEL_OPTIONS: { value: LevelFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'topik1', label: 'TOPIK I' },
  { value: 'topik2', label: 'TOPIK II' },
]

// Cùng màu với card cấp độ ở màn hình đầu (KoreanApp landingItems).
const LEVEL_COLORS: Record<string, string> = { topik1: '#0c8599', topik2: '#1f4fd6' }

interface Props {
  grammarCards: KoreanCard[]
  searchQuery: string
  renderDetail: (card: KoreanCard) => ReactNode
}

// Cẩm nang ngữ pháp Korean (/korean/handbook): chuyển thẻ ngữ pháp TOPIK I + II thành HandbookEntry cho component dùng
// chung components/shared/GrammarHandbook.tsx. Phân loại + điểm phân biệt nằm ở lib/korean/handbook.ts.
export function Handbook({ grammarCards, searchQuery, renderDetail }: Props) {
  const [level, setLevel] = useState<LevelFilter>('all')

  const cardsById = useMemo(() => new Map(grammarCards.map((c) => [c.id, c])), [grammarCards])

  const entries = useMemo<HandbookEntry[]>(() => {
    return grammarCards
      .filter((card) => level === 'all' || lessonLevel(card.lesson) === level)
      .sort(compareCards)
      .map((card) => {
        const cardLevel = lessonLevel(card.lesson) ?? 'topik2'
        const item = HANDBOOK_ITEMS[handbookKey(card.lesson, card.front)]
        const tip = item?.tip ?? card.meaning
        const lessonNo = lessonDisplayNumber(card.lesson)
        return {
          id: card.id,
          front: card.front,
          cat: item?.cat ?? null,
          tip,
          level: cardLevel,
          badge: `${TOPIK_LABEL[cardLevel]} · ${lessonNo}과`,
          lessonHref: `/korean/lessons/${card.lesson}?g=${card.id}`,
          lessonLabel: `bài ${lessonNo}과`,
          example: firstExample(card),
          searchText: [card.front, card.meaning, tip, card.theory].join(' ').toLowerCase(),
        }
      })
  }, [grammarCards, level])

  return (
    <div className="kr-content">
      <GrammarHandbook
        eyebrow="한국어 공부 · 문법 사전"
        entries={entries}
        groups={HANDBOOK_GROUPS}
        categories={HANDBOOK_CATEGORIES}
        searchQuery={searchQuery}
        levelControl={<SegmentedControl dense options={LEVEL_OPTIONS} value={level} onChange={setLevel} />}
        levelColors={LEVEL_COLORS}
        frontLang="ko"
        renderDetail={(id) => {
          const card = cardsById.get(id)
          return card ? renderDetail(card) : null
        }}
      />
    </div>
  )
}

// Câu ví dụ đầu tiên của thẻ, hiện ngay trong bảng để khỏi phải mở ra mới thấy cách dùng.
function firstExample(card: KoreanCard): HandbookEntry['example'] {
  try {
    const details: ExampleDetail[] = card.exampleDetail ? JSON.parse(card.exampleDetail) : []
    if (details[0]?.ko) return { text: details[0].ko, vi: details[0].vi }
  } catch {
    // exampleDetail hỏng → dùng dòng đầu của `example`
  }
  const line = card.example.split('\n').find((l) => l.trim())
  return line ? { text: line } : null
}

// TOPIK I trước TOPIK II (TOPIK I lưu lesson 101-116 nên không sắp thẳng theo số được), trong cùng cấp theo thứ tự bài.
function compareCards(a: KoreanCard, b: KoreanCard): number {
  const levelRank = (card: KoreanCard) => (lessonLevel(card.lesson) === 'topik1' ? 0 : 1)
  return levelRank(a) - levelRank(b) || a.lesson - b.lesson || a.sortOrder - b.sortOrder
}
