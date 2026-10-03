'use client'

import { useMemo } from 'react'
import { TypingPractice as SharedTypingPractice } from '@/components/shared/typing/TypingPractice'
import type { TypingItem } from '@/components/shared/typing/engine'
import { ZH_TYPING, pinyinTarget } from '@/lib/chinese/pinyinInput'
import { parseParts } from '@/components/shared/vocab/parts'
import type { ChineseCard } from '@/lib/chinese/types'
import type { ExampleDetail } from '@/lib/chinese/exampleDetail'
import { firstDetail } from '@/components/shared/typing/engine'
import type { Dialogue } from '@/lib/chinese/dialogues'

const stripMarks = (s: string) => s.replace(/\[\d:([^\]]+)\]/g, '$1')
// "nǐ hǎo / nín hǎo" → lấy phương án đầu
const firstAlt = (s: string) => s.split(/\s*\/\s*/)[0]

// Luyện gõ tiếng Trung: đề là chữ Hán, người học gõ pinyin không dấu (như bộ gõ pinyin thật). Nguồn: từ vựng và câu
// hội thoại có pinyin — phần Luyện nói của Chinese chưa có dữ liệu (và câu không kèm pinyin) nên để trống.
export function TypingPractice({
  lessonLabel,
  vocabCards,
  dialogues,
  isLearned,
  onClose,
}: {
  lessonLabel: string
  vocabCards: ChineseCard[]
  dialogues?: Dialogue[]
  isLearned: (id: string) => boolean
  onClose: () => void
}) {
  const pools = useMemo(() => {
    const vocabAll: TypingItem[] = vocabCards.map((c) => {
      // "姥爷 / 外公" + "lǎoyé / wàigōng" → chỉ luyện phương án đầu
      const hanzi = firstAlt(c.hanzi)
      const reading = firstAlt(c.pinyin)
      const detail = firstDetail<ExampleDetail>(c.exampleDetail)
      return {
        id: c.id,
        raw: hanzi.replace(/[()（）]/g, ''),
        display: hanzi,
        reading,
        target: pinyinTarget(reading),
        meaning: c.meaning,
        image: c.image || undefined,
        parts: parseParts(c.parts),
        example: c.example.split('\n')[0] || detail?.zh || undefined,
        exampleReading: detail?.pinyin || undefined,
        exampleVi: detail?.vi || undefined,
      }
    })
    const dialogueItems: TypingItem[] = (dialogues ?? [])
      .filter((d) => d.variant !== 'bilingual')
      .flatMap((d, di) =>
        d.lines.flatMap((l, li) => {
          if (!l.py) return []
          const zh = stripMarks(l.zh)
          const reading = stripMarks(l.py)
          return [{ id: `d${di}-${li}`, raw: zh, display: zh, reading, target: pinyinTarget(reading), meaning: l.vi ?? '', label: [d.title, l.who].filter(Boolean).join(' · ') }]
        }),
      )
    return {
      vocab: vocabAll.filter((it) => it.target),
      vocabUnlearned: vocabAll.filter((it) => it.target && !isLearned(it.id)),
      speaking: [],
      dialogue: dialogueItems.filter((it) => it.target),
    }
  }, [vocabCards, dialogues, isLearned])

  return <SharedTypingPractice lessonLabel={lessonLabel} engine={ZH_TYPING} pools={pools} onClose={onClose} />
}
