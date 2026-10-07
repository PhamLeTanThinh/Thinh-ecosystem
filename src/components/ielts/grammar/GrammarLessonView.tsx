import Link from 'next/link'
import { SpeakButton } from '@/components/shared/SpeakButton'
import { GRAMMAR_GROUPS, neighbours, type GrammarLesson } from '@/lib/ielts/grammar'
import { bold } from './inline'
import './grammar.css'

// 1 bài ngữ pháp: Hiểu nhanh → Thuật ngữ → Công thức → Cách dùng → Dấu hiệu → Ví dụ → Lỗi thường gặp → Dễ nhầm / Mẹo nhớ.
export function GrammarLessonView({ lesson }: { lesson: GrammarLesson }) {
  const group = GRAMMAR_GROUPS.find((g) => g.key === lesson.group)
  const { prev, next } = neighbours(lesson.id)

  return (
    <div className="ih-gr ih-gr-narrow">
      <header className="ih-gr-hero">
        <p className="ih-gr-kicker">
          Bài {lesson.no} · {group?.icon} {group?.label}
        </p>
        <h1 className="ih-font-hand ih-gr-title">{lesson.title}</h1>
        <p className="ih-gr-vi-title">{lesson.vi}</p>
      </header>

      <section className="ih-gr-quick">
        <h2 className="ih-gr-h">💡 Hiểu nhanh</h2>
        <p>{bold(lesson.summary)}</p>
      </section>

      {lesson.terms && (
        <section className="ih-glass ih-gr-card">
          <h2 className="ih-gr-h">📖 Thuật ngữ trong bài</h2>
          <dl className="ih-gr-terms">
            {lesson.terms.map((t) => (
              <div key={t.term}>
                <dt>{t.term}</dt>
                <dd>{bold(t.meaning)}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section className="ih-glass ih-gr-card">
        <h2 className="ih-gr-h">🧮 Công thức</h2>
        <table className="ih-gr-forms">
          <tbody>
            {lesson.forms.map((f) => (
              <tr key={f.label}>
                <th>{f.label}</th>
                <td>
                  <code>{f.formula}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="ih-gr-two">
        <section className="ih-glass ih-gr-card">
          <h2 className="ih-gr-h">🎯 Dùng khi nào</h2>
          <ul className="ih-gr-list">
            {lesson.uses.map((u, i) => (
              <li key={i}>{bold(u)}</li>
            ))}
          </ul>
        </section>
        {lesson.signals && (
          <section className="ih-glass ih-gr-card">
            <h2 className="ih-gr-h">🔎 Dấu hiệu nhận biết</h2>
            <ul className="ih-gr-chips">
              {lesson.signals.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <section className="ih-glass ih-gr-card">
        <h2 className="ih-gr-h">🗣️ Ví dụ</h2>
        <ul className="ih-gr-examples">
          {lesson.examples.map((ex) => (
            <li key={ex.en}>
              <span className="ih-gr-ex-en">
                {ex.en}
                <SpeakButton text={ex.en} lang="en-US" className="ih-gr-speak" />
              </span>
              <span className="ih-gr-ex-vi">{ex.vi}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="ih-glass ih-gr-card">
        <h2 className="ih-gr-h">⚠️ Lỗi thường gặp</h2>
        <ul className="ih-gr-mistakes">
          {lesson.mistakes.map((m) => (
            <li key={m.wrong}>
              <span className="ih-gr-wrong">✗ {m.wrong}</span>
              <span className="ih-gr-right">✓ {m.right}</span>
              <span className="ih-gr-why">{bold(m.why)}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="ih-gr-two">
        <section className="ih-gr-note ih-gr-note--compare">
          <h2 className="ih-gr-h">⚖️ Dễ nhầm</h2>
          <p>{bold(lesson.compare)}</p>
        </section>
        <section className="ih-gr-note ih-gr-note--tip">
          <h2 className="ih-gr-h">🧠 Mẹo nhớ</h2>
          <p>{bold(lesson.tip)}</p>
        </section>
      </div>

      <nav className="ih-gr-pager" aria-label="Chuyển bài">
        {prev ? (
          <Link href={`/ielts/grammar/${prev.id}`} className="ih-glass ih-gr-pager-link">
            <span className="ih-gr-pager-dir">← Bài {prev.no}</span>
            <span className="ih-gr-pager-title">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/ielts/grammar/${next.id}`} className="ih-glass ih-gr-pager-link ih-gr-pager-link--next">
            <span className="ih-gr-pager-dir">Bài {next.no} →</span>
            <span className="ih-gr-pager-title">{next.title}</span>
          </Link>
        ) : (
          <Link href="/ielts/grammar/handbook" className="ih-glass ih-gr-pager-link ih-gr-pager-link--next">
            <span className="ih-gr-pager-dir">Ôn tập →</span>
            <span className="ih-gr-pager-title">Cẩm nang & 50 câu ôn tập</span>
          </Link>
        )}
      </nav>
    </div>
  )
}
