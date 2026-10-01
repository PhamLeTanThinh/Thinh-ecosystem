// Gán từ loại (cột pos) cho thẻ từ vựng Korean/Chinese — hiện thành nhãn màu trong danh sách học (VocabStudy).
//   node --env-file=.env.local scripts/apply-vocab-pos.mjs <korean|chinese> [--dry-run]
// Thứ tự: ngoại lệ trong scripts/vocab-examples/<app>/pos.json (khoá 'từ' hoặc 'từ@bài') → quy tắc theo dữ liệu thẻ:
//   - Chinese: tiền tố ghi chú sẵn có ("dt.", "đt., tt."…) của thẻ, hoặc của thẻ cùng chữ ở bài khác; ghi chú mô tả (bổ ngữ kết quả, động từ ly hợp…),
//     chữ đơn mà nghĩa chỉ là 1 âm Hán Việt viết hoa (vd 主 = "Chủ", đầu chuỗi từ ghép) → morph.
//   - Korean: có dấu cách + đuôi 다 → phrase; đuôi 다 với nghĩa EN "to be …" → adj, còn lại → v.
//   - Không khớp gì → n.
import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'

const app = process.argv[2]
const dryRun = process.argv.includes('--dry-run')
if (!['korean', 'chinese'].includes(app)) {
  console.error('Cách dùng: node --env-file=.env.local scripts/apply-vocab-pos.mjs <korean|chinese> [--dry-run]')
  process.exit(1)
}

const overrides = new Map()
const raw = JSON.parse(fs.readFileSync(path.join('scripts', 'vocab-examples', app, 'pos.json'), 'utf8'))
for (const [pos, words] of Object.entries(raw)) {
  if (pos.startsWith('_')) continue
  for (const w of words) overrides.set(w, pos)
}

const ZH_NOTE_POS = { 'dt.': 'n', 'đt.': 'v', 'tt.': 'adj', 'phó.': 'adv', 'liên.': 'conj', 'lượng.': 'mw', 'đại.': 'pron', 'giới.': 'prep', 'trợ.': 'part', 'cụm.': 'phrase', 'đtnn.': 'v', 'số.': 'num', 'thán.': 'interj', 'trạng.': 'adv' }

function zhNotePos(note) {
  const tokens = note.split(' · ')[0].split(', ')
  return tokens.every((t) => t in ZH_NOTE_POS) ? [...new Set(tokens.map((t) => ZH_NOTE_POS[t]))].join(',') : null
}

// Từ loại ghi trong ghi chú của thẻ cùng chữ ở bài khác — thẻ ôn tập/mở rộng thường không ghi lại.
const siblingPos = new Map()

function classifyChinese(card) {
  const own = zhNotePos(card.note)
  if (own) return own
  if (siblingPos.has(card.front)) return siblingPos.get(card.front)
  if (/^(động từ (xu hướng|ly hợp)|bổ ngữ kết quả)/.test(card.note)) return 'v'
  if (/^thành ngữ/.test(card.note)) return 'idiom'
  if (/^cách nói trang trọng/.test(card.note)) return 'n'
  if ([...card.front].length === 1 && /^[A-ZĐÂĂÊÔƠƯÁÀẢÃẠ][^\s,;()]*$/u.test(card.meaning.trim())) return 'morph'
  return 'n'
}

function classifyKorean(card) {
  const en = card.note.trim().toLowerCase()
  if (/다$/.test(card.front)) {
    if (/\s/.test(card.front)) return 'phrase'
    return en.startsWith('to be ') ? 'adj' : 'v'
  }
  return 'n'
}

const table = app === 'korean' ? 'korean_cards' : 'chinese_cards'
const frontCol = app === 'korean' ? 'front' : 'hanzi'
const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()
const { rows } = await client.query(
  `SELECT id, lesson, ${frontCol} AS front, meaning, note, pos FROM ${table} WHERE kind = 'vocab' AND learner_id IS NULL`,
)

if (app === 'chinese') {
  for (const card of rows) {
    const pos = zhNotePos(card.note)
    if (pos && !siblingPos.has(card.front)) siblingPos.set(card.front, pos)
  }
}

const used = new Set()
const counts = {}
let changed = 0
for (const card of rows) {
  const key = [`${card.front}@${card.lesson}`, card.front].find((k) => overrides.has(k))
  if (key) used.add(key)
  const pos = key ? overrides.get(key) : app === 'korean' ? classifyKorean(card) : classifyChinese(card)
  for (const p of pos.split(',')) counts[p] = (counts[p] ?? 0) + 1
  if (pos === card.pos) continue
  changed++
  if (!dryRun) await client.query(`UPDATE ${table} SET pos = $1 WHERE id = $2`, [pos, card.id])
}
await client.end()

const unused = [...overrides.keys()].filter((k) => !used.has(k))
console.log(Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([p, n]) => `${p}:${n}`).join('  '))
if (unused.length) console.log(`Khoá ngoại lệ không khớp thẻ nào: ${unused.join(', ')}`)
console.log(`${dryRun ? '(dry-run) ' : ''}Cập nhật ${changed}/${rows.length} thẻ`)
