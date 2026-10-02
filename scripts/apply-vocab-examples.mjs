// Nạp câu ví dụ cho thẻ từ vựng Korean / Chinese từ scripts/vocab-examples/<app>/L<lesson>.json vào DB.
//   node --env-file=.env.local scripts/apply-vocab-examples.mjs <korean|chinese> [lesson…] [--dry-run]
// File JSON: { lesson, words: { <từ>: [câu ví dụ, dịch Việt, từ khoá ảnh?] } }   (Korean)
//                             { <từ>: [câu ví dụ, pinyin, dịch Việt, từ khoá ảnh?] } (Chinese)
// Khớp thẻ theo (lesson, từ) — bỏ khoảng trắng khi so. Từ khoá ảnh (tiếng Anh, chỉ có ở danh từ cụ thể) do
// scripts/fetch-vocab-images.mjs dùng. Thẻ được ghi: example = câu ví dụ, example_detail = [{ko|zh, pinyin, vi}].
// Khoá "topics" (tuỳ chọn): { <tên nhóm>: [từ…] } — gom từ theo chủ đề trong bài (cột topic; từ không có trong nhóm nào → rỗng,
// danh sách học xếp vào "Khác"). --topics-only: chỉ ghi nhóm, không ghi lại câu ví dụ (nhanh hơn).
import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'

const args = process.argv.slice(2)
const app = args[0]
const only = new Set(args.slice(1).filter((a) => /^\d+$/.test(a)).map(Number))
const dryRun = args.includes('--dry-run')
const topicsOnly = args.includes('--topics-only')
if (!['korean', 'chinese'].includes(app)) {
  console.error('Cách dùng: node --env-file=.env.local scripts/apply-vocab-examples.mjs <korean|chinese> [lesson…] [--dry-run]')
  process.exit(1)
}

export function loadExamples(appName) {
  const dir = path.join('scripts', 'vocab-examples', appName)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => /^L\d+\.json$/.test(f))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))
}

const norm = (s) => s.replace(/\s+/g, '')
const files = loadExamples(app).filter((f) => only.size === 0 || only.has(f.lesson))
const table = app === 'korean' ? 'korean_cards' : 'chinese_cards'
const frontCol = app === 'korean' ? 'front' : 'hanzi'

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()
let updated = 0
for (const file of files) {
  const { rows } = await client.query(
    `SELECT id, ${frontCol} AS front FROM ${table} WHERE kind = 'vocab' AND learner_id IS NULL AND lesson = $1`,
    [file.lesson],
  )
  // Một bài có thể chứa cùng một từ nhiều lần (từ lặp trong glossary) → cập nhật tất cả
  const byFront = new Map()
  for (const r of rows) byFront.set(norm(r.front), [...(byFront.get(norm(r.front)) ?? []), r])
  const unmatched = []
  for (const [word, entry] of topicsOnly ? [] : Object.entries(file.words)) {
    const cards = byFront.get(norm(word))
    if (!cards) {
      unmatched.push(word)
      continue
    }
    const detail =
      app === 'korean'
        ? { ko: entry[0], vi: entry[1], vocab: '', breakdown: '' }
        : { zh: entry[0], pinyin: entry[1], vi: entry[2], vocab: '', breakdown: '' }
    for (const card of cards) {
      if (!dryRun) await client.query(`UPDATE ${table} SET example = $1, example_detail = $2 WHERE id = $3`, [entry[0], JSON.stringify([detail]), card.id])
      updated++
    }
  }
  if (file.topics) {
    const topicOf = new Map()
    const badTopic = []
    for (const [topic, words] of Object.entries(file.topics)) {
      for (const w of words) {
        if (!byFront.has(norm(w))) badTopic.push(w)
        topicOf.set(norm(w), topic)
      }
    }
    if (!dryRun) {
      await client.query(
        `UPDATE ${table} AS t SET topic = v.topic FROM unnest($1::text[], $2::text[]) AS v(id, topic) WHERE t.id = v.id`,
        [rows.map((r) => r.id), rows.map((r) => topicOf.get(norm(r.front)) ?? '')],
      )
    }
    const loose = rows.filter((r) => !topicOf.has(norm(r.front))).map((r) => r.front)
    console.log(`  nhóm: ${Object.keys(file.topics).length}` + (badTopic.length ? ` · từ trong nhóm không khớp thẻ: ${badTopic.join(', ')}` : '') + (loose.length ? ` · chưa xếp nhóm: ${loose.join(', ')}` : ''))
  }
  const missing = rows.filter((r) => !Object.keys(file.words).some((w) => norm(w) === norm(r.front))).map((r) => r.front)
  console.log(`Bài ${file.lesson}: ${Object.keys(file.words).length} câu` + (unmatched.length ? ` · không khớp thẻ: ${unmatched.join(', ')}` : '') + (missing.length ? ` · thẻ chưa có câu: ${missing.join(', ')}` : ''))
}
await client.end()
console.log(`${dryRun ? '(dry-run) ' : ''}Cập nhật ${updated} thẻ`)
