// Đổi JSON bài Dictation tải từ LMS (scripts/lms-download-dictation.console.js) thành data của app.
//   node scripts/import-lms-dictation.mjs [thư-mục-json = scripts/lms-dictation]
// Ghi src/data/ielts/dictation/lms.ts (ghi đè toàn bộ mỗi lần chạy). Mỗi bài Dictation = 1 section của 1 đề CAM: các câu có mốc
// start/end (ms) tính trên file âm thanh của section — chính là file mp3 đã tải cho đề Listening tương ứng
// (public/ielts/audio/<đề>/s<N>.mp3), nên không tải thêm âm thanh; thiếu file cục bộ thì app lùi về CDN của LMS.
import fs from 'node:fs'
import path from 'node:path'

const dir = process.argv[2] ?? 'scripts/lms-dictation'
const OUT = 'src/data/ielts/dictation/lms.ts'

const slug = (s) =>
  String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
const q = (s) => "'" + String(s).replaceAll('\\', '\\\\').replaceAll("'", "\\'").replaceAll('\n', '\\n') + "'"
const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim()

function convert(entry, warnings) {
  const d = entry.dictation
  const m = String(d.dictationId).match(/^CAM(\d+)_L(\d+)_S(\d+)$/i)
  const book = m ? Number(m[1]) : 0
  const test = m ? Number(m[2]) : 0
  const section = m ? Number(m[3]) : Number(String(d.section).replace(/\D/g, '')) || 1
  // File âm thanh cục bộ của section (đúng dung lượng LMS báo) → phát từ máy, không thì CDN
  const audioTest = m ? 'listening-' + slug(`CAM${book}_L${test}`) : undefined
  const rel = audioTest ? `ielts/audio/${audioTest}/s${section}.mp3` : undefined
  const file = rel ? path.join('public', rel) : undefined
  const localOk = !!file && fs.existsSync(file) && fs.statSync(file).size === d.sourceFile?.size
  if (!localOk) warnings.push(`${d.dictationId}: chưa có file âm thanh cục bộ khớp (${rel ?? 'không suy ra được đề'})`)

  const sentences = d.sentences
    .slice()
    .sort((a, b) => a.key - b.key)
    .filter((s) => clean(s.content))
    .map((s) => {
      const words = s.words.map((w) => String(w.value))
      const given = s.words.flatMap((w, i) => (w.type === 'TEXT' ? [i] : []))
      const pw = (s.popularWords ?? []).map((p) => ({ en: clean(p.enWord), ...(clean(p.pronunciation) ? { ipa: clean(p.pronunciation) } : {}), vi: clean(p.viWord) }))
      return {
        text: clean(s.content),
        ...(clean(s.contentVi) ? { vi: clean(s.contentVi) } : {}),
        start: s.start,
        end: s.end,
        words,
        ...(given.length ? { given } : {}),
        ...(pw.length ? { pw } : {}),
        ...(s.character ? { speaker: s.character } : {}),
      }
    })

  return {
    id: 'dictation-' + slug(d.dictationId),
    skill: 'listening',
    title: clean(d.name).replace(/^\[[^\]]*\]\s*/, ''),
    book: book ? `Cambridge ${book}` : 'Khác',
    bookNo: book,
    test,
    section,
    words: d.noOfWords ?? sentences.reduce((n, s) => n + s.words.length, 0),
    ...(localOk ? { audioLocal: '/' + rel, audioTest } : {}),
    audioUrl: d.sourceFile?.url ?? '',
    sentences,
  }
}

// ── xuất TypeScript ─────────────────────────────────────────────────────────────────────────────
const ident = (k) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : q(k))
function lit(v) {
  if (Array.isArray(v)) return '[' + v.map(lit).join(', ') + ']'
  if (v && typeof v === 'object') return '{ ' + Object.entries(v).filter(([, x]) => x !== undefined).map(([k, x]) => `${ident(k)}: ${lit(x)}`).join(', ') + ' }'
  return typeof v === 'string' ? q(v) : String(v)
}
function pp(v, indent) {
  const inline = lit(v)
  if (inline.length + indent.length <= 130 || typeof v !== 'object' || v === null) return inline
  const pad = indent + '  '
  if (Array.isArray(v)) return '[\n' + v.map((x) => pad + pp(x, pad) + ',').join('\n') + '\n' + indent + ']'
  return '{\n' + Object.entries(v).filter(([, x]) => x !== undefined).map(([k, x]) => `${pad}${ident(k)}: ${pp(x, pad)},`).join('\n') + '\n' + indent + '}'
}

const warnings = []
const all = []
const seen = new Set()
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
  for (const entry of JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))) {
    const d = convert(entry, warnings)
    if (seen.has(d.id)) {
      console.warn('TRÙNG id, bỏ qua:', d.id)
      continue
    }
    seen.add(d.id)
    all.push(d)
  }
}
all.sort((a, b) => a.bookNo - b.bookNo || a.test - b.test || a.section - b.section)
for (const w of warnings) console.warn('  ' + w)

const out = [
  `import type { Dictation } from '@/lib/ielts/dictation'`,
  ``,
  `// FILE SINH TỰ ĐỘNG bởi scripts/import-lms-dictation.mjs từ API Dictation của LMS — đừng sửa tay.`,
  `// Nội dung đề Cambridge IELTS có bản quyền: chỉ commit nếu repo private. Âm thanh dùng lại file mp3 của section đề Listening.`,
  `export const DICTATIONS: Dictation[] = [`,
  ...all.map((d) => '  ' + pp(d, '  ') + ','),
  `]`,
  ``,
]
fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, out.join('\n'))
console.log(`Dictation: ${all.length} bài, ${all.reduce((n, d) => n + d.sentences.length, 0)} câu → ${OUT}`)
