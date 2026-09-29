// Đổi JSON tải từ API Vocab của LMS (scripts/lms-download-vocab.console.js) thành data vocab của app và tải
// ảnh minh họa về public/ielts/images/vocab/<set-id>/.
//   node scripts/import-lms-vocab.mjs [thư-mục-json = scripts/lms-vocab] [--no-images]
// Mỗi file .json = 1 mảng set. Ghi ra src/data/ielts/vocab/<skill>.ts (ghi đè toàn bộ mỗi lần chạy). Ảnh đã có thì không
// tải lại, nên chạy lại nhiều lần vẫn nhanh. Writing đã nhập tay từ trước (WRITING_VOCAB_SETS) nên không đụng tới.
import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)
const noImages = args.includes('--no-images')
const dir = args.find((a) => !a.startsWith('--')) ?? 'scripts/lms-vocab'
const IMG_ROOT = 'public/ielts/images/vocab'

const SKILLS = {
  speaking: { label: 'Speaking', file: 'src/data/ielts/vocab/speaking.ts', constName: 'SPEAKING_VOCAB_SETS' },
  listening: { label: 'Listening', file: 'src/data/ielts/vocab/listening.ts', constName: 'LISTENING_VOCAB_SETS' },
}
const skillOf = (name) => (name.match(/^IELTS\s*[\d.]+\s*-\s*(Writing|Speaking|Reading|Listening)\s*-/i)?.[1] ?? '').toLowerCase()

function slug(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
const q = (s) => "'" + String(s).replaceAll('\\', '\\\\').replaceAll("'", "\\'").replaceAll('\n', '\\n') + "'"

// Loại từ của LMS (NOUN, VERB…) → dạng ngắn của app ('n', 'v', 'adj', 'adv'…); nhiều loại thì nối bằng "/"
const POS = {
  NOUN: 'n', VERB: 'v', ADJECTIVE: 'adj', ADJ: 'adj', ADVERB: 'adv', ADV: 'adv', PREPOSITION: 'prep', PREP: 'prep',
  CONJUNCTION: 'conj', CONJ: 'conj', PRONOUN: 'pron', PRON: 'pron', INTERJECTION: 'interj', PHRASE: 'phrase', IDIOM: 'idiom',
}
const posOf = (list) => (list ?? []).map((p) => POS[String(p).toUpperCase()] ?? String(p).toLowerCase()).join('/')

// URL ảnh của LMS có khi kết thúc bằng đuôi lạ (vd .ashx) → server tĩnh phục vụ sai kiểu file. Đuôi không thuộc danh sách
// ảnh thì nhận dạng định dạng thật từ nội dung file (magic bytes) rồi đặt lại đuôi + đường dẫn.
const IMG_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg'])
function sniffExt(buf) {
  const h = buf.subarray(0, 16)
  const tag = (a, b) => h.toString('latin1', a, b)
  if (h[0] === 0xff && h[1] === 0xd8) return '.jpg'
  if (tag(1, 4) === 'PNG') return '.png'
  if (tag(0, 3) === 'GIF') return '.gif'
  if (tag(0, 4) === 'RIFF' && tag(8, 12) === 'WEBP') return '.webp'
  if (tag(4, 8) === 'ftyp') return '.avif'
  if (buf.toString('utf8', 0, 300).includes('<svg')) return '.svg'
  return null
}
async function download(job) {
  if (job.knownExt && fs.existsSync(job.dest) && fs.statSync(job.dest).size > 0) return 'cached'
  const res = await fetch(job.url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length === 0) throw new Error('file rỗng')
  if (!job.knownExt) {
    const ext = sniffExt(buf)
    if (!ext) throw new Error('không phải ảnh')
    job.dest = job.dest.slice(0, -path.extname(job.dest).length) + ext
    job.item.image = job.item.image.slice(0, -path.extname(job.item.image).length) + ext
  }
  fs.mkdirSync(path.dirname(job.dest), { recursive: true })
  fs.writeFileSync(job.dest, buf)
  return 'downloaded'
}

const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort()
const built = {} // skill -> VocabSet[]
const usedIds = new Set()
const imageJobs = []
let skippedSets = 0

for (const f of files) {
  for (const set of JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))) {
    // Set tải từ roadmap có thể không đặt tên theo mẫu "IELTS 7.0 - <Skill> - …" → ưu tiên trường skill do script tải ghi kèm
    const skill = String(set.skill ?? '').toLowerCase() || skillOf(set.name)
    const cfg = SKILLS[skill]
    if (!cfg) {
      console.warn(`BỎ QUA "${set.name}" (kỹ năng "${skill || '?'}" chưa cấu hình / đã nhập tay)`)
      skippedSets++
      continue
    }
    const rest = set.name.replace(new RegExp(`^IELTS\\s*[\\d.]+\\s*-\\s*${cfg.label}\\s*-\\s*`, 'i'), '')
    const lm = rest.match(/^L(\d+)\s*-\s*(.*)$/i)
    const title = (lm ? lm[2] : rest).replace(/^Vocab\s*-\s*/i, '').trim()
    const id = `${skill}-${slug(title)}`
    // Tên set roadmap có dạng "W1: Art Projects" / "Section 4: Health" → nhóm theo tuần/section, tiêu đề chỉ giữ phần sau dấu ':'
    const gm = title.match(/^(W\d+|Section\s*\d+)\s*:\s*(.+)$/i)
    const shownTitle = gm ? gm[2].trim() : title
    const shownPart = gm ? gm[1].replace(/^w/i, 'W').replace(/^section\s*/i, 'Section ') : lm ? `Topic ${lm[1]}` : 'Topic'
    if (usedIds.has(id)) {
      console.warn('TRÙNG id, bỏ qua:', id)
      continue
    }
    usedIds.add(id)
    const vocab = []
    for (const v of set.vocabs) {
      const ctx = v.wordInContexts?.[0]
      if (!v.term || !v.viDefinition || !ctx?.enContext) {
        console.warn(`  thiếu dữ liệu, bỏ từ "${v.term}" trong ${id}`)
        continue
      }
      const item = {
        word: v.term.trim(),
        partOfSpeech: posOf(v.partOfSpeeches),
        meaning: v.viDefinition.trim(),
        example: ctx.enContext.trim(),
        ...(v.pronounce ? { ipa: v.pronounce.trim() } : {}),
        ...(v.enDefinition ? { definitionEn: v.enDefinition.trim() } : {}),
        ...(ctx.meaning ? { exampleVi: ctx.meaning.trim() } : {}),
      }
      if (v.image?.url) {
        const rawExt = path.extname(new URL(v.image.url).pathname).toLowerCase()
        const knownExt = IMG_EXTS.has(rawExt)
        const ext = knownExt ? rawExt : '.jpg' // đuôi tạm; download() sẽ đặt lại theo nội dung file nếu đuôi URL lạ
        const file = `${slug(v.term)}${ext}`
        item.image = `/ielts/images/vocab/${id}/${file}`
        imageJobs.push({ url: v.image.url, dest: path.join(IMG_ROOT, id, file), item, knownExt })
      }
      vocab.push(item)
    }
    ;(built[skill] ??= []).push({ id, skill, title: shownTitle, category: 'Vocab topic', part: shownPart, vocab })
  }
}

// Tải ảnh (4 luồng). Ảnh lỗi thì bỏ trường image để giao diện dùng emoji thay thế thay vì hiện ảnh vỡ.
if (!noImages) {
  let done = 0
  const stats = { downloaded: 0, cached: 0, failed: 0 }
  const queue = [...imageJobs]
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      for (let job; (job = queue.shift()); ) {
        try {
          stats[await download(job)]++
        } catch (e) {
          stats.failed++
          delete job.item.image
          console.warn(`  ảnh lỗi (${e.message}): ${job.url}`)
        }
        if (++done % 50 === 0) console.log(`  ảnh ${done}/${imageJobs.length}…`)
      }
    }),
  )
  console.log(`Ảnh: ${stats.downloaded} mới, ${stats.cached} đã có, ${stats.failed} lỗi (tổng ${imageJobs.length})`)
}

function render(cfg, sets) {
  const out = [
    `import type { VocabSet } from '@/lib/ielts/practice'`,
    ``,
    `// FILE SINH TỰ ĐỘNG bởi scripts/import-lms-vocab.mjs từ API Vocab của LMS — đừng sửa tay. Ảnh mỗi set nằm trong`,
    `// public/ielts/images/vocab/<id>/.`,
    `export const ${cfg.constName}: VocabSet[] = [`,
  ]
  for (const s of sets) {
    out.push(`  {`, `    id: ${q(s.id)},`, `    skill: ${q(s.skill)},`, `    title: ${q(s.title)},`, `    category: ${q(s.category)},`, `    part: ${q(s.part)},`, `    vocab: [`)
    for (const v of s.vocab) {
      out.push(`      {`)
      for (const [k, val] of Object.entries(v)) out.push(`        ${k}: ${q(val)},`)
      out.push(`      },`)
    }
    out.push(`    ],`, `  },`)
  }
  out.push(`]`, ``)
  return out.join('\n')
}
for (const [skill, cfg] of Object.entries(SKILLS)) {
  const sets = (built[skill] ?? []).sort((a, b) => a.part.localeCompare(b.part, 'en', { numeric: true }) || a.id.localeCompare(b.id))
  fs.writeFileSync(cfg.file, render(cfg, sets))
  console.log(`${cfg.label}: ${sets.length} set, ${sets.reduce((n, s) => n + s.vocab.length, 0)} từ → ${cfg.file}`)
}
