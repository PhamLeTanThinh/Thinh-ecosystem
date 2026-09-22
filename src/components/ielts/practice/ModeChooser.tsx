import Link from 'next/link'
import type { PracticeTest } from '@/lib/ielts/practice'
import { skillLabel } from '@/lib/ielts/skills'
import { DraftNote } from './DraftNote'

// Trang chọn chế độ của 1 đề (/ielts/<skill>/practice/<testId>): luyện tập, thi thật hoặc học từ vựng.
// Server component thuần — chỉ toàn Link, không có state.
export function ModeChooser({ test }: { test: PracticeTest }) {
  const base = `/ielts/${test.skill}`
  // Chọn chế độ → màn giới thiệu đề (/start) → nút "Bắt đầu" mới vào làm bài (/run).
  const runHref = (mode: string) => `${base}/practice/${test.id}/start?mode=${mode}`

  return (
    <div className="ih-pr ih-pr-choose">
      <Link href={`${base}/practice`} className="ih-pr-back">
        ← Danh sách đề
      </Link>
      <p className="ih-pr-dialog-cap">
        {skillLabel(test.skill)} · {test.part}
      </p>
      <h1 className="ih-font-hand ih-pr-dialog-title">{test.title}</h1>
      <DraftNote testId={test.id} />

      <div className="ih-pr-modes">
        <Link href={runHref('practice')} className="ih-pr-mode ih-pr-mode-practice">
          <span className="ih-pr-mode-tag">🎓 LUYỆN TẬP</span>
          <span className="ih-pr-mode-name">Chế độ Luyện tập</span>
          <span className="ih-pr-mode-desc">Gợi ý sẵn, làm bài có hỗ trợ</span>
          <ul className="ih-pr-mode-points">
            <li>⏳ Không tính giờ</li>
            <li>✅ Kiểm tra đáp án ngay khi làm</li>
          </ul>
          <span className="ih-pr-mode-cta">▶ Bắt đầu luyện</span>
        </Link>

        <Link href={runHref('real')} className="ih-pr-mode ih-pr-mode-real">
          <span className="ih-pr-mode-tag">🛡 THI THẬT</span>
          <span className="ih-pr-mode-name">Chế độ Thi thật</span>
          <span className="ih-pr-mode-desc">Tính giờ như đang thi thật</span>
          <ul className="ih-pr-mode-points">
            <li>⏱ Tính thời gian chuẩn ({test.durationMin} phút)</li>
            <li>🔒 Không có hỗ trợ khi làm bài</li>
          </ul>
          <span className="ih-pr-mode-cta">▶ Thi thử tính giờ</span>
        </Link>
      </div>

      <Link href={`${base}/vocab/${test.id}`} className="ih-pr-vocab-btn">
        <span>📚 Học Vocab set của đề này</span>
        <span className="ih-pr-vocab-count">{test.vocab.length} từ →</span>
      </Link>
    </div>
  )
}
