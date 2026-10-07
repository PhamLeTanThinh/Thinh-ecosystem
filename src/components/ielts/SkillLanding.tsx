'use client'

import type { CSSProperties } from 'react'
import Link from 'next/link'
import { SKILLS } from '@/lib/ielts/skills'
import { useIeltsStore } from '@/lib/ielts/store'
import { TV_SHOWS, showLineCount } from '@/lib/ielts/tv'
import { GRAMMAR_LESSONS } from '@/lib/ielts/grammar'
import { useIeltsAccess } from './AccessContext'
import './grammar/grammar.css'

// Mục có trong khu riêng của từng kỹ năng (khớp menu trái ở Sidebar.tsx) — hiện dưới tên kỹ năng để biết bên trong có gì.
const SKILL_DESC: Record<string, string> = {
  listening: 'Đề CAM · Dictation · Vocab',
  speaking: 'Bài tập · Đề mẫu · Vocab',
  reading: 'Làm đề · Vocab',
  writing: 'Đề mẫu · Bài tập · Vocab',
}

// Màn hình đầu /ielts: 4 kỹ năng dạng card. Mỗi card dẫn vào khu riêng của kỹ năng đó (/ielts/<skill>,
// có menu Kiến thức / Làm đề / Vocab). Bên dưới là thẻ lớn "Học qua phim" (/ielts/tv, kèm poster các phim), "Ngữ pháp cơ bản"
// (/ielts/grammar) và Admin nếu là chủ.
export function SkillLanding() {
  const { isOwner } = useIeltsAccess()
  const pages = useIeltsStore((s) => s.pages)
  const hydrated = useIeltsStore((s) => s.hydrated)

  return (
    <div className="ih-landing">
      <h1 className="ih-font-hand ih-landing-title">IELTS Hub</h1>
      <p className="ih-landing-sub">Chọn một kỹ năng để bắt đầu</p>

      <div className="ih-landing-grid">
        {SKILLS.map((skill, i) => {
          const count = pages.filter((p) => p.skill === skill.key).length
          return (
            <Link
              key={skill.key}
              href={`/ielts/${skill.key}/lessons`}
              className="ih-glass ih-landing-card"
              style={{ '--i': i, '--sk': skill.accent } as CSSProperties}
            >
              <span className="ih-landing-icon" aria-hidden>
                {skill.icon}
              </span>
              <span className="ih-font-hand ih-landing-label">{skill.label}</span>
              <span className="ih-landing-desc">{SKILL_DESC[skill.key]}</span>
              {/* Chưa tải xong danh sách trang thì để trống (giữ chiều cao) thay vì hiện "0 trang" sai. */}
              <span className="ih-landing-count">{hydrated ? `${count} trang kiến thức` : ' '}</span>
              <span className="ih-landing-go" aria-hidden>
                →
              </span>
            </Link>
          )
        })}
      </div>

      <Link href="/ielts/tv" className="ih-glass ih-landing-movie">
        <span className="ih-landing-movie-text">
          <span className="ih-landing-movie-kicker">🎬 Học qua phim</span>
          <span className="ih-font-hand ih-landing-movie-title">Học tiếng Anh qua phim</span>
          <span className="ih-landing-movie-desc">
            Câu thoại gốc trong phim kèm bản dịch, cụm từ, cấu trúc và ngữ cảnh — học tiếng Anh nói thật qua từng tập.
          </span>
          <span className="ih-landing-movie-count">
            {TV_SHOWS.length} phim · {TV_SHOWS.reduce((sum, show) => sum + show.episodes.length, 0)} tập ·{' '}
            {TV_SHOWS.reduce((sum, show) => sum + showLineCount(show), 0)} mục học →
          </span>
        </span>
        <span className="ih-landing-movie-posters" aria-hidden>
          {TV_SHOWS.filter((show) => show.poster)
            .slice(0, 3)
            .map((show, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={show.id} src={show.poster} alt="" style={{ '--p': i } as CSSProperties} />
            ))}
        </span>
      </Link>

      <Link href="/ielts/grammar" className="ih-glass ih-landing-movie ih-landing-grammar">
        <span className="ih-landing-movie-text">
          <span className="ih-landing-movie-kicker">📘 Ngữ pháp cơ bản</span>
          <span className="ih-font-hand ih-landing-movie-title">Ngữ pháp tiếng Anh từ nền tảng</span>
          <span className="ih-landing-movie-desc">
            Từ cấu trúc câu, các thì, modal tới mệnh đề quan hệ và giới từ — giải thích dễ hiểu, ví dụ có phát âm, lỗi hay gặp, kèm cẩm nang chung
            và 50 câu ôn tập.
          </span>
          <span className="ih-landing-movie-count">{GRAMMAR_LESSONS.length} bài · Cẩm nang chung →</span>
        </span>
        <span className="ih-landing-grammar-art" aria-hidden>
          <span>S + V + O</span>
          <span>have + V3</span>
          <span>If + had V3</span>
          <span>be + V3</span>
        </span>
      </Link>

      {isOwner && (
        <div className="ih-landing-links">
          <Link href="/admin" className="ih-btn-outline">
            🔗 Admin · Người xem
          </Link>
        </div>
      )}
    </div>
  )
}
