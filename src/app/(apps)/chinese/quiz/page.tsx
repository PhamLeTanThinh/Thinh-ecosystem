'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useChineseStore } from '@/lib/chinese/store'
import { shuffle } from '@/lib/chinese/shuffle'
import type { ChineseCard, QuizMode } from '@/lib/chinese/types'

const MIN_CARDS = 4
const OPTION_COUNT = 4
const REQUEUE_MIN_GAP = 2
const REQUEUE_MAX_GAP = 3

type QuizField = 'hanzi' | 'pinyin' | 'meaning'

function promptField(mode: QuizMode): QuizField {
  return mode === 'meaning-to-hanzi' ? 'meaning' : 'hanzi'
}

function answerField(mode: QuizMode): QuizField {
  if (mode === 'hanzi-to-pinyin') return 'pinyin'
  if (mode === 'hanzi-to-meaning') return 'meaning'
  return 'hanzi'
}

// Sau khi trả lời, hiện thêm thông tin còn thiếu (không nằm trong câu hỏi/đáp án) để củng cố ghi nhớ:
// hanzi-to-pinyin thiếu nghĩa, còn lại thiếu pinyin.
function extraInfoField(mode: QuizMode): QuizField {
  return mode === 'hanzi-to-pinyin' ? 'meaning' : 'pinyin'
}

const EXTRA_INFO_LABEL: Record<QuizField, string> = {
  hanzi: 'Chữ Hán',
  pinyin: 'Pinyin',
  meaning: 'Nghĩa',
}

// Chọn 1 đáp án đúng + 3 đáp án nhiễu (ưu tiên giá trị không trùng nhau), rồi xáo vị trí.
function buildOptions(pool: ChineseCard[], correctCard: ChineseCard, field: QuizField): string[] {
  const correctValue = correctCard[field]
  const seenValues = new Set([correctValue])
  const candidates = shuffle(pool.filter((c) => c.id !== correctCard.id))
  const distractors: string[] = []
  for (const c of candidates) {
    if (distractors.length >= OPTION_COUNT - 1) break
    if (seenValues.has(c[field])) continue
    seenValues.add(c[field])
    distractors.push(c[field])
  }
  return shuffle([correctValue, ...distractors])
}

// Trả lời sai: nhét thẻ trở lại hàng đợi sau 2-3 câu nữa thay vì hỏi lại ngay, giống chế độ Học của Quizlet.
function requeue(remaining: string[], cardId: string): string[] {
  const gap = REQUEUE_MIN_GAP + Math.floor(Math.random() * (REQUEUE_MAX_GAP - REQUEUE_MIN_GAP + 1))
  const insertAt = Math.min(gap, remaining.length)
  const next = [...remaining]
  next.splice(insertAt, 0, cardId)
  return next
}

function QuizMessage({ text }: { text: string }) {
  return (
    <div className="py-16 text-center text-sm text-muted">
      <Link href="/chinese" className="text-accent">
        ‹ Quay lại
      </Link>
      <p className="mt-6">{text}</p>
    </div>
  )
}

// useSearchParams() bắt buộc bọc Suspense — nếu không, build production sẽ lỗi
// "Missing Suspense boundary with useSearchParams".
export default function ChineseQuizPage() {
  return (
    <Suspense fallback={<QuizMessage text="Đang tải..." />}>
      <QuizSession />
    </Suspense>
  )
}

function QuizSession() {
  const deckId = useSearchParams().get('deck')

  const hydrated = useChineseStore((s) => s.hydrated)
  const allCards = useChineseStore((s) => s.cards)
  const decks = useChineseStore((s) => s.decks)
  const settings = useChineseStore((s) => s.settings)
  const markResult = useChineseStore((s) => s.markResult)

  const [queue, setQueue] = useState<string[] | null>(null)
  const [totalCards, setTotalCards] = useState(0)
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set())
  const [tally, setTally] = useState({ correct: 0, wrong: 0 })
  const [optionsFor, setOptionsFor] = useState<{ cardId: string; options: string[] } | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  if (!hydrated) return <QuizMessage text="Đang tải..." />

  const deck = deckId ? decks.find((d) => d.id === deckId) : undefined
  if (deckId && !deck) return <QuizMessage text="Không tìm thấy bộ học này." />

  const cards = deck ? allCards.filter((c) => deck.cardIds.includes(c.id)) : allCards

  if (cards.length < MIN_CARDS) {
    return <QuizMessage text={`Cần ít nhất ${MIN_CARDS} từ để làm trắc nghiệm (hiện có ${cards.length}).`} />
  }

  // Khởi tạo hàng đợi câu hỏi ngay khi cards sẵn sàng — cập nhật state trong lúc render (không
  // phải effect) để tránh 1 nhịp render thừa, cùng convention với components/chinese/BottomSheet.tsx.
  if (queue === null) {
    const ids = shuffle(cards.map((c) => c.id))
    setQueue(ids)
    setTotalCards(ids.length)
    return <QuizMessage text="Đang tải..." />
  }

  const field = answerField(settings.quizMode)
  const prompt = promptField(settings.quizMode)

  const finished = queue.length === 0

  if (finished) {
    const totalAttempts = tally.correct + tally.wrong
    const percent = totalAttempts > 0 ? Math.round((tally.correct / totalAttempts) * 100) : 0
    return (
      <div className="flex flex-col items-center gap-5 py-16 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-brand to-brand-strong text-4xl shadow-lg">
          📝
        </span>
        <div>
          <p className="text-xl font-bold">Hoàn thành trắc nghiệm!</p>
          <p className="mt-1 text-sm text-muted">
            {deck ? deck.name : 'Toàn bộ từ vựng'} · {totalCards} từ · {percent}% đúng ngay lần đầu
          </p>
        </div>

        <div className="flex w-full max-w-xs gap-3">
          <div className="flex-1 rounded-card bg-accent-soft p-4">
            <p className="text-2xl font-bold text-accent-strong">{tally.correct}</p>
            <p className="text-xs text-muted">✓ Lượt đúng</p>
          </div>
          <div className="flex-1 rounded-card bg-danger-soft p-4">
            <p className="text-2xl font-bold text-danger">{tally.wrong}</p>
            <p className="text-xs text-muted">✕ Lượt sai</p>
          </div>
        </div>

        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={() => {
              setQueue(shuffle(cards.map((c) => c.id)))
              setMasteredIds(new Set())
              setTally({ correct: 0, wrong: 0 })
              setOptionsFor(null)
              setSelectedAnswer(null)
            }}
            className="rounded-pill bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm"
          >
            🔁 Làm lại
          </button>
          <Link href="/chinese" className="rounded-pill border border-border bg-card px-5 py-3 text-sm font-semibold">
            Quay lại
          </Link>
        </div>
      </div>
    )
  }

  const currentCardId = queue[0]
  const currentCard = cards.find((c) => c.id === currentCardId)
  if (!currentCard) return null

  // Sinh 4 lựa chọn cho câu hỏi hiện tại, chỉ 1 lần cho tới khi chuyển câu tiếp theo.
  if (optionsFor === null || optionsFor.cardId !== currentCardId) {
    setOptionsFor({ cardId: currentCardId, options: buildOptions(cards, currentCard, field) })
    setSelectedAnswer(null)
    return <QuizMessage text="Đang tải..." />
  }

  const isAnswered = selectedAnswer !== null
  const isCorrectAnswer = (option: string) => option === currentCard[field]

  function handleSelect(option: string) {
    if (isAnswered) return
    setSelectedAnswer(option)
    const correct = isCorrectAnswer(option)
    markResult(currentCardId, correct ? 'correct' : 'wrong')
    setTally((t) => (correct ? { ...t, correct: t.correct + 1 } : { ...t, wrong: t.wrong + 1 }))
    if (correct) setMasteredIds((prev) => new Set(prev).add(currentCardId))
  }

  const handleContinue = () => {
    const rest = queue.slice(1)
    const wasCorrect = selectedAnswer !== null && isCorrectAnswer(selectedAnswer)
    setQueue(wasCorrect ? rest : requeue(rest, currentCardId))
  }

  const progressPercent = Math.round((masteredIds.size / totalCards) * 100)
  const infoField = extraInfoField(settings.quizMode)

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full max-w-sm items-center justify-between">
        <Link href="/chinese" className="text-sm font-medium text-accent">
          ‹ Quay lại
        </Link>
        <p className="text-sm font-medium text-muted">
          {deck ? `${deck.name} · ` : ''}
          {masteredIds.size} / {totalCards} thuộc
        </p>
      </div>

      <div className="mt-3 h-1.5 w-full max-w-sm overflow-hidden rounded-pill bg-card-soft">
        <div
          className="h-full rounded-pill bg-linear-to-r from-brand to-brand-strong transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mt-6 w-full max-w-sm rounded-card bg-card p-6 text-center shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {prompt === 'hanzi' ? 'Đây là chữ gì?' : 'Từ này viết bằng chữ Hán nào?'}
        </p>
        <p className={`mt-3 font-bold text-brand-strong ${prompt === 'hanzi' ? 'text-5xl' : 'text-2xl'}`}>
          {currentCard[prompt]}
        </p>
      </div>

      <div className="mt-4 flex w-full max-w-sm flex-col gap-2">
        {optionsFor.options.map((option) => {
          const selected = selectedAnswer === option
          const showAsCorrect = isAnswered && isCorrectAnswer(option)
          const showAsWrong = isAnswered && selected && !isCorrectAnswer(option)
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              disabled={isAnswered}
              className={`rounded-card border-2 p-3.5 text-left font-medium transition-colors ${
                field === 'hanzi' ? 'text-2xl' : 'text-sm'
              } ${
                showAsCorrect
                  ? 'border-accent bg-accent-soft text-accent-strong'
                  : showAsWrong
                    ? 'border-danger bg-danger-soft text-danger'
                    : 'border-transparent bg-card-soft text-text'
              }`}
            >
              {option}
              {showAsCorrect && ' ✓'}
              {showAsWrong && ' ✕'}
            </button>
          )
        })}
      </div>

      {isAnswered && (
        <div className="mt-3 w-full max-w-sm rounded-2xl bg-card-soft px-4 py-3 text-center">
          <p className="text-xs font-semibold text-muted">{EXTRA_INFO_LABEL[infoField]}</p>
          <p className="mt-0.5 text-base font-semibold text-text">{currentCard[infoField]}</p>
        </div>
      )}

      {isAnswered && (
        <button
          type="button"
          onClick={handleContinue}
          className="mt-3 w-full max-w-sm rounded-pill bg-brand py-3.5 text-sm font-semibold text-white shadow-sm"
        >
          Tiếp tục →
        </button>
      )}
    </div>
  )
}
