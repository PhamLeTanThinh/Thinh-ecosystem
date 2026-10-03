'use client'

import { useMemo } from 'react'
import { TypingPractice as SharedTypingPractice } from '@/components/shared/typing/TypingPractice'
import type { TypingItem } from '@/components/shared/typing/engine'
import { KO_TYPING, typingTarget } from '@/lib/korean/hangulInput'
import { parseParts } from '@/components/shared/vocab/parts'
import type { KoreanCard } from '@/lib/korean/types'
import type { ExampleDetail } from '@/lib/korean/exampleDetail'
import { firstDetail } from '@/components/shared/typing/engine'
import type { SpeakingPracticeSet } from '@/lib/korean/speakingPractice'
import type { Dialogue } from '@/lib/chinese/dialogues'

// Luyện gõ tiếng Hàn: dựng danh sách mục (từ vựng / luyện nói / hội thoại) rồi dùng màn luyện gõ chung với bộ gõ 2-beolsik
export function TypingPractice({
  lessonLabel,
  vocabCards,
  speaking,
  dialogues,
  isLearned,
  onClose,
}: {
  lessonLabel: string
  vocabCards: KoreanCard[]
  speaking?: SpeakingPracticeSet
  dialogues?: Dialogue[]
  isLearned: (id: string) => boolean
  onClose: () => void
}) {
  const pools = useMemo(() => {
    const vocabAll: TypingItem[] = vocabCards.map((c) => {
      const detail = firstDetail<ExampleDetail>(c.exampleDetail)
      return {
        id: c.id,
        raw: c.front,
        target: typingTarget(c.front),
        meaning: c.meaning,
        meaningEn: c.note || undefined, // note của thẻ vocab = nghĩa tiếng Anh
        image: c.image || undefined,
        parts: parseParts(c.parts),
        example: c.example.split('\n')[0] || detail?.ko || undefined,
        exampleVi: detail?.vi || undefined,
      }
    })
    const speakingItems: TypingItem[] = (speaking?.items ?? []).flatMap((it, i) => [
      { id: `q${i}`, raw: it.question, target: typingTarget(it.question), meaning: it.questionVi, label: `Câu ${i + 1} · Hỏi` },
      { id: `a${i}`, raw: it.answer, target: typingTarget(it.answer), meaning: it.answerVi, label: `Câu ${i + 1} · Đáp` },
    ])
    const dialogueItems: TypingItem[] = (dialogues ?? []).flatMap((d, di) =>
      d.lines.map((l, li) => ({
        id: `d${di}-${li}`,
        raw: l.zh.replace(/\[\d:([^\]]+)\]/g, '$1'),
        target: typingTarget(l.zh),
        meaning: l.vi ?? '',
        label: [d.title, l.who].filter(Boolean).join(' · '),
      })),
    )
    return {
      vocab: vocabAll.filter((it) => it.target),
      vocabUnlearned: vocabAll.filter((it) => it.target && !isLearned(it.id)),
      speaking: speakingItems.filter((it) => it.target),
      dialogue: dialogueItems.filter((it) => it.target),
    }
  }, [vocabCards, speaking, dialogues, isLearned])

  return <SharedTypingPractice lessonLabel={lessonLabel} engine={KO_TYPING} pools={pools} onClose={onClose} />
}
