// Sinh src/lib/korean/topik2-dialogues.ts (hội thoại 말하기 của "서울대 한국어 2A/2B" cho 18 bài TOPIK II) từ
// scripts/korean-data/topik2/dialogues-2a.json, dialogues-2b.json và grammar-marks.json:
//   node scripts/import-korean-topik2-dialogues.mjs
// Thẻ từ vựng / ngữ pháp TOPIK II vẫn nằm trong seed.ts + DB như cũ — script này chỉ sinh hội thoại (không ghi DB).
import fs from 'node:fs'
import path from 'node:path'

const DIR = 'scripts/korean-data/topik2'
const OUT = 'src/lib/korean/topik2-dialogues.ts'
const HANGUL = /[\uac00-\ud7a3]/

const errors = []
const dialogues = {}
for (const f of ['dialogues-2a.json', 'dialogues-2b.json']) Object.assign(dialogues, JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')).lessons)
const marks = JSON.parse(fs.readFileSync(path.join(DIR, 'grammar-marks.json'), 'utf8')).lessons

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

const out = {}
let marked = 0
let total = 0
for (const [lesson, list] of Object.entries(dialogues)) {
  const rules = marks[lesson] ?? []
  out[lesson] = list.map((d, di) => {
    const used = new Set()
    const lines = d.lines.map((line, li) => {
      if (!line.ko || !line.vi || !HANGUL.test(line.ko)) errors.push(`bài ${lesson} hội thoại ${di + 1} câu ${li + 1} thiếu ko/vi`)
      const zh = applyMarks(line.ko, rules, used)
      total++
      if (zh !== line.ko) marked++
      return { who: line.who ?? '', zh, vi: line.vi }
    })
    const legend = rules.filter(([n]) => used.has(n)).sort((a, b) => a[0] - b[0]).map(([n, , label]) => ({ n, label, np: `NP ${lesson}.${n}` }))
    return { title: d.title, lines, ...(legend.length ? { legend } : {}) }
  })
}
if (errors.length) {
  console.error('LỖI:\n  ' + errors.join('\n  '))
  process.exit(1)
}
fs.writeFileSync(
  OUT,
  `// SINH TỰ ĐỘNG bởi scripts/import-korean-topik2-dialogues.mjs từ scripts/korean-data/topik2/*.json — đừng sửa tay.
import type { Dialogue } from '@/lib/chinese/dialogues'

export const TOPIK2_DIALOGUES: Record<number, Dialogue[]> = ${JSON.stringify(out, null, 2)}
`,
)
console.log(`${Object.keys(out).length} bài · ${Object.values(out).flat().length} hội thoại · ${marked}/${total} câu tô màu → ${OUT}`)
