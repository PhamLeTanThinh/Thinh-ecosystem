// Nạp nội dung bài học tiếng Hàn từ scripts/korean-data/<cấp>/Lnn.json (chép từ ảnh trang giáo trình "서울대 한국어
// 1A/1B" — PDF render bằng scripts/render-pdf-browser.mjs vì @napi-rs/canvas bị crash với 2 file scan này) vào app:
//   node --env-file=.env.local scripts/import-korean-lessons.mjs [cấp=topik1] [--dry-run]
// 1. Kiểm tra dữ liệu (trường bắt buộc, câu ví dụ có chữ Hangul, số bài không trùng TOPIK II 1-18…).
// 2. Upsert thẻ GỐC (learner_id NULL) vào korean_cards với id cố định "<cấp>-L<bài>-<loại><stt>" — chạy lại bao nhiêu
//    lần cũng không nhân đôi thẻ và giữ nguyên tiến độ ôn tập (korean_progress trỏ theo id). Thẻ gốc cũ của đúng bài
//    đó không còn trong JSON thì xoá. Không đụng thẻ do người học tự thêm hay thẻ TOPIK II (seed.ts).
// 3. Sinh src/lib/korean/<cấp>.ts (tên bài + bản dịch) — lessons.ts gộp vào LESSON_META.
// --dry-run: chỉ kiểm tra + sinh file .ts, không ghi DB.
import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const level = args.find((a) => !a.startsWith('--')) ?? 'topik1'
const DIR = path.join('scripts/korean-data', level)
const OUT = path.join('src/lib/korean', `${level}.ts`)
const CONST = level.toUpperCase()
const HANGUL = /[가-힣]/

const errors = []
const err = (where, msg) => errors.push(`${where}: ${msg}`)
const pad = (n) => String(n).padStart(2, '0')

const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => /^L\d+\.json$/.test(f)).sort() : []
if (files.length === 0) {
  console.error(`Không có file bài nào trong ${DIR}`)
  process.exit(1)
}

// Bảng từ vựng cuối sách (glossary-<book>.json: [hangul, english, trang đầu tiên, nghĩa Việt]) — bài nào không tự
// khai `vocab` thì nhận các từ có trang nằm trong khoảng `pages` của bài đó.
const glossaries = {}
for (const g of fs.readdirSync(DIR).filter((x) => /^glossary-.+\.json$/.test(x))) {
  const data = JSON.parse(fs.readFileSync(path.join(DIR, g), 'utf8'))
  glossaries[data.book] = data.entries
}

// Hội thoại 말하기 (dialogues-<book>.json: { lessons: { <bookLesson>: Dialogue[] } }) — gộp vào mọi bài theo bookLesson.
// Quy tắc tô màu ngữ pháp trong hội thoại (grammar-marks.json: { lessons: { <bookLesson>: [n, regex][] } }).
const marksPath = path.join(DIR, 'grammar-marks.json')
const grammarMarks = fs.existsSync(marksPath) ? JSON.parse(fs.readFileSync(marksPath, 'utf8')).lessons : {}

// Bọc các đoạn khớp regex thành [n:đoạn] (cú pháp của DialogueSection), bỏ qua phần đã được bọc trước đó.
function applyMarks(text, rules, used) {
  let out = text
  for (const [n, pattern] of rules) {
    const re = new RegExp(pattern, 'g')
    out = out
      .split(/(\[\d:[^\]]*\])/)
      .map((part) => (/^\[\d:/.test(part) ? part : part.replace(re, (m) => { used.add(n); return `[${n}:${m}]` })))
      .join('')
  }
  return out
}

const dialoguesByBookLesson = {}
for (const g of fs.readdirSync(DIR).filter((x) => /^dialogues-.+.json$/.test(x))) {
  Object.assign(dialoguesByBookLesson, JSON.parse(fs.readFileSync(path.join(DIR, g), 'utf8')).lessons)
}

const lessons = []
const cards = []
for (const f of files) {
  const L = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'))
  if (!L.vocab) {
    const entries = glossaries[L.book]
    if (!entries || !Array.isArray(L.pages)) err(f, `không có vocab và không tìm thấy glossary-${L.book}.json / pages`)
    else L.vocab = entries.filter(([, , page]) => page >= L.pages[0] && page <= L.pages[1]).map(([ko, en, , vi]) => ({ ko, en, vi }))
  }
  const where = `${f} (bài ${L.bookLesson})`
  if (!Number.isInteger(L.lesson) || L.lesson <= 18 || !L.title) err(where, 'thiếu title hoặc lesson không hợp lệ (TOPIK I phải > 18, không trùng Seoul Korean 2)')
  const prefix = `${level}-L${L.lesson}-`
  let order = 0
  const push = (id, kind, c) =>
    cards.push({ id: prefix + id, lesson: L.lesson, kind, sortOrder: kind === 'grammar' ? 1000 + order++ : order++, note: '', example: '', theory: '', exampleDetail: '[]', ...c })

  const seen = new Set()
  ;(L.vocab ?? []).forEach((w, i) => {
    if (!w.ko || !w.vi) err(where, `vocab #${i + 1} thiếu ko/vi (${JSON.stringify(w)})`)
    else if (!HANGUL.test(w.ko)) err(where, `vocab #${i + 1} không có chữ Hangul: ${w.ko}`)
    if (seen.has(w.ko)) err(where, `vocab trùng: ${w.ko}`)
    seen.add(w.ko)
    push(`v${pad(i + 1)}`, 'vocab', { front: w.ko, meaning: w.vi, note: w.en ?? '' })
  })
  order = 0
  ;(L.grammar ?? []).forEach((g, i) => {
    if (!g.front || !g.meaning || !g.theory) err(where, `grammar #${i + 1} thiếu front/meaning/theory`)
    const ex = g.examples ?? []
    if (ex.length === 0) err(where, `grammar ${g.front} không có ví dụ`)
    ex.forEach((e, j) => {
      if (!e.ko || !e.vi) err(where, `grammar ${g.front} ví dụ ${j + 1} thiếu ko/vi`)
      else if (!HANGUL.test(e.ko)) err(where, `grammar ${g.front} ví dụ ${j + 1} không có chữ Hangul`)
    })
    push(`g${pad(i + 1)}`, 'grammar', {
      front: g.front,
      meaning: g.meaning,
      note: g.note ?? '',
      example: ex.map((e) => e.ko).join('\n'),
      theory: g.theory,
      exampleDetail: JSON.stringify(ex.map((e) => ({ ko: e.ko, vi: e.vi, vocab: e.vocab ?? '', breakdown: e.breakdown ?? '' }))),
    })
  })
  // Dialogue dùng chung với Chinese (lib/chinese/dialogues.ts): câu tiếng Hàn đặt ở trường `zh`, không có `py`.
  const dialogues = (dialoguesByBookLesson[L.bookLesson] ?? []).map((d, di) => {
    d.lines.forEach((line, li) => {
      if (!line.ko || !line.vi) err(where, `hội thoại ${di + 1} câu ${li + 1} thiếu ko/vi`)
      else if (!HANGUL.test(line.ko)) err(where, `hội thoại ${di + 1} câu ${li + 1} không có chữ Hangul`)
    })
    const rules = grammarMarks[L.bookLesson] ?? []
    const used = new Set()
    const lines = d.lines.map((line) => ({ who: line.who ?? '', zh: applyMarks(line.ko, rules, used), vi: line.vi }))
    rules.forEach(([n]) => { if (!L.grammar?.[n - 1]) err(where, `grammar-marks: không có điểm ngữ pháp số ${n}`) })
    const legend = [...used].sort((a, b) => a - b).map((n) => ({ n, label: L.grammar[n - 1].front, np: `NP ${L.bookLesson}.${n}` }))
    return { title: d.title, lines, ...(legend.length ? { legend } : {}) }
  })
  lessons.push({ lesson: L.lesson, title: L.title, titleVi: L.titleVi, dialogues })
}

const ids = new Set()
for (const c of cards) {
  if (ids.has(c.id)) err(c.id, 'trùng id')
  ids.add(c.id)
}
const nums = lessons.map((l) => l.lesson)
if (new Set(nums).size !== nums.length) err('lessons', 'trùng số bài')
if (errors.length) {
  console.error(`LỖI dữ liệu (${errors.length}):\n  ` + errors.join('\n  '))
  process.exit(1)
}

const dlg = Object.fromEntries(lessons.filter((l) => l.dialogues.length).map((l) => [l.lesson, l.dialogues]))
const meta = Object.fromEntries(lessons.map((l) => [l.lesson, { level, title: l.title, ...(l.titleVi ? { titleVi: l.titleVi } : {}) }]))
fs.writeFileSync(
  OUT,
  `// SINH TỰ ĐỘNG bởi scripts/import-korean-lessons.mjs từ scripts/korean-data/${level}/*.json — đừng sửa tay, sửa JSON rồi chạy lại.
import type { Dialogue } from '@/lib/chinese/dialogues'
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
  console.error('Thiếu DATABASE_URL — chạy: node --env-file=.env.local scripts/import-korean-lessons.mjs')
  process.exit(1)
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()
try {
  await client.query('BEGIN')
  for (const c of cards) {
    await client.query(
      `INSERT INTO korean_cards (id, learner_id, kind, lesson, front, meaning, note, example, theory, example_detail, sort_order)
       VALUES ($1, NULL, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (id) DO UPDATE SET kind = $2, lesson = $3, front = $4, meaning = $5, note = $6, example = $7,
         theory = $8, example_detail = $9, sort_order = $10`,
      [c.id, c.kind, c.lesson, c.front, c.meaning, c.note, c.example, c.theory, c.exampleDetail, c.sortOrder],
    )
  }
  let removed = 0
  for (const l of lessons) {
    const keep = cards.filter((c) => c.lesson === l.lesson).map((c) => c.id)
    const r = await client.query(`DELETE FROM korean_cards WHERE learner_id IS NULL AND id LIKE $1 AND NOT (id = ANY($2))`, [`${level}-L${l.lesson}-%`, keep])
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
