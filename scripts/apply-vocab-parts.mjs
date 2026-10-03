// Gán cấu tạo từ (cột parts) cho thẻ từ vựng Korean/Chinese — hiện ở thẻ lớn (VocabStudy) và màn kết quả luyện gõ.
//   node --env-file=.env.local scripts/apply-vocab-parts.mjs <korean|chinese> [--dry-run]
// Dữ liệu: scripts/vocab-parts/<app>/L###.json = { lesson, words: { "<từ>": [[thành phần, chữ Hán | pinyin, Hán Việt, nghĩa], …] } }
//   - Korean: cột 2 là chữ Hán của thành phần Hán Hàn ('' nếu là từ thuần Hàn / ngoại lai)
//   - Chinese: cột 2 là pinyin của thành phần
// Mỗi từ chỉ cần soạn 1 lần (ở bài xuất hiện đầu tiên): script gán cho MỌI thẻ gốc cùng mặt chữ ở mọi bài.
// Từ không tách được (1 hình vị) thì không ghi — cột parts để trống.
import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'

const app = process.argv[2]
const dryRun = process.argv.includes('--dry-run')
if (!['korean', 'chinese'].includes(app)) {
  console.error('Cách dùng: node --env-file=.env.local scripts/apply-vocab-parts.mjs <korean|chinese> [--dry-run]')
  process.exit(1)
}

const dir = path.join('scripts', 'vocab-parts', app)
const byWord = new Map()
for (const file of fs.readdirSync(dir).filter((f) => /^L\d+\.json$/.test(f)).sort()) {
  const { words } = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
  for (const [word, rows] of Object.entries(words)) {
    const parts = rows.map(([p, second, hv, m]) => {
      const part = { p }
      if (second) part[app === 'korean' ? 'h' : 'py'] = second
      if (hv) part.hv = hv
      part.m = m
      return part
    })
    byWord.set(word, JSON.stringify(parts))
  }
}

const table = app === 'korean' ? 'korean_cards' : 'chinese_cards'
const frontCol = app === 'korean' ? 'front' : 'hanzi'
const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()
const { rows } = await client.query(`SELECT id, ${frontCol} AS front, parts FROM ${table} WHERE kind = 'vocab' AND learner_id IS NULL`)

let covered = 0
const used = new Set()
const ids = []
const values = []
for (const card of rows) {
  const parts = byWord.get(card.front) ?? ''
  if (parts) {
    covered++
    used.add(card.front)
  }
  if (parts === card.parts) continue
  ids.push(card.id)
  values.push(parts)
}
const changed = ids.length
// 1 câu UPDATE cho cả lô — DB ở xa (Railway), cập nhật từng thẻ rất chậm
if (!dryRun && changed > 0) {
  await client.query(`UPDATE ${table} AS c SET parts = v.parts FROM unnest($1::text[], $2::text[]) AS v(id, parts) WHERE c.id::text = v.id`, [ids, values])
}
await client.end()

const unused = [...byWord.keys()].filter((w) => !used.has(w))
console.log(`${app}: ${byWord.size} từ có dữ liệu, ${covered}/${rows.length} thẻ có cấu tạo từ, ${changed} thẻ ${dryRun ? 'sẽ' : 'đã'} cập nhật`)
if (unused.length) console.log(`Không khớp thẻ nào (${unused.length}):`, unused.join(', '))
