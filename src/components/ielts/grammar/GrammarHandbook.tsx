import Link from 'next/link'
import { getGrammarLesson } from '@/lib/ielts/grammar'
import {
  AFTER_RULES,
  CONFUSING_PAIRS,
  GLOSSARY,
  IRREGULAR_VERBS,
  OTHER_FORMS,
  STUDY_STEPS,
  TENSE_STEPS,
  TENSE_TABLE,
} from '@/data/ielts/grammar/handbook'
import { bold } from './inline'
import { ReviewQuiz } from './ReviewQuiz'
import './grammar.css'

const SECTIONS = [
  { id: 'cach-hoc', label: 'Cách học' },
  { id: 'thuat-ngu', label: 'Thuật ngữ' },
  { id: 'cac-thi', label: 'Bảng các thì' },
  { id: 'chon-thi', label: 'Chọn thì' },
  { id: 'sau-tu', label: 'Sau từ này dùng gì' },
  { id: 'de-nham', label: 'Cặp dễ nhầm' },
  { id: 'bat-quy-tac', label: 'Động từ bất quy tắc' },
  { id: 'on-tap', label: '50 câu ôn tập' },
]

function LessonLink({ id }: { id: string }) {
  const l = getGrammarLesson(id)
  if (!l) return null
  return (
    <Link href={`/ielts/grammar/${l.id}`} className="ih-gr-lesson-link">
      Bài {l.no}
    </Link>
  )
}

// Cẩm nang chung (/ielts/grammar/handbook): tổng hợp để ôn nhanh sau khi đã học các bài, cuối trang là 50 câu ôn tập.
export function GrammarHandbook() {
  return (
    <div className="ih-gr ih-gr-narrow">
      <header className="ih-gr-hero">
        <p className="ih-gr-kicker">🧭 Ngữ pháp cơ bản</p>
        <h1 className="ih-font-hand ih-gr-title">Cẩm nang chung</h1>
        <p className="ih-gr-summary">
          Mọi thứ cần ôn nhanh ở một chỗ. Nên học hiểu từng bài trước — bảng tóm tắt chỉ hữu ích khi bạn đã hiểu ví dụ.
        </p>
        <nav className="ih-gr-toc" aria-label="Mục lục cẩm nang">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.label}
            </a>
          ))}
        </nav>
      </header>

      <section id="cach-hoc" className="ih-glass ih-gr-card ih-gr-anchor">
        <h2 className="ih-gr-h">🗺️ Cách học hiệu quả</h2>
        <ol className="ih-gr-steps">
          {STUDY_STEPS.map((s, i) => (
            <li key={i}>{bold(s)}</li>
          ))}
        </ol>
      </section>

      <section id="thuat-ngu" className="ih-glass ih-gr-card ih-gr-anchor">
        <h2 className="ih-gr-h">📖 Thuật ngữ & ký hiệu</h2>
        <p className="ih-gr-muted">Các ký hiệu dùng trong công thức ở tất cả các bài.</p>
        <div className="ih-gr-table-wrap">
          <table className="ih-gr-table">
            <thead>
              <tr>
                <th>Ký hiệu</th>
                <th>Nghĩa</th>
                <th>Ví dụ</th>
              </tr>
            </thead>
            <tbody>
              {GLOSSARY.map((g) => (
                <tr key={g.term}>
                  <td className="ih-gr-strong">{g.term}</td>
                  <td>{g.meaning}</td>
                  <td>{g.example && bold(g.example)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="cac-thi" className="ih-glass ih-gr-card ih-gr-anchor">
        <h2 className="ih-gr-h">⏳ Bảng tổng hợp các thì</h2>
        <div className="ih-gr-table-wrap">
          <table className="ih-gr-table">
            <thead>
              <tr>
                <th>Thì</th>
                <th>Công thức</th>
                <th>Dùng khi</th>
                <th>Ví dụ</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {TENSE_TABLE.map((t) => (
                <tr key={t.name}>
                  <td>
                    <span className="ih-gr-strong">{t.name}</span>
                    <br />
                    <span className="ih-gr-muted">{t.vi}</span>
                  </td>
                  <td>
                    <code>{t.form}</code>
                  </td>
                  <td>{t.use}</td>
                  <td className="ih-gr-en">{t.example}</td>
                  <td>
                    <LessonLink id={t.lesson} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="ih-gr-h3">Các cấu trúc lớn khác</h3>
        <div className="ih-gr-table-wrap">
          <table className="ih-gr-table">
            <tbody>
              {OTHER_FORMS.map((f) => (
                <tr key={f.name}>
                  <td className="ih-gr-strong">{f.name}</td>
                  <td>
                    <code>{f.form}</code>
                  </td>
                  <td>{f.use}</td>
                  <td>
                    <LessonLink id={f.lesson} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="chon-thi" className="ih-glass ih-gr-card ih-gr-anchor">
        <h2 className="ih-gr-h">🧭 Chọn thì trong 3 câu hỏi</h2>
        <div className="ih-gr-flow">
          {TENSE_STEPS.map((s) => (
            <div key={s.q} className="ih-gr-flow-step">
              <p className="ih-gr-flow-q">{bold(s.q)}</p>
              <p className="ih-gr-flow-a">{bold(s.a)}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="sau-tu" className="ih-glass ih-gr-card ih-gr-anchor">
        <h2 className="ih-gr-h">🧩 Sau từ này thì động từ ở dạng gì?</h2>
        <p className="ih-gr-muted">Gom từ nhiều bài lại — phần hay bị trừ điểm nhất trong Writing.</p>
        <div className="ih-gr-table-wrap">
          <table className="ih-gr-table">
            <thead>
              <tr>
                <th>Sau…</th>
                <th>Dùng</th>
                <th>Ví dụ</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {AFTER_RULES.map((r) => (
                <tr key={r.after}>
                  <td>{r.after}</td>
                  <td className="ih-gr-strong">{r.use}</td>
                  <td className="ih-gr-en">{bold(r.example)}</td>
                  <td>
                    <LessonLink id={r.lesson} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="de-nham" className="ih-glass ih-gr-card ih-gr-anchor">
        <h2 className="ih-gr-h">⚖️ Những cặp dễ nhầm nhất</h2>
        <ul className="ih-gr-pairs">
          {CONFUSING_PAIRS.map((p) => (
            <li key={p.a + p.b}>
              <span className="ih-gr-pair">
                <b>{p.a}</b>
                <span className="ih-gr-vs">vs</span>
                <b>{p.b}</b>
              </span>
              <span className="ih-gr-pair-explain">{p.explain}</span>
              <LessonLink id={p.lesson} />
            </li>
          ))}
        </ul>
      </section>

      <section id="bat-quy-tac" className="ih-glass ih-gr-card ih-gr-anchor">
        <h2 className="ih-gr-h">📚 Động từ bất quy tắc hay gặp</h2>
        <p className="ih-gr-muted">V1 (nguyên mẫu) – V2 (quá khứ đơn) – V3 (thì hoàn thành, bị động).</p>
        <div className="ih-gr-table-wrap ih-gr-irr">
          <table className="ih-gr-table">
            <thead>
              <tr>
                <th>V1</th>
                <th>V2</th>
                <th>V3</th>
                <th>Nghĩa</th>
              </tr>
            </thead>
            <tbody>
              {IRREGULAR_VERBS.map(([v1, v2, v3, vi]) => (
                <tr key={v1}>
                  <td className="ih-gr-strong">{v1}</td>
                  <td>{v2}</td>
                  <td>{v3}</td>
                  <td className="ih-gr-muted">{vi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="on-tap" className="ih-gr-anchor">
        <h2 className="ih-gr-h ih-gr-h--big">✍️ 50 câu ôn tập tổng hợp</h2>
        <p className="ih-gr-muted">Làm một lượt không nhìn lại bài, rồi bấm Chấm điểm. Câu nào sai, bấm vào tên bài để ôn lại đúng chủ điểm.</p>
        <ReviewQuiz />
      </section>
    </div>
  )
}
