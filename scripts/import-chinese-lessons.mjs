// Nạp nội dung bài học tiếng Trung từ scripts/chinese-data/<cấp>/Lnn.json (chép từ ảnh trang giáo trình, xem
// chinese-render-pdf.mjs) vào app:
//   node --env-file=.env.local scripts/import-chinese-lessons.mjs [cấp=hsk3] [--dry-run]
// 1. Kiểm tra dữ liệu (trường bắt buộc, pinyin có dấu thanh, đánh dấu [n:…] trong hội thoại khớp legend…).
// 2. Upsert thẻ GỐC (learner_id NULL) vào chinese_cards với id cố định "<cấp>-L<bài>-<loại><stt>" — chạy lại bao nhiêu
//    lần cũng không nhân đôi thẻ và giữ nguyên tiến độ ôn tập (chinese_progress trỏ theo id). Thẻ gốc cũ của đúng bài đó
//    không còn trong JSON thì xoá. Không đụng thẻ do người học tự thêm.
// 3. Sinh src/lib/chinese/<cấp>.ts (tên bài + hội thoại) — lessons.ts / dialogues.ts gộp vào LESSON_META / DIALOGUES.
// --dry-run: chỉ kiểm tra + sinh file .ts, không ghi DB.
import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const level = args.find((a) => !a.startsWith('--')) ?? 'hsk3'
const DIR = path.join('scripts/chinese-data', level)
const OUT = path.join('src/lib/chinese', `${level}.ts`)
const CONST = level.toUpperCase()

const errors = []
const err = (where, msg) => errors.push(`${where}: ${msg}`)
const TONE = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/
const pad = (n) => String(n).padStart(2, '0')

const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => /^L\d+\.json$/.test(f)).sort() : []
if (files.length === 0) {
  console.error(`Không có file bài nào trong ${DIR}`)
  process.exit(1)
}

const lessons = []
const cards = []
for (const f of files) {
  const L = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'))
  const where = `${f} (bài ${L.bookLesson})`
  if (!Number.isInteger(L.lesson) || !L.title) err(where, 'thiếu lesson/title')
  const prefix = `${level}-L${L.lesson}-`
  let order = 0
  const push = (id, kind, c) => cards.push({ id: prefix + id, lesson: L.lesson, kind, sortOrder: kind === 'grammar' ? 1000 + order++ : order++, note: '', example: '', theory: '', exampleDetail: '[]', ...c })
  const checkWord = (w, i, sec) => {
    if (!w.hanzi || !w.pinyin || !w.meaning) err(where, `${sec} #${i + 1} thiếu hanzi/pinyin/meaning (${JSON.stringify(w)})`)
    else if (!TONE.test(w.pinyin) && !/^[a-z\s.…'-]+$/i.test(w.pinyin)) err(where, `${sec} #${i + 1} pinyin lạ: ${w.pinyin}`)
  }

  ;(L.vocab ?? []).forEach((w, i) => {
    checkWord(w, i, 'vocab')
    const note = [w.pos, w.hanViet && `Hán Việt: ${w.hanViet}`].filter(Boolean).join(' · ')
    push(`v${pad(i + 1)}`, 'vocab', { hanzi: w.hanzi, pinyin: w.pinyin, meaning: w.meaning, note })
  })
  ;(L.expand ?? []).forEach((w, i) => {
    checkWord(w, i, 'expand')
    push(`x${pad(i + 1)}`, 'vocab', { hanzi: w.hanzi, pinyin: w.pinyin, meaning: w.meaning })
  })
  if (L.tree) {
    checkWord(L.tree, 0, 'tree')
    push('t00', 'vocab', { hanzi: L.tree.hanzi, pinyin: L.tree.pinyin, meaning: L.tree.meaning })
    ;(L.tree.words ?? []).forEach((w, i) => {
      checkWord(w, i, 'tree.words')
      push(`t${pad(i + 1)}`, 'vocab', { hanzi: w.hanzi, pinyin: w.pinyin, meaning: w.meaning })
    })
  }
  order = 0
  ;(L.grammar ?? []).forEach((g, i) => {
    if (!g.hanzi || !g.meaning || !g.theory) err(where, `grammar ${g.np ?? i + 1} thiếu hanzi/meaning/theory`)
    const ex = g.examples ?? []
    ex.forEach((e, j) => {
      if (!e.zh || !e.vi) err(where, `grammar ${g.np} ví dụ ${j + 1} thiếu zh/vi`)
    })
    push(`g${pad(i + 1)}`, 'grammar', {
      hanzi: g.hanzi,
      pinyin: g.pinyin ?? '',
      meaning: g.meaning,
      note: g.note ?? '',
      example: ex.map((e) => e.zh).join('\n'),
      theory: g.theory,
      exampleDetail: JSON.stringify(ex.map((e) => ({ zh: e.zh, pinyin: e.pinyin ?? '', vi: e.vi, vocab: e.vocab ?? '', breakdown: e.breakdown ?? '' }))),
    })
  })

  // Hội thoại: mỗi số [n:…] dùng trong câu phải có trong legend (n = 0 là từ chêm trong "Chém gió song ngữ")
  const dialogues = (L.dialogues ?? []).map((d, di) => {
    const legendNs = new Set((d.legend ?? []).map((x) => x.n))
    d.lines.forEach((line, li) => {
      if (!line.zh) err(where, `hội thoại ${di + 1} câu ${li + 1} thiếu zh`)
      for (const field of ['zh', 'py', 'vi']) {
        const text = line[field] ?? ''
        if ((text.match(/\[/g) ?? []).length !== (text.match(/\]/g) ?? []).length) err(where, `hội thoại ${di + 1} câu ${li + 1} (${field}) ngoặc [ ] lệch`)
        for (const m of text.matchAll(/\[(\d+):/g)) {
          const n = Number(m[1])
          if (n !== 0 && !legendNs.has(n)) err(where, `hội thoại ${di + 1} câu ${li + 1} dùng [${n}:] nhưng legend không có`)
        }
      }
      if (d.variant !== 'bilingual' && (!line.py || !line.vi)) err(where, `hội thoại ${di + 1} câu ${li + 1} thiếu py/vi`)
    })
    return { ...(d.title ? { title: d.title } : {}), ...(d.variant ? { variant: d.variant } : {}), lines: d.lines, ...(d.legend ? { legend: d.legend } : {}), ...(d.note ? { note: d.note } : {}) }
  })
  lessons.push({ lesson: L.lesson, title: L.title, titleVi: L.titleVi, dialogues })
}

const ids = new Set()
for (const c of cards) {
  if (ids.has(c.id)) err(c.id, 'trùng id')
  ids.add(c.id)
}
if (errors.length) {
  console.error(`LỖI dữ liệu (${errors.length}):\n  ` + errors.join('\n  '))
  process.exit(1)
}

// Sinh file .ts
const meta = Object.fromEntries(lessons.map((l) => [l.lesson, { level, title: l.title, ...(l.titleVi ? { titleVi: l.titleVi } : {}) }]))
const dlg = Object.fromEntries(lessons.filter((l) => l.dialogues.length).map((l) => [l.lesson, l.dialogues]))
fs.writeFileSync(
  OUT,
  `// SINH TỰ ĐỘNG bởi scripts/import-chinese-lessons.mjs từ scripts/chinese-data/${level}/*.json — đừng sửa tay, sửa JSON rồi chạy lại.
import type { Dialogue } from './dialogues'
import type { LessonMeta } from './lessons'

export const ${CONST}_LESSON_META: Record<number, LessonMeta> = ${JSON.stringify(meta, null, 2)}

export const ${CONST}_DIALOGUES: Record<number, Dialogue[]> = ${JSON.stringify(dlg, null, 2)}
`,
)
const byKind = (k) => cards.filter((c) => c.kind === k).length
console.log(`${lessons.length} bài · ${byKind('vocab')} thẻ từ vựng · ${byKind('grammar')} thẻ ngữ pháp → ${OUT}`)

if (dryRun) {
  console.log('--dry-run: bỏ qua ghi DB')
  process.exit(0)
}
if (!process.env.DATABASE_URL) {
  console.error('Thiếu DATABASE_URL — chạy: node --env-file=.env.local scripts/import-chinese-lessons.mjs')
  process.exit(1)
}

// Câu ví dụ của từ vựng được thêm riêng (scripts/apply-vocab-examples.mjs) — JSON bài học để trống thì giữ nguyên bản

// đang có trong DB, không ghi đè bằng rỗng.

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()
try {
  await client.query('BEGIN')
  for (const c of cards) {
    await client.query(
      `INSERT INTO chinese_cards (id, learner_id, kind, lesson, hanzi, pinyin, meaning, note, example, theory, example_detail, sort_order)
       VALUES ($1, NULL, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO UPDATE SET kind = $2, lesson = $3, hanzi = $4, pinyin = $5, meaning = $6, note = $7, example = CASE WHEN $8 = '' THEN chinese_cards.example ELSE $8 END,
         theory = $9, example_detail = CASE WHEN $10 = '[]' THEN chinese_cards.example_detail ELSE $10 END, sort_order = $11`,
      [c.id, c.kind, c.lesson, c.hanzi, c.pinyin, c.meaning, c.note, c.example, c.theory, c.exampleDetail, c.sortOrder],
    )
  }
  let removed = 0
  for (const l of lessons) {
    const keep = cards.filter((c) => c.lesson === l.lesson).map((c) => c.id)
    const r = await client.query(`DELETE FROM chinese_cards WHERE learner_id IS NULL AND id LIKE $1 AND NOT (id = ANY($2))`, [`${level}-L${l.lesson}-%`, keep])
    removed += r.rowCount
  }
  await client.query('COMMIT')
  console.log(`DB: upsert ${cards.length} thẻ, xoá ${removed} thẻ cũ không còn trong JSON`)
} catch (e) {
  await client.query('ROLLBACK')
  throw e
} finally {
  await client.end()
}
