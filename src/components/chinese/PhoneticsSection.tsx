'use client'

import { Fragment } from 'react'
import {
  PHONETICS_LESSONS,
  SYLLABLE_HANZI,
  TONES,
  type PhoneticSound,
  type PhoneticsNote,
  type ToneSandhiBlock,
  type EndingComparison,
  type NeutralToneSection,
  type GroupComparison,
} from '@/lib/chinese/phonetics'
import { SpeakButton } from '@/components/shared/SpeakButton'

const ZH_LANG = 'zh-CN'

interface Props {
  lesson: number
}

// Trang lý thuyết vỡ lòng đứng trước HSK 1+2 — thanh mẫu/vận mẫu/thanh điệu, chia theo Bài 1/Bài 2...
// của RIÊNG chuỗi ngữ âm (không phải thẻ để ôn nên tách hẳn khỏi luồng vocab/grammar — xem
// lib/chinese/phonetics.ts). Không phát âm riêng từng chữ cái b/p/m/f/a/o... vì Web Speech API sẽ đọc
// như TÊN chữ cái tiếng Anh, không đúng ngữ âm tiếng Trung — chỉ gắn nút phát âm ở âm tiết/chữ Hán
// THẬT (bảng ghép âm, ví dụ thanh điệu, ví dụ trong ghi chú).
export function PhoneticsSection({ lesson }: Props) {
  const data = PHONETICS_LESSONS.find((l) => l.number === lesson)
  if (!data) return null

  return (
    <div className="cn-content">
      <div className="cn-content-header">
        <div>
          <p className="cn-eyebrow">学中文 · Vỡ lòng</p>
          <h1 className="cn-page-title">🔤 {data.title}</h1>
        </div>
      </div>

      {data.number === 1 && (
        <p className="cn-phon-intro">
          Trước khi vào Bài 1 HSK 1+2, cùng làm quen với 3 khối xây nên mọi âm tiết tiếng Trung: <strong>thanh mẫu</strong> (phụ âm đầu),{' '}
          <strong>vận mẫu</strong> (nguyên âm) và <strong>thanh điệu</strong> (dấu giọng) — ghép 3 khối này lại là ra 1 âm tiết hoàn chỉnh, vd b
          + a + ā = bā.
        </p>
      )}

      {/* Không bọc mỗi mục trong <section> riêng — .cn-section-title dùng :first-child để reset margin-top
          của mục ĐẦU TIÊN (xem chinese.css), bọc riêng từng khối sẽ khiến MỌI tiêu đề đều là first-child
          của khối nó và mất khoảng cách giữa các mục. Để phẳng, cùng 1 cha, giống LessonContent. */}
      {data.initialGroups.length > 0 && (
        <>
          <p className="cn-section-title">🔠 Thanh mẫu (phụ âm đầu)</p>
          {data.initialGroups.map((group, i) => (
            <SoundGroupGrid key={i} group={group} />
          ))}
        </>
      )}

      {data.finalGroups.length > 0 && (
        <>
          <p className="cn-section-title">🔡 Vận mẫu {data.number === 1 ? '(nguyên âm đơn)' : '(vận mẫu ghép)'}</p>
          {data.finalGroups.map((group, i) => (
            <SoundGroupGrid key={i} group={group} />
          ))}
        </>
      )}

      {data.groupComparison && (
        <>
          <p className="cn-section-title">🔍 {data.groupComparison.title}</p>
          <GroupComparisonTable data={data.groupComparison} />
        </>
      )}

      {data.showTones && (
        <>
          <p className="cn-section-title">{data.toneSectionTitle}</p>
          {data.number === 1 && (
            <p className="cn-phon-intro">
              Thanh điệu là sự biến đổi cao thấp của một âm tiết. Tiếng phổ thông Trung Quốc có <strong>4 thanh điệu cơ bản</strong> — cùng 1 âm
              tiết <em>ma</em>, đổi thanh điệu là đổi hẳn nghĩa.
            </p>
          )}
          <div className="cn-tone-grid">
            {TONES.map((tone) => (
              <ToneCard key={tone.number} tone={tone} />
            ))}
          </div>
        </>
      )}

      {data.toneSandhi && (
        <>
          <p className="cn-section-title">{data.toneSectionTitle}</p>
          {data.toneSandhi.map((block, i) => (
            <ToneSandhiBlockCard key={i} block={block} />
          ))}
        </>
      )}

      {data.neutralTone && (
        <>
          <p className="cn-section-title">{data.toneSectionTitle}</p>
          <NeutralToneCard data={data.neutralTone} />
        </>
      )}

      {data.endingComparison && (
        <>
          <p className="cn-section-title">📌 Một số lưu ý</p>
          <EndingComparisonTable data={data.endingComparison} />
        </>
      )}

      <p className="cn-section-title">📋 Bảng ghép âm</p>
      <p className="cn-phon-intro">Ghép thanh mẫu (cột trái) với vận mẫu (hàng trên) — ô trống là tổ hợp không tồn tại trong tiếng Trung.</p>
      {data.syllableTables.map((table, i) => (
        <SyllableTable key={i} rows={table.rows} vowelLabels={table.vowelLabels} />
      ))}

      {data.notes.length > 0 && (
        <>
          {!data.endingComparison && <p className="cn-section-title">📌 Một số lưu ý</p>}
          {data.notes.map((note, i) => (
            <NoteCard key={i} note={note} />
          ))}
        </>
      )}
    </div>
  )
}

function SoundGroupGrid({ group }: { group: PhoneticSound[] }) {
  return (
    <div className={`cn-phon-grid${group.length === 1 ? ' cn-phon-grid-solo' : ''}`}>
      {group.map((sound) => (
        <SoundCard key={sound.letter} sound={sound} />
      ))}
    </div>
  )
}

function SoundCard({ sound }: { sound: PhoneticSound }) {
  return (
    <div className="cn-glass cn-phon-card">
      <div className="cn-phon-card-head">
        <span className="cn-phon-letter">Âm {sound.letter}</span>
      </div>

      {/* Ảnh sơ đồ khoang miệng chụp từ sách — public/phonetics/<image>.png (xem lib/chinese/phonetics.ts).
          Chưa có ảnh (sound.image rỗng) thì vẫn hiện ô trống chờ như cũ. */}
      {sound.image ? (
        <img className="cn-phon-image" src={`/phonetics/${sound.image}.png`} alt={`Sơ đồ khoang miệng khi phát âm ${sound.letter}`} />
      ) : (
        <div className="cn-phon-image-placeholder" aria-hidden>
          <span className="cn-phon-image-icon">🖼️</span>
          <span>Hình minh hoạ khoang miệng (sẽ thêm sau)</span>
        </div>
      )}

      <div className="cn-phon-row">
        <span className="cn-phon-row-label">Đặc tính</span>
        <p className="cn-phon-row-text">{sound.characteristic}</p>
      </div>

      <div className="cn-phon-row">
        <span className="cn-phon-row-label">Cách phát âm</span>
        <ul className="cn-phon-howto">
          {sound.howTo.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ul>
      </div>

      <div className="cn-phon-row">
        <span className="cn-phon-row-label">Đặc trưng âm thanh</span>
        <p className="cn-phon-row-text">{sound.soundLike}</p>
        {sound.note && <p className="cn-phon-row-note">Chú ý: {sound.note}</p>}
      </div>
    </div>
  )
}

// Vẽ nét thanh điệu bằng SVG thuần theo 5 mốc cao độ (thang 1–5, giống hình trong sách) — không cần
// ảnh, contour là mảng mốc cao độ nối liền nhau theo lib/chinese/phonetics.ts.
function ToneContour({ contour }: { contour: number[] }) {
  const W = 100
  const H = 70
  const pad = 8
  const toY = (level: number) => pad + ((5 - level) / 4) * (H - pad * 2)
  const toX = (i: number) => pad + (i / (contour.length - 1)) * (W - pad * 2)
  const points = contour.map((level, i) => `${toX(i)},${toY(level)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="cn-tone-svg" aria-hidden>
      {[1, 2, 3, 4, 5].map((level) => (
        <line key={level} x1={pad} y1={toY(level)} x2={W - pad} y2={toY(level)} className="cn-tone-svg-grid" />
      ))}
      <polyline points={points} className="cn-tone-svg-line" fill="none" />
    </svg>
  )
}

function ToneCard({ tone }: { tone: (typeof TONES)[number] }) {
  return (
    <div className="cn-glass cn-tone-card">
      <div className="cn-tone-card-head">
        <span className="cn-tone-mark">{tone.mark}</span>
        <span className="cn-tone-number">Thanh {tone.number}</span>
      </div>
      <p className="cn-tone-name">{tone.name}</p>
      <ToneContour contour={tone.contour} />
      <div className="cn-tone-example">
        <span className="cn-tone-example-hanzi">{tone.example.hanzi}</span>
        <span className="cn-tone-example-pinyin">{tone.example.pinyin}</span>
        <span className="cn-tone-example-meaning">{tone.example.meaning}</span>
        <SpeakButton text={tone.example.hanzi} lang={ZH_LANG} className="shrink-0 rounded-full p-1 text-muted hover:bg-brand-soft hover:text-brand" />
      </div>
    </div>
  )
}

function SyllableTable({ rows, vowelLabels }: { rows: { consonant: string; cells: (string | null)[] }[]; vowelLabels: string[] }) {
  return (
    <div className="cn-glass cn-syllable-wrap">
      <table className="cn-syllable-table">
        <thead>
          <tr>
            <th />
            {vowelLabels.map((v) => (
              <th key={v}>{v}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.consonant}>
              <th>{row.consonant}</th>
              {row.cells.map((cell, i) =>
                cell ? (
                  <td key={i} className="cn-syllable-cell">
                    <span>{cell}</span>
                    {/* Đọc bằng chữ Hán tương ứng (SYLLABLE_HANZI), không đọc thẳng pinyin không dấu —
                        giọng zh-CN hay đọc tách rời từng chữ cái (vd "pa" → "P", "A") thay vì đọc như
                        1 âm tiết thật khi thiếu dấu thanh (xem lib/chinese/phonetics.ts). */}
                    <SpeakButton text={SYLLABLE_HANZI[cell] ?? cell} lang={ZH_LANG} className="cn-syllable-speak" label={`Phát âm ${cell}`} />
                  </td>
                ) : (
                  <td key={i} className="cn-syllable-cell-empty" aria-hidden />
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function NoteCard({ note }: { note: PhoneticsNote }) {
  return (
    <div className="cn-glass cn-phon-note">
      <p className="cn-phon-note-title">{note.title}</p>
      <p className="cn-phon-note-text">{note.intro}</p>

      {note.examples && (
        <div className="cn-phon-note-examples">
          {note.examples.map((ex, i) => (
            <div key={i} className="cn-phon-note-example">
              <span className="cn-phon-note-example-hanzi">{ex.hanzi}</span>
              <span className="cn-phon-note-example-pinyin">{ex.pinyin}</span>
              <span className="cn-phon-note-example-meaning">{ex.meaning}</span>
              <SpeakButton text={ex.hanzi} lang={ZH_LANG} className="shrink-0 rounded-full p-1 text-muted hover:bg-brand-soft hover:text-brand" />
            </div>
          ))}
        </div>
      )}

      {note.bullets && (
        <ul className="cn-phon-note-bullets">
          {note.bullets.map((b, i) => (
            <li key={i}>
              <strong>{b.label}:</strong> {b.text}
            </li>
          ))}
        </ul>
      )}

      {note.plainBullets && (
        <ul className="cn-phon-note-bullets">
          {note.plainBullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}

      {note.outro && <p className="cn-phon-note-text cn-phon-note-outro">{note.outro}</p>}
    </div>
  )
}

// Quy tắc biến điệu thanh 3 (Bài 3) — mỗi block là 1 quy tắc; 2 variants (có label) = 2 cách biến điệu
// song song đặt cạnh nhau (xem lib/chinese/phonetics.ts), 1 variant = quy tắc thường.
function ToneSandhiBlockCard({ block }: { block: ToneSandhiBlock }) {
  return (
    <div className="cn-glass cn-sandhi-block">
      <p className="cn-sandhi-title">{block.title}</p>

      {block.plainNote && <p className="cn-phon-note-text">{block.plainNote}</p>}

      <div className={`cn-sandhi-variants${block.variants.length > 1 ? ' cn-sandhi-variants-split' : ''}`}>
        {block.variants.map((variant, i) => (
          <div key={i} className="cn-sandhi-variant">
            {variant.label && <p className="cn-sandhi-variant-label">{variant.label}</p>}
            <div className="cn-sandhi-examples">
              {variant.examples.map((ex, j) => (
                <div key={j} className="cn-sandhi-example">
                  <div className="cn-sandhi-example-pinyin">
                    {/* before rỗng = ví dụ này chỉ minh hoạ 1 cách đọc cố định, không phải 1 phép biến
                        đổi từ→sang (xem ToneSandhiExample trong lib/chinese/phonetics.ts) — bỏ mũi tên. */}
                    {ex.before && (
                      <>
                        <span>{ex.before}</span>
                        <span className="cn-sandhi-arrow">→</span>
                      </>
                    )}
                    <span className="cn-sandhi-after">{ex.after}</span>
                  </div>
                  <div className="cn-sandhi-example-hanzi">
                    <span>{ex.hanzi}</span>
                    <SpeakButton text={ex.hanzi} lang={ZH_LANG} className="shrink-0 rounded-full p-1 text-muted hover:bg-brand-soft hover:text-brand" />
                  </div>
                  <p className="cn-sandhi-example-meaning">{ex.meaning}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Bảng so sánh vận mẫu đuôi -n / -ng (Bài 3) — layout riêng (2 cột cố định), khác cn-phon-grid vì
// đây là bảng đối chiếu thuộc tính chứ không phải 2 thẻ âm độc lập.
function EndingComparisonTable({ data }: { data: EndingComparison }) {
  return (
    <div className="cn-glass cn-ending-cmp">
      <p className="cn-phon-note-title">{data.title}</p>
      <div className="cn-ending-cmp-grid">
        <span />
        <span className="cn-ending-cmp-head">{data.left.label}</span>
        <span className="cn-ending-cmp-head">{data.right.label}</span>

        <span className="cn-ending-cmp-row-label">Đặc trưng âm</span>
        <span>{data.left.soundFeature}</span>
        <span>{data.right.soundFeature}</span>

        <span className="cn-ending-cmp-row-label">Cách phát âm</span>
        <span>{data.left.howTo}</span>
        <span>{data.right.howTo}</span>

        <span className="cn-ending-cmp-row-label">Phân biệt bằng thính giác</span>
        <span>{data.left.auralTip}</span>
        <span>{data.right.auralTip}</span>
      </div>
    </div>
  )
}

// Bảng so sánh N nhóm thanh mẫu (Bài 7: j/q/x vs zh/ch/sh vs z/c/s) — số cột thay đổi theo dữ liệu
// (khác EndingComparison cố định 2 cột), CSS dùng grid-template-columns sinh động theo columns.length.
function GroupComparisonTable({ data }: { data: GroupComparison }) {
  return (
    <div className="cn-glass cn-group-cmp">
      <div className="cn-group-cmp-grid" style={{ gridTemplateColumns: `140px repeat(${data.columns.length}, 1fr)` }}>
        <span />
        {data.columns.map((col, i) => (
          <span key={i} className="cn-group-cmp-head">
            <span className="cn-group-cmp-head-title">{col.title}</span>
            <span className="cn-group-cmp-head-subtitle">{col.subtitle}</span>
          </span>
        ))}

        {data.rows.map((row, i) => (
          <Fragment key={i}>
            <span className="cn-group-cmp-row-label">{row.label}</span>
            {row.cells.map((cell, j) =>
              Array.isArray(cell) ? (
                <ul key={j} className="cn-group-cmp-bullets">
                  {cell.map((line, k) => (
                    <li key={k}>{line}</li>
                  ))}
                </ul>
              ) : (
                <span key={j} className="cn-group-cmp-text">
                  {cell}
                </span>
              ),
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

// Thanh nhẹ (Bài 4) — giải thích + Cách phát âm + ví dụ (âm tiết mang thanh nhẹ không có dấu thanh,
// vd "ma" trong "māma") + ghi chú phân biệt với thanh điệu bình thường.
function NeutralToneCard({ data }: { data: NeutralToneSection }) {
  return (
    <div className="cn-glass cn-neutral-tone">
      {data.intro.map((p, i) => (
        <p key={i} className="cn-phon-note-text cn-neutral-tone-p">
          {p}
        </p>
      ))}

      <div className="cn-phon-row">
        <span className="cn-phon-row-label">Cách phát âm</span>
        <p className="cn-phon-row-text">{data.howTo}</p>
      </div>

      <div className="cn-neutral-tone-examples">
        {data.examples.map((ex, i) => (
          <div key={i} className="cn-tone-example cn-neutral-tone-example">
            <span className="cn-tone-example-hanzi">{ex.hanzi}</span>
            <span className="cn-tone-example-pinyin">{ex.pinyin}</span>
            <span className="cn-tone-example-meaning">{ex.meaning}</span>
            <SpeakButton text={ex.hanzi} lang={ZH_LANG} className="shrink-0 rounded-full p-1 text-muted hover:bg-brand-soft hover:text-brand" />
          </div>
        ))}
      </div>

      <div className="cn-neutral-tone-distinguish">
        <p className="cn-phon-note-title">{data.distinguishNote.title}</p>
        <ul className="cn-phon-note-bullets cn-neutral-tone-bullets">
          {data.distinguishNote.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
