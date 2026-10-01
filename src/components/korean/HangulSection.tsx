'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FINALS, HANGUL_LESSONS, INITIALS, MEDIALS, composeSyllable, type HangulBlock, type HangulLetter, type HangulWord, type VowelDerived } from '@/lib/korean/hangul'
import { speak, speakQueue } from '@/lib/shared/speech'
import { SpeakButton } from '@/components/shared/SpeakButton'
import './hangul.css'

const KO = 'ko-KR'

// "Bảng chữ cái" (/korean/hangul/<n>): 4 bài vỡ lòng 한글 배우기 của sách 서울대 1A — xem lib/korean/hangul.ts. Mỗi bài có
// URL riêng, danh sách bài nằm ở Sidebar bên trái (giống "Ngữ âm cơ bản" bên Chinese). Mọi chữ / âm tiết / từ đều bấm
// được để nghe (Web Speech API, giọng ko-KR).
export function HangulSection({ lesson: lessonNumber, onPick }: { lesson: number; onPick: (n: number) => void }) {
  const lesson = HANGUL_LESSONS.find((l) => l.number === lessonNumber) ?? HANGUL_LESSONS[0]
  const index = HANGUL_LESSONS.indexOf(lesson)
  const pick = onPick

  return (
    <div className="kr-content kr-hg">
      <div className="kr-content-header">
        <div>
          <p className="kr-eyebrow">한국어 공부 · 한글 배우기 · {lesson.titleKo}</p>
          <h1 className="kr-page-title">{lesson.title}</h1>
          <p className="kr-page-title-vi">Sách 서울대 한국어 1A · trang {lesson.pages[0]}–{lesson.pages[1]} · Bấm vào bất kỳ chữ nào để nghe.</p>
        </div>
      </div>

      <p className="kr-glass kr-hg-hero kr-hg-hero-intro">{lesson.intro}</p>

      {lesson.blocks.map((block, i) => (
        <Block key={`${lesson.number}-${i}`} block={block} />
      ))}

      <div className="kr-hg-pager">
        {index > 0 ? (
          <button type="button" className="kr-hg-pager-btn" onClick={() => pick(HANGUL_LESSONS[index - 1].number)}>
            <span className="kr-hg-pager-dir">← Bài trước</span>
            <span className="kr-hg-pager-name">{HANGUL_LESSONS[index - 1].title}</span>
          </button>
        ) : (
          <span />
        )}
        {index < HANGUL_LESSONS.length - 1 ? (
          <button type="button" className="kr-hg-pager-btn kr-hg-pager-btn--next" onClick={() => pick(HANGUL_LESSONS[index + 1].number)}>
            <span className="kr-hg-pager-dir">Bài tiếp →</span>
            <span className="kr-hg-pager-name">{HANGUL_LESSONS[index + 1].title}</span>
          </button>
        ) : (
          <Link href="/korean/lessons/101" className="kr-hg-pager-btn kr-hg-pager-btn--next">
            <span className="kr-hg-pager-dir">Học tiếp →</span>
            <span className="kr-hg-pager-name">TOPIK I · Bài 1 안녕하세요?</span>
          </Link>
        )}
      </div>
    </div>
  )
}

function Block({ block }: { block: HangulBlock }) {
  switch (block.kind) {
    case 'text':
      return (
        <section>
          <p className="kr-section-title">{block.title}</p>
          <div className="kr-hg-text">
            {block.paragraphs.map((p, i) => (
              <p key={i}>
                <KoText text={p} />
              </p>
            ))}
            {block.bullets && (
              <ul>
                {block.bullets.map((b, i) => (
                  <li key={i}>
                    <KoText text={b} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )
    case 'letters':
      return (
        <section>
          <p className="kr-section-title">{block.title}</p>
          {block.intro && <p className="kr-hg-intro">{block.intro}</p>}
          {block.tip && (
            <p className="kr-hg-tip">
              <span className="kr-hg-tip-label">Mẹo</span> {block.tip}
            </p>
          )}
          <div className="kr-hg-letters">
            {block.letters.map((l) => (
              <LetterCard key={l.char} letter={l} />
            ))}
          </div>
        </section>
      )
    case 'syllables':
      return (
        <section>
          <p className="kr-section-title">{block.title}</p>
          {block.intro && <p className="kr-hg-intro">{block.intro}</p>}
          <div className="kr-hg-table-wrap">
            <table className="kr-hg-table">
              <thead>
                <tr>
                  <th className="kr-hg-corner" aria-label="Phụ âm / nguyên âm" />
                  {block.vowels.map((v) => (
                    <th key={v}>{v}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.consonants.map((c) => (
                  <tr key={c}>
                    <th>{c}</th>
                    {block.vowels.map((v) => {
                      const s = composeSyllable(c, v)
                      return (
                        <td key={v}>
                          <button type="button" className="kr-hg-cell" onClick={() => speak(s, KO)} title={`${c} + ${v} = ${s}`}>
                            {s}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )
    case 'words':
      return (
        <section>
          <p className="kr-section-title">
            {block.title} <span className="kr-section-count">({block.words.length})</span>
          </p>
          {block.intro && <p className="kr-hg-intro">{block.intro}</p>}
          <div className="kr-hg-words">
            {block.words.map((w) => (
              <WordChip key={w.ko + w.vi} word={w} />
            ))}
          </div>
        </section>
      )
    case 'vowelPrinciple':
      return (
        <section>
          <p className="kr-section-title">{block.title}</p>
          <p className="kr-hg-intro">{block.intro} Bấm vào từng chữ để nghe.</p>
          <div className="kr-hg-vbasics">
            {block.basics.map((v) => (
              <div key={v.char} className="kr-glass kr-hg-vbasic">
                {v.shape === 'dot' ? (
                  <span className="kr-hg-vglyph" title="ㆍ không còn được đọc trong tiếng Hàn hiện đại">
                    <span className="kr-hg-dot" />
                  </span>
                ) : (
                  <button type="button" className="kr-hg-vglyph kr-hg-speakable" onClick={() => speak(composeSyllable('ㅇ', v.char), KO)} title={`Nghe: ${composeSyllable('ㅇ', v.char)}`}>
                    <span className={`kr-hg-bar kr-hg-bar--${v.shape}`} />
                  </button>
                )}
                <span className="kr-hg-vbasic-text">
                  <span className="kr-hg-vbasic-title">
                    <b>{v.char}</b> {v.meaning}
                  </span>
                  <span className="kr-hg-vbasic-desc">{v.desc}</span>
                  {v.shape !== 'dot' && <span className="kr-hg-say">🔊 {composeSyllable('ㅇ', v.char)}</span>}
                </span>
              </div>
            ))}
          </div>
          {block.groups.map((g) => (
            <div key={g.title} className="kr-hg-vgroup">
              <div className="kr-hg-vgroup-head">
                <p className="kr-hg-vgroup-title">{g.title}</p>
                <PlayAll texts={g.items.map((it) => composeSyllable('ㅇ', it.char))} />
              </div>
              <p className="kr-hg-vgroup-note">
                <KoText text={g.note} />
              </p>
              <div className="kr-hg-vderived">
                {g.items.map((it) => (
                  <button key={it.char} type="button" className={`kr-glass kr-hg-vitem${it.yang ? ' kr-hg-vitem--yang' : ' kr-hg-vitem--yin'}`} onClick={() => speak(composeSyllable('ㅇ', it.char), KO)}>
                    <VowelGlyph item={it} />
                    <span className="kr-hg-derive-op">→</span>
                    <span className="kr-hg-derive-char kr-hg-derive-char--result">{it.char}</span>
                    <span className="kr-hg-vitem-tag">
                      {it.yang ? 'dương' : 'âm'} · 🔊 {composeSyllable('ㅇ', it.char)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
          <p className="kr-hg-footnote">
            <KoText text={block.footnote} />
          </p>
        </section>
      )
    case 'consonantPrinciple':
      return (
        <section>
          <p className="kr-section-title">{block.title}</p>
          <p className="kr-hg-intro">
            {block.intro} Phụ âm không đọc riêng được nên máy đọc kèm ㅏ (ㄱ → 가). Bấm từng chữ, hoặc 🔊 Cả dãy để nghe âm mạnh dần.
          </p>
          <div className="kr-hg-crows">
            {block.rows.map((r) => (
              <div key={r.basic} className="kr-glass kr-hg-crow">
                <span className="kr-hg-crow-head">
                  <span className="kr-hg-crow-group">{r.group}</span>
                  <PlayAll texts={r.chain.map((ch) => composeSyllable(ch, 'ㅏ'))} />
                </span>
                <span className="kr-hg-crow-organ">
                  <span className="kr-hg-crow-basic">{r.basic}</span> {r.organ}
                </span>
                <span className="kr-hg-derive-formula">
                  {r.chain.map((ch, j) => (
                    <span key={ch} className="kr-hg-derive-part">
                      {j > 0 && <span className="kr-hg-derive-op">+ nét →</span>}
                      <SpeakChar char={ch} say={composeSyllable(ch, 'ㅏ')} basic={j === 0} />
                    </span>
                  ))}
                </span>
                {r.note && <span className="kr-hg-derive-note">{r.note}</span>}
              </div>
            ))}
          </div>
          <div className="kr-hg-cextras">
            {block.extras.map((e) => (
              <div key={e.title} className="kr-glass kr-hg-cextra">
                <span className="kr-hg-vgroup-title">{e.title}</span>
                <span className="kr-hg-derive-note">{e.text}</span>
                <span className="kr-hg-derive-formula">
                  {e.chars.map((ch) => (
                    <SpeakChar key={ch} char={ch} say={composeSyllable(ch, 'ㅏ')} />
                  ))}
                  {e.chars.length > 1 && <PlayAll texts={e.chars.map((ch) => composeSyllable(ch, 'ㅏ'))} />}
                </span>
              </div>
            ))}
          </div>
        </section>
      )
    case 'structure':
      return (
        <section>
          <p className="kr-section-title">{block.title}</p>
          <div className="kr-hg-structure">
            {block.items.map((item) => (
              <div key={item.label} className="kr-glass kr-hg-structure-card">
                <span className="kr-hg-structure-label">{item.label}</span>
                <span className="kr-hg-structure-pattern">{item.pattern}</span>
                <span className="kr-hg-structure-examples">
                  {item.examples.map((e) => (
                    <button key={e} type="button" className="kr-hg-big-chip" onClick={() => speak(e, KO)}>
                      {e}
                    </button>
                  ))}
                </span>
                <span className="kr-hg-structure-note">
                  <KoText text={item.note} />
                </span>
              </div>
            ))}
          </div>
        </section>
      )
    case 'compare':
      return (
        <section>
          <p className="kr-section-title">{block.title}</p>
          <p className="kr-hg-intro">{block.intro}</p>
          <div className="kr-hg-table-wrap">
            <table className="kr-hg-table kr-hg-compare">
              <thead>
                <tr>
                  <th>Thường</th>
                  <th>Bật hơi</th>
                  <th>Căng</th>
                </tr>
              </thead>
              <tbody>
                {block.rows.map((r) => (
                  <tr key={r.plain}>
                    {[r.plain, r.aspirated, r.tense].map((s, i) => (
                      <td key={i}>
                        {s ? (
                          <button type="button" className="kr-hg-cell" onClick={() => speak(s, KO)}>
                            {s}
                          </button>
                        ) : (
                          <span className="kr-hg-cell-empty">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )
    case 'batchim':
      return (
        <section>
          <p className="kr-section-title">{block.title}</p>
          <p className="kr-hg-intro">{block.intro}</p>
          <div className="kr-hg-batchim">
            {block.groups.map((g) => (
              <div key={g.ipa} className="kr-glass kr-hg-batchim-row">
                <span className="kr-hg-batchim-finals">{g.finals}</span>
                <span className="kr-hg-batchim-arrow">→</span>
                <span className="kr-hg-batchim-sound">
                  <span className="kr-hg-batchim-ipa">{g.ipa}</span>
                  <span className="kr-hg-batchim-vi">{g.vi}</span>
                </span>
                <span className="kr-hg-batchim-examples">
                  {g.examples.map((e) => (
                    <button key={e} type="button" className="kr-hg-big-chip" onClick={() => speak(e, KO)}>
                      {e}
                    </button>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </section>
      )
    case 'reading':
      return (
        <section>
          <p className="kr-section-title">{block.title}</p>
          <p className="kr-hg-intro">{block.intro}</p>
          <div className="kr-glass kr-hg-reading">
            {block.lines.map((line, i) => (
              <div key={i} className="kr-hg-reading-line" style={{ fontSize: `${Math.max(16, 44 - i * 4)}px` }}>
                {line.map((s, j) => (
                  <button key={j} type="button" className="kr-hg-reading-item" onClick={() => speak(s, KO)}>
                    {s}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </section>
      )
    case 'builder':
      return <SyllableBuilder title={block.title} intro={block.intro} />
  }
}

// Tách chuỗi, cụm âm tiết Hàn (가–힣) thành nút bấm để nghe — dùng trong đoạn văn giải thích (vd "— 나, 너, 며").
function KoText({ text }: { text: string }) {
  const parts = text.split(/([가-힣]+)/)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <button key={i} type="button" className="kr-hg-ko-inline" onClick={() => speak(part, KO)} title={`Nghe: ${part}`}>
            {part}
          </button>
        ) : (
          part
        ),
      )}
    </>
  )
}

// Ô chữ cái bấm để nghe, dưới chữ hiện âm tiết đọc mẫu (ㄱ → 가).
function SpeakChar({ char, say, basic }: { char: string; say: string; basic?: boolean }) {
  return (
    <button type="button" className={`kr-hg-speakchar${basic ? ' kr-hg-speakchar--basic' : ''}`} onClick={() => speak(say, KO)} title={`Nghe: ${say}`}>
      <span className="kr-hg-speakchar-char">{char}</span>
      <span className="kr-hg-speakchar-say">{say}</span>
    </button>
  )
}

// Đọc nối tiếp cả nhóm (vd 가 → 카, 오 아 우 어) để nghe sự khác nhau liền mạch.
function PlayAll({ texts }: { texts: string[] }) {
  return (
    <button type="button" className="kr-hg-playall" onClick={() => speakQueue(texts.map((text) => ({ text, lang: KO, rate: 0.7 })))} title={`Nghe lần lượt: ${texts.join(' → ')}`}>
      🔊 Cả dãy
    </button>
  )
}

// Vẽ nguyên âm theo bản gốc: nét dài (ㅡ / ㅣ) + 1–2 chấm tròn ㆍ đúng vị trí.
function VowelGlyph({ item }: { item: VowelDerived }) {
  const dots = (
    <span className={`kr-hg-dots kr-hg-dots--${item.base === 'h' ? 'row' : 'col'}`}>
      {Array.from({ length: item.dots }, (_, i) => (
        <span key={i} className="kr-hg-dot" />
      ))}
    </span>
  )
  const bar = <span className={`kr-hg-bar kr-hg-bar--${item.base}`} />
  const first = item.side === 'top' || item.side === 'left'
  return (
    <span className={`kr-hg-vglyph kr-hg-vglyph--${item.base}`}>
      {first ? dots : bar}
      {first ? bar : dots}
    </span>
  )
}

function LetterCard({ letter }: { letter: HangulLetter }) {
  return (
    <button type="button" className="kr-glass kr-hg-letter" onClick={() => speak(letter.say, KO)} title={`Nghe: ${letter.say}`}>
      <span className="kr-hg-letter-char">{letter.char}</span>
      <span className="kr-hg-letter-ipa">{letter.ipa}</span>
      <span className="kr-hg-letter-vi">{letter.vi}</span>
      <span className="kr-hg-letter-say">🔊 {letter.say}</span>
    </button>
  )
}

function WordChip({ word }: { word: HangulWord }) {
  return (
    <div className="kr-glass kr-hg-word">
      <span className="kr-hg-word-ko">{word.ko}</span>
      <span className="kr-hg-word-vi">{word.vi}</span>
      <SpeakButton text={word.ko} lang={KO} className="kr-hg-word-speak" />
    </div>
  )
}

// Phụ âm đầu cho phép chọn: bỏ ㅇ ra cuối vì nó là "không có phụ âm". Phụ âm cuối: 7 âm đại diện + vài chữ hay gặp.
const BUILDER_FINALS = ['', 'ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ', 'ㄲ', 'ㅆ'].filter((f) => FINALS.includes(f))

function SyllableBuilder({ title, intro }: { title: string; intro: string }) {
  const [initial, setInitial] = useState('ㅎ')
  const [medial, setMedial] = useState('ㅏ')
  const [final, setFinal] = useState('ㄴ')
  const syllable = composeSyllable(initial, medial, final)
  const open = composeSyllable(initial, medial) // âm tiết chưa có patchim, vd 하 (để đọc 하 → 한)

  // Đổi 1 thành phần là đọc luôn âm tiết mới — nghe ngay sự khác nhau khi chỉ đổi 1 chữ (가 → 카 → 까, 안 → 앙…).
  function pick(next: { initial?: string; medial?: string; final?: string }) {
    const i = next.initial ?? initial
    const m = next.medial ?? medial
    const f = next.final ?? final
    if (next.initial !== undefined) setInitial(i)
    if (next.medial !== undefined) setMedial(m)
    if (next.final !== undefined) setFinal(f)
    speak(composeSyllable(i, m, f), KO)
  }

  // Đọc từng bước như cách dạy trong sách: nguyên âm → ghép phụ âm đầu → thêm patchim (아 → 하 → 한).
  function spellOut() {
    const steps = [composeSyllable('ㅇ', medial), open, final ? syllable : ''].filter((x, idx, arr) => x && arr.indexOf(x) === idx)
    speakQueue(steps.map((text) => ({ text, lang: KO, rate: 0.6 })))
  }

  return (
    <section>
      <p className="kr-section-title">{title}</p>
      <p className="kr-hg-intro">{intro}</p>
      <div className="kr-glass kr-hg-builder">
        <div className="kr-hg-builder-pickers">
          <Picker label="Phụ âm đầu" options={INITIALS} value={initial} onChange={(v) => pick({ initial: v })} sound={(o) => composeSyllable(o, 'ㅏ')} />
          <Picker label="Nguyên âm" options={MEDIALS} value={medial} onChange={(v) => pick({ medial: v })} sound={(o) => composeSyllable('ㅇ', o)} />
          <Picker label="Phụ âm cuối" options={BUILDER_FINALS} value={final} onChange={(v) => pick({ final: v })} sound={(o) => (o ? composeSyllable('ㅇ', 'ㅏ', o) : '아')} emptyLabel="—" />
          <p className="kr-hg-builder-tip">Bấm một chữ để chọn và nghe ngay âm tiết mới. Đổi từng chữ một (ㄱ → ㅋ → ㄲ, hoặc patchim ㄴ → ㅇ) để nghe sự khác nhau.</p>
        </div>
        <div className="kr-hg-builder-result">
          <span className="kr-hg-builder-formula">
            {initial} + {medial}
            {final ? ` + ${final}` : ''} =
          </span>
          <button type="button" className="kr-hg-builder-syllable" onClick={() => speak(syllable, KO)} title="Nghe">
            {syllable}
          </button>
          <div className="kr-hg-builder-actions">
            <button type="button" className="kr-hg-builder-btn" onClick={() => speak(syllable, KO)}>
              🔊 Nghe
            </button>
            <button type="button" className="kr-hg-builder-btn" onClick={() => speak(syllable, KO, 0.5)}>
              🐢 Chậm
            </button>
            <button type="button" className="kr-hg-builder-btn" onClick={spellOut}>
              🧩 Từng bước
            </button>
          </div>
          <span className="kr-hg-builder-steps">
            {[...new Set([composeSyllable('ㅇ', medial), open, final ? syllable : ''].filter(Boolean))].join(' → ')}
          </span>
        </div>
      </div>
    </section>
  )
}

// `sound` = âm tiết dùng để đọc mẫu cho từng chữ (hiện ở tooltip): phụ âm đọc kèm ㅏ, nguyên âm kèm ㅇ câm, patchim gắn sau 아.
function Picker({
  label,
  options,
  value,
  onChange,
  sound,
  emptyLabel,
}: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
  sound: (o: string) => string
  emptyLabel?: string
}) {
  return (
    <div className="kr-hg-picker">
      <span className="kr-hg-picker-label">{label}</span>
      <div className="kr-hg-picker-options">
        {options.map((o) => (
          <button key={o || 'none'} type="button" className={`kr-hg-picker-opt${o === value ? ' active' : ''}`} onClick={() => onChange(o)} title={`Đọc mẫu: ${sound(o)}`}>
            {o || emptyLabel}
          </button>
        ))}
      </div>
    </div>
  )
}
