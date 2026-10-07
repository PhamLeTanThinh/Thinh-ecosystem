import Link from 'next/link'
import { GRAMMAR_GROUPS, GRAMMAR_LESSONS, lessonsOfGroup } from '@/lib/ielts/grammar'
import { REVIEW_QUESTIONS } from '@/data/ielts/grammar/handbook'
import './grammar.css'

// Trang /ielts/grammar: thẻ Cẩm nang chung ở trên, bên dưới là 45 bài chia theo nhóm chủ điểm.
export function GrammarIndex() {
  return (
    <div className="ih-gr">
      <header className="ih-gr-hero">
        <p className="ih-gr-kicker">📘 Ngữ pháp cơ bản</p>
        <h1 className="ih-font-hand ih-gr-title">Ngữ pháp tiếng Anh từ nền tảng</h1>
        <p className="ih-gr-summary">
          {GRAMMAR_LESSONS.length} chủ điểm từ cấu trúc câu, các thì, động từ khuyết thiếu tới mệnh đề quan hệ và giới từ — mỗi bài giải thích
          bằng lời dễ hiểu, kèm công thức, ví dụ có phát âm, lỗi người Việt hay mắc và mẹo nhớ.
        </p>
      </header>

      <Link href="/ielts/grammar/handbook" className="ih-glass ih-gr-handbook-card">
        <span className="ih-gr-handbook-icon" aria-hidden>
          🧭
        </span>
        <span className="ih-gr-handbook-body">
          <span className="ih-font-hand ih-gr-handbook-title">Cẩm nang chung</span>
          <span className="ih-gr-handbook-desc">
            Cách học · Thuật ngữ · Bảng các thì · Sau từ này dùng V gì · Cặp dễ nhầm · Động từ bất quy tắc · {REVIEW_QUESTIONS.length} câu ôn tập có
            chấm điểm
          </span>
        </span>
        <span className="ih-gr-go" aria-hidden>
          →
        </span>
      </Link>

      {GRAMMAR_GROUPS.map((group) => {
        const lessons = lessonsOfGroup(group.key)
        if (!lessons.length) return null
        return (
          <section key={group.key} className="ih-gr-group">
            <h2 className="ih-gr-group-title">
              <span aria-hidden>{group.icon}</span> {group.label}
            </h2>
            <p className="ih-gr-group-desc">{group.desc}</p>
            <div className="ih-gr-lessons">
              {lessons.map((l) => (
                <Link key={l.id} href={`/ielts/grammar/${l.id}`} className="ih-glass ih-gr-lesson">
                  <span className="ih-gr-no">{String(l.no).padStart(2, '0')}</span>
                  <span className="ih-gr-lesson-body">
                    <span className="ih-gr-lesson-title">{l.title}</span>
                    <span className="ih-gr-lesson-vi">{l.vi}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
