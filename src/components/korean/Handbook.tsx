'use client'

import { useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { HANDBOOK_CATEGORIES, HANDBOOK_MAP, handbookKey, type HandbookCategory } from '@/lib/korean/handbook'
import { TOPIK_LABEL, lessonDisplayNumber, lessonLevel, type TopikLevel } from '@/lib/korean/lessons'
import { SegmentedControl } from '@/components/korean/SegmentedControl'
import type { KoreanCard } from '@/lib/korean/types'

type LevelFilter = 'all' | TopikLevel

const LEVEL_OPTIONS: { value: LevelFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'topik1', label: 'TOPIK I' },
  { value: 'topik2', label: 'TOPIK II' },
]

// Thẻ ngữ pháp mới thêm sau này mà chưa có trong HANDBOOK_MAP vẫn hiện ra ở đây thay vì bị ẩn mất.
const UNCATEGORIZED: HandbookCategory = {
  key: 'uncategorized',
  icon: '🗂️',
  title: 'Chưa phân loại',
  note: 'Mẫu ngữ pháp mới chưa được xếp nhóm trong cẩm nang.',
}

// Nhóm chỉ mang tính liệt kê (không có các mẫu cùng nghĩa để so sánh) — phần note hiện như lời giới thiệu, không phải "cách chọn".
const LIST_ONLY = new Set(['misc', 'basic', UNCATEGORIZED.key])

interface Props {
  grammarCards: KoreanCard[]
  searchQuery: string
  // Phần chi tiết khi mở 1 mẫu (cấu trúc + lý thuyết + ví dụ) — KoreanApp truyền vào để dùng lại đúng cách hiển thị thẻ trong bài.
  renderDetail: (card: KoreanCard) => ReactNode
}

// Cẩm nang ngữ pháp: gom ngữ pháp TOPIK I + II theo nghĩa/chức năng (xem lib/korean/handbook.ts), mỗi nhóm có phần
// "cách chọn nhanh" so sánh các mẫu, bấm 1 mẫu để mở ngay chi tiết tại chỗ hoặc nhảy về đúng thẻ trong bài.
export function Handbook({ grammarCards, searchQuery, renderDetail }: Props) {
  const [level, setLevel] = useState<LevelFilter>('all')
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set())
  const query = searchQuery.trim().toLowerCase()

  const groups = useMemo(() => {
    const byCategory = new Map<string, KoreanCard[]>()
    for (const card of grammarCards) {
      if (level !== 'all' && lessonLevel(card.lesson) !== level) continue
      const key = HANDBOOK_MAP[handbookKey(card.lesson, card.front)] ?? UNCATEGORIZED.key
      const list = byCategory.get(key) ?? []
      list.push(card)
      byCategory.set(key, list)
    }

    return [...HANDBOOK_CATEGORIES, UNCATEGORIZED]
      .map((category) => {
        const cards = (byCategory.get(category.key) ?? []).sort(compareCards)
        if (!query) return { category, cards }
        // Khớp tên/ghi chú của nhóm thì giữ cả nhóm (vd gõ "lý do"), không thì chỉ giữ các mẫu khớp.
        const categoryMatches = category.title.toLowerCase().includes(query) || category.note.toLowerCase().includes(query)
        return {
          category,
          cards: categoryMatches
            ? cards
            : cards.filter((c) => c.front.toLowerCase().includes(query) || c.meaning.toLowerCase().includes(query) || c.theory.toLowerCase().includes(query)),
        }
      })
      .filter((group) => group.cards.length > 0)
  }, [grammarCards, level, query])

  const shownCount = groups.reduce((sum, g) => sum + g.cards.length, 0)

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="kr-content kr-hb">
      <div className="kr-content-header">
        <div>
          <p className="kr-eyebrow">한국어 공부 · 문법 사전</p>
          <h1 className="kr-page-title">Cẩm nang ngữ pháp</h1>
          <p className="kr-page-title-vi">Ngữ pháp TOPIK I + II gom theo nghĩa. Bấm vào một mẫu để xem cách dùng và ví dụ ngay tại đây.</p>
        </div>
      </div>

      <div className="kr-hb-toolbar">
        <SegmentedControl dense options={LEVEL_OPTIONS} value={level} onChange={setLevel} />
        <p className="kr-section-meta">
          {shownCount} mẫu · {groups.length} nhóm
          {query ? ` · khớp "${searchQuery.trim()}"` : ''}
        </p>
      </div>

      {groups.length === 0 ? (
        <p className="kr-glass py-10 text-center text-sm text-muted">
          {grammarCards.length === 0 ? 'Chưa có ngữ pháp nào.' : 'Không có mẫu ngữ pháp nào khớp.'}
        </p>
      ) : (
        <>
          <nav className="kr-hb-index" aria-label="Các nhóm ngữ pháp">
            {groups.map(({ category, cards }) => (
              <button
                key={category.key}
                type="button"
                className="kr-hb-chip"
                onClick={() => document.getElementById(`kr-hb-${category.key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                <span aria-hidden>{category.icon}</span> {category.title}
                <span className="kr-hb-chip-count">{cards.length}</span>
              </button>
            ))}
          </nav>

          {groups.map(({ category, cards }) => (
            <section key={category.key} id={`kr-hb-${category.key}`} className="kr-hb-section">
              <h2 className="kr-section-title">
                <span aria-hidden>{category.icon}</span> {category.title} <span className="kr-section-count">{cards.length}</span>
              </h2>

              <div className={`kr-hb-tip${LIST_ONLY.has(category.key) ? ' kr-hb-tip--plain' : ''}`}>
                {!LIST_ONLY.has(category.key) && <p className="kr-hb-tip-label">💡 Cách chọn nhanh</p>}
                {category.note.split('\n\n').map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="kr-hb-list">
                {cards.map((card) => {
                  const cardLevel = lessonLevel(card.lesson) ?? 'topik2'
                  const open = openIds.has(card.id)
                  return (
                    <div key={card.id} className={`kr-glass kr-hb-item${open ? ' open' : ''}`}>
                      <button type="button" className="kr-hb-item-head" aria-expanded={open} onClick={() => toggle(card.id)}>
                        <span className="kr-hb-item-main">
                          <span className="kr-hb-item-front">{card.front}</span>
                          <span className="kr-hb-item-meaning">{card.meaning}</span>
                        </span>
                        <span className={`kr-hb-level kr-hb-level--${cardLevel}`}>
                          {TOPIK_LABEL[cardLevel]} · {lessonDisplayNumber(card.lesson)}과
                        </span>
                        <span className="kr-hb-chevron" aria-hidden>
                          ▾
                        </span>
                      </button>
                      {open && (
                        <div className="kr-hb-item-body">
                          {renderDetail(card)}
                          <Link href={`/korean/lessons/${card.lesson}?g=${card.id}`} className="kr-hb-open-lesson">
                            Mở trong bài {lessonDisplayNumber(card.lesson)}과 →
                          </Link>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  )
}

// TOPIK I trước TOPIK II (TOPIK I lưu lesson 101-116 nên không sắp thẳng theo số được), trong cùng cấp theo thứ tự bài.
function compareCards(a: KoreanCard, b: KoreanCard): number {
  const levelRank = (card: KoreanCard) => (lessonLevel(card.lesson) === 'topik1' ? 0 : 1)
  return levelRank(a) - levelRank(b) || a.lesson - b.lesson || a.sortOrder - b.sortOrder
}
