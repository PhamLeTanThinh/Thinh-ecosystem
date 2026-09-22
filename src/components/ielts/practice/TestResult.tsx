'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { flatQuestions, isCorrect, loadAttempts, questionTypeLabel, type AttemptRecord, type PracticeTest, type QuestionType } from '@/lib/ielts/practice'

type Status = 'correct' | 'wrong' | 'missed'

// Lời nhắn theo tỉ lệ đúng.
function messageFor(correct: number, total: number): string {
  if (total === 0) return 'Chưa có câu hỏi nào để chấm.'
  if (correct === 0) return 'Oops! Bạn chưa làm đúng câu nào, cố gắng lần sau nha.'
  if (correct === total) return 'Xuất sắc! Bạn đã làm đúng tất cả các câu.'
  const r = correct / total
  if (r < 0.4) return `Cố lên! Bạn đúng ${correct}/${total} câu, xem giải thích để tiến bộ hơn nhé.`
  if (r < 0.7) return `Khá tốt! Bạn đúng ${correct}/${total} câu, ôn lại các câu sai để cải thiện nhé.`
  return `Tuyệt vời! Bạn đúng ${correct}/${total} câu, chỉ còn một chút nữa là hoàn hảo.`
}

// Màu vòng điểm theo tỉ lệ: thấp cam, trung bình xanh dương, cao xanh lá.
function toneFor(correct: number, total: number): string {
  const r = total > 0 ? correct / total : 0
  return r < 0.4 ? '#f59e0b' : r < 0.7 ? '#2b7be6' : '#2f9e57'
}

// Màn kết quả sau khi nộp (/ielts/<skill>/practice/<id>/result): tổng điểm, thống kê theo dạng câu hỏi và
// Answer key của LẦN NỘP GẦN NHẤT (lấy từ lịch sử trong localStorage). Nhận cả đề (có đáp án) nên chỉ được
// render sau assertIeltsAccess ở page.
export function TestResult({ test }: { test: PracticeTest }) {
  const [rec, setRec] = useState<AttemptRecord | null | undefined>(undefined) // undefined = chưa đọc
  const questions = useMemo(() => flatQuestions(test), [test])
  const base = `/ielts/${test.skill}/practice/${test.id}`

  useEffect(() => {
    const history = loadAttempts()[test.id]?.history
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRec(history && history.length > 0 ? history[history.length - 1] : null)
  }, [test.id])

  const rows = useMemo(
    () =>
      questions.map((q, i) => {
        const given = rec?.answers[q.id]
        const status: Status = !given?.trim() ? 'missed' : isCorrect(q, given) ? 'correct' : 'wrong'
        return { q, num: i + 1, given, status }
      }),
    [questions, rec],
  )

  if (rec === undefined) return <main className="ih-res" />

  if (rec === null) {
    return (
      <main className="ih-res">
        <div className="ih-res-wrap">
          <div className="ih-res-card">
            <h1 className="ih-res-msg">Chưa có kết quả cho đề này</h1>
            <p className="ih-res-sub">Hãy làm và nộp bài để xem kết quả.</p>
            <div className="ih-res-actions">
              <Link href={base} className="ih-res-btn primary">
                Làm bài
              </Link>
              <Link href={`/ielts/${test.skill}/practice`} className="ih-res-btn">
                Về danh sách đề
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const total = rows.length
  const correct = rows.filter((r) => r.status === 'correct').length
  const wrong = rows.filter((r) => r.status === 'wrong').length
  const missed = total - correct - wrong
  const tone = toneFor(correct, total)
  const R = 46
  const C = 2 * Math.PI * R

  // Thống kê theo dạng câu hỏi (giữ thứ tự xuất hiện trong đề).
  const byType = new Map<QuestionType, { total: number; correct: number; wrong: number; missed: number }>()
  for (const r of rows) {
    const t = byType.get(r.q.type) ?? { total: 0, correct: 0, wrong: 0, missed: 0 }
    t.total += 1
    t[r.status] += 1
    byType.set(r.q.type, t)
  }

  return (
    <main className="ih-res">
      <div className="ih-res-wrap">
        <Link href={`/ielts/${test.skill}/practice`} className="ih-pr-back">
          ← Danh sách đề
        </Link>

        <section className="ih-res-card ih-res-hero">
          <div className="ih-res-hero-main">
            <p className="ih-res-meta">
              {test.title} · {rec.mode === 'real' ? 'Thi thật' : 'Luyện tập'} · {new Date(rec.at).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
            <h1 className="ih-res-msg">{messageFor(correct, total)}</h1>

            <div className="ih-res-scorerow">
              <div className="ih-res-ring" style={{ color: tone, '--tone': tone } as React.CSSProperties} role="img" aria-label={`Điểm ${correct} trên ${total}`}>
                <svg viewBox="0 0 110 110" width="150" height="150" aria-hidden="true">
                  <circle cx="55" cy="55" r={R} fill="none" stroke="currentColor" strokeOpacity="0.16" strokeWidth="10" />
                  <circle
                    cx="55"
                    cy="55"
                    r={R}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${total > 0 ? (correct / total) * C : 0} ${C}`}
                    transform="rotate(-90 55 55)"
                  />
                </svg>
                <span className="ih-res-ring-num">
                  {correct}/{total}
                </span>
                <span className="ih-res-ring-badge" aria-hidden>
                  ✓
                </span>
              </div>

              <dl className="ih-res-stats">
                <div>
                  <dt>Đúng:</dt>
                  <dd className="ok">{correct}</dd>
                </div>
                <div>
                  <dt>Sai:</dt>
                  <dd className="bad">{wrong}</dd>
                </div>
                <div>
                  <dt>Bỏ qua:</dt>
                  <dd className="skip">{missed}</dd>
                </div>
              </dl>
            </div>

            <div className="ih-res-actions">
              <Link href={`${base}/review`} className="ih-res-btn primary">
                Xem giải thích
              </Link>
              <Link href={base} className="ih-res-btn">
                Làm lại
              </Link>
              <Link href={`/ielts/${test.skill}/vocab/${test.id}`} className="ih-res-btn">
                Học Vocab set
              </Link>
            </div>
          </div>
          <Image src="/ielts/images/cat.png" alt="" width={260} height={260} className="ih-res-cat" />
        </section>

        <section className="ih-res-card">
          <h2 className="ih-res-h2">Bảng thống kê</h2>
          <div className="ih-res-tablewrap">
            <table className="ih-res-table">
              <thead>
                <tr>
                  <th>Loại</th>
                  <th>Số câu</th>
                  <th>Đúng</th>
                  <th>Sai</th>
                  <th>Bỏ qua</th>
                </tr>
              </thead>
              <tbody>
                {[...byType.entries()].map(([type, s]) => (
                  <tr key={type}>
                    <td className="type">{questionTypeLabel(type)}</td>
                    <td className="total">{s.total}</td>
                    <td>
                      <span className="ih-res-badge ok">{s.correct}</span>
                    </td>
                    <td>
                      <span className="ih-res-badge bad">{s.wrong}</span>
                    </td>
                    <td>
                      <span className="ih-res-badge skip">{s.missed}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="ih-res-card">
          <h2 className="ih-res-h2">Answer key</h2>
          <div className="ih-res-key" style={{ gridTemplateRows: `repeat(${Math.ceil(total / 2)}, auto)` }}>
            {rows.map((r) => (
              <div key={r.q.id} className={`ih-res-key-item ${r.status}`}>
                <span className="ih-res-key-num">{r.num}</span>
                <span className="ih-res-key-status">{r.status === 'correct' ? 'Correct' : r.status === 'wrong' ? `Sai: ${r.given}` : 'Missed'}</span>
                <span className="ih-res-key-answer">{r.q.answer}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
