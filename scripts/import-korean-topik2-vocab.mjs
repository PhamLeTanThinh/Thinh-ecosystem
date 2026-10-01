// Nhập từ vựng TOPIK II bổ sung (scripts/korean-data/topik2/vocab-supplement.json) vào korean_cards.
//   node --env-file=.env.local scripts/import-korean-topik2-vocab.mjs [--dry-run]
// Thẻ gốc TOPIK II (Notion, lib/korean/seed.ts) có id ngẫu nhiên nên không đụng tới; thẻ bổ sung dùng id cố định
// topik2-L<n>-gv<###> để chạy lại nhiều lần vẫn upsert đúng thẻ (không nhân đôi). Bỏ qua từ đã có trong bài đó.
import fs from 'node:fs'
import pg from 'pg'

const dryRun = process.argv.includes('--dry-run')
const { entries } = JSON.parse(fs.readFileSync('scripts/korean-data/topik2/vocab-supplement.json', 'utf8'))

const errors = []
const seen = new Set()
for (const [i, e] of entries.entries()) {
  const [lesson, ko, en, vi] = e
  if (!Number.isInteger(lesson) || lesson < 1 || lesson > 18) errors.push(`#${i} lesson sai: ${lesson}`)
  if (!ko || !en || !vi) errors.push(`#${i} thiếu trường: ${JSON.stringify(e)}`)
  const key = `${lesson}|${ko}`
  if (seen.has(key)) errors.push(`#${i} trùng: ${key}`)
  seen.add(key)
}
if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

const counters = {}
const cards = entries.map(([lesson, ko, en, vi]) => {
  counters[lesson] = (counters[lesson] ?? 0) + 1
  const n = counters[lesson]
  return { id: `topik2-L${lesson}-gv${String(n).padStart(3, '0')}`, lesson, front: ko, meaning: vi, note: en, sortOrder: 1000 + n }
})
console.log(`${cards.length} thẻ từ vựng bổ sung · ${Object.keys(counters).length} bài`)
if (dryRun) process.exit(0)

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()
try {
  await client.query('BEGIN')
  // Bỏ qua từ đã tồn tại trong bài (thẻ gốc) — so theo front, bỏ khoảng trắng.
  const { rows } = await client.query(
    "SELECT lesson, replace(front, ' ', '') AS f FROM korean_cards WHERE learner_id IS NULL AND kind = 'vocab' AND lesson BETWEEN 1 AND 18 AND id NOT LIKE 'topik2-L%-gv%'",
  )
  const existing = new Set(rows.map((r) => `${r.lesson}|${r.f}`))
  let upserted = 0
  let skipped = 0
  for (const c of cards) {
    if (existing.has(`${c.lesson}|${c.front.replace(/ /g, '')}`)) {
      skipped++
      continue
    }
    await client.query(
      `INSERT INTO korean_cards (id, learner_id, kind, lesson, front, meaning, note, example, theory, example_detail, sort_order)
       VALUES ($1, NULL, 'vocab', $2, $3, $4, $5, '', '', '[]', $6)
       ON CONFLICT (id) DO UPDATE SET lesson = $2, front = $3, meaning = $4, note = $5, sort_order = $6`,
      [c.id, c.lesson, c.front, c.meaning, c.note, c.sortOrder],
    )
    upserted++
  }
  await client.query('COMMIT')
  console.log(`DB: upsert ${upserted} thẻ, bỏ qua ${skipped} thẻ đã có trong bài`)
} catch (e) {
  await client.query('ROLLBACK')
  throw e
} finally {
  await client.end()
}
