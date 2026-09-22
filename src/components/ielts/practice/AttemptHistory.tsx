'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { loadAttempts, type AttemptRecord } from '@/lib/ielts/practice'
import type { Skill } from '@/lib/ielts/types'

interface Props {
  skill: Skill
  testId: string
  title: string
}

// Lịch sử các lần nộp của 1 đề (mới nhất trước). Lịch sử nằm ở localStorage nên chỉ đọc được ở client.
export function AttemptHistory({ skill, testId, title }: Props) {
  const [records, setRecords] = useState<AttemptRecord[] | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecords([...(loadAttempts()[testId]?.history ?? [])].reverse())
  }, [testId])

  const base = `/ielts/${skill}/practice/${testId}`

  return (
    <div className="ih-pr ih-pr-choose">
      <Link href={`/ielts/${skill}/practice`} className="ih-pr-back">
        ← Danh sách đề
      </Link>
      <p className="ih-pr-dialog-cap">Lịch sử làm bài</p>
      <h1 className="ih-font-hand ih-pr-dialog-title">{title}</h1>

      {records === null ? null : records.length === 0 ? (
        <p className="ih-pr-empty">Chưa có lần nộp nào được ghi lại. (Các lần nộp trước khi có tính năng này không có trong lịch sử.)</p>
      ) : (
        <ul className="ih-hist">
          {records.map((r) => {
            const pct = r.total > 0 ? Math.round((r.score / r.total) * 100) : 0
            return (
              <li key={r.at} className="ih-hist-row">
                <div className="ih-hist-main">
                  <span className="ih-hist-score">
                    {r.score}/{r.total}
                  </span>
                  <span className={`ih-run-mode ih-run-mode-${r.mode}`}>{r.mode === 'real' ? 'Thi thật' : 'Luyện tập'}</span>
                  <span className="ih-hist-date">{new Date(r.at).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
                <div className="ih-hist-bar" aria-hidden>
                  <span style={{ width: `${pct}%` }} />
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <div className="ih-hist-actions">
        <Link href={base} className="ih-btn-solid">
          Làm lại đề này
        </Link>
        <Link href={`${base}/review`} className="ih-btn-outline">
          Xem giải thích
        </Link>
      </div>
    </div>
  )
}
