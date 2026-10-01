'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { GrammarHandbook } from '@/components/shared/GrammarHandbook'
import { SegmentedControl } from '@/components/chinese/SegmentedControl'
import { HANDBOOK_CATEGORIES, HANDBOOK_GROUPS, HANDBOOK_ITEMS, handbookKey } from '@/lib/chinese/handbook'
import { HSK_LEVELS, LESSON_META, lessonDisplayNumber, type HskLevel } from '@/lib/chinese/lessons'
import type { HandbookEntry } from '@/lib/handbook/types'
import type { ExampleDetail } from '@/lib/chinese/exampleDetail'
import type { ChineseCard } from '@/lib/chinese/types'

type LevelFilter = 'all' | HskLevel

// Cùng màu với card cấp độ ở màn hình đầu (LEVEL_STYLE trong ChineseApp).
const LEVEL_COLORS: Record<string, string> = { hsk12: '#c92a2a', hsk3: '#e8590c', hsk4: '#2b8a3e', hsk5: '#1864ab', hsk6: '#6741d9' }

interface Props {
  grammarCards: ChineseCard[]
  searchQuery: string
  renderDetail: (card: ChineseCard) => ReactNode
}

// Cẩm nang ngữ pháp Chinese (/chinese/handbook): chuyển thẻ ngữ pháp HSK thành HandbookEntry cho component dùng chung
// components/shared/GrammarHandbook.tsx. Phân loại + điểm phân biệt nằm ở lib/chinese/handbook.ts.
export function Handbook({ grammarCards, searchQuery, renderDetail }: Props) {
  const [level, setLevel] = useState<LevelFilter>('all')

  // Chỉ hiện các cấp độ đã có ngữ pháp trong nút lọc (HSK 5, 6 chưa có bài).
  const levelOptions = useMemo(() => {
    const present = new Set(grammarCards.map((c) => LESSON_META[c.lesson]?.level).filter(Boolean))
    return [{ value: 'all' as LevelFilter, label: 'Tất cả' }, ...HSK_LEVELS.filter((l) => present.has(l.key)).map((l) => ({ value: l.key as LevelFilter, label: l.label }))]
  }, [grammarCards])

  const cardsById = useMemo(() => new Map(grammarCards.map((c) => [c.id, c])), [grammarCards])

  const entries = useMemo<HandbookEntry[]>(() => {
    return grammarCards
      .filter((card) => level === 'all' || LESSON_META[card.lesson]?.level === level)
      .sort((a, b) => a.lesson - b.lesson || a.sortOrder - b.sortOrder)
      .map((card) => {
        const cardLevel = LESSON_META[card.lesson]?.level ?? 'hsk12'
        const levelName = HSK_LEVELS.find((l) => l.key === cardLevel)?.label ?? ''
        const item = HANDBOOK_ITEMS[handbookKey(card.lesson, card.hanzi)]
        const tip = item?.tip ?? card.meaning
        const lessonNo = lessonDisplayNumber(card.lesson)
        return {
          id: card.id,
          front: card.hanzi,
          sub: card.pinyin || undefined,
          cat: item?.cat ?? null,
          tip,
          level: cardLevel,
          badge: `${levelName} · Bài ${lessonNo}`,
          lessonHref: `/chinese/lessons/${card.lesson}?g=${card.id}`,
          lessonLabel: `bài ${lessonNo} (${levelName})`,
          example: firstExample(card),
          searchText: [card.hanzi, card.pinyin, card.meaning, tip, card.theory].join(' ').toLowerCase(),
        }
      })
  }, [grammarCards, level])

  return (
    <div className="cn-content">
      <GrammarHandbook
        eyebrow="学中文 · 语法手册"
        entries={entries}
        groups={HANDBOOK_GROUPS}
        categories={HANDBOOK_CATEGORIES}
        searchQuery={searchQuery}
        levelControl={<SegmentedControl dense options={levelOptions} value={level} onChange={setLevel} />}
        levelColors={LEVEL_COLORS}
        frontLang="zh-CN"
        renderDetail={(id) => {
          const card = cardsById.get(id)
          return card ? renderDetail(card) : null
        }}
      />
    </div>
  )
}

// Câu ví dụ đầu tiên của thẻ (kèm pinyin + nghĩa), hiện ngay trong bảng.
function firstExample(card: ChineseCard): HandbookEntry['example'] {
  try {
    const details: ExampleDetail[] = card.exampleDetail ? JSON.parse(card.exampleDetail) : []
    if (details[0]?.zh) return { text: details[0].zh, pinyin: details[0].pinyin || undefined, vi: details[0].vi }
  } catch {
    // exampleDetail hỏng → dùng dòng đầu của `example`
  }
  const line = card.example.split('\n').find((l) => l.trim())
  return line ? { text: line } : null
}
