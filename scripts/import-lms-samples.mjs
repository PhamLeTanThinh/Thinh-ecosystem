// Đổi JSON tải từ API "Sample" của LMS (scripts/lms-download-samples.console.js) thành Đề mẫu của app.
//   node scripts/import-lms-samples.mjs [thư-mục-json = scripts/lms-samples]
// Mỗi file .json = 1 mảng đề mẫu. Ghi ra src/data/ielts/samples/<skill>.ts (ghi đè toàn bộ mỗi lần chạy). Hiện chỉ Speaking
// (Writing đã nhập trước đây). Dùng chung kiểu WritingSample với Đề mẫu Writing:
//   samples[]  → bài mẫu (câu hỏi + các đáp án) + chế độ "Từ vựng" (đánh dấu từ vựng trong câu trả lời)
//   ideas[]    → chế độ "Dàn ý" (cụm ý chính tô xanh, `idea-flow`)
//   vocab      → từ vựng kèm ảnh (giữ URL ngoài như Đề mẫu Writing; giao diện tự dùng icon nếu ảnh chết)
//   exercises  → Exercise 1 (điền chỗ trống từ danh sách) + Exercise 2 (gõ nghĩa tiếng Anh)
import fs from 'node:fs'
import path from 'node:path'

const dir = process.argv[2] ?? 'scripts/lms-samples'
const SKILLS = {
  speaking: { label: 'Speaking', file: 'src/data/ielts/samples/speaking.ts', constName: 'SPEAKING_SAMPLES' },
}

// ── tiện ích Slate ────────────────────────────────────────────────────────────────────────────
const textOf = (n) => (typeof n.text === 'string' ? n.text : (n.children ?? []).map(textOf).join(''))
// Khoá so khớp đoạn giữa samples[] và ideas[]: chỉ giữ chữ + số (nguồn đôi khi lệch 1 dấu phẩy/khoảng trắng giữa 2 bản)
const norm = (t) => t.toLowerCase().replace(/[^a-z0-9]/g, '')
function walk(nodes, fn) {
  for (const n of Array.isArray(nodes) ? nodes : [nodes]) {
    if (!n || typeof n !== 'object') continue
    fn(n)
    if (n.children) walk(n.children, fn)
  }
}
const nodesOf = (nodes, type) => {
  const out = []
  walk(nodes, (n) => n.type === type && out.push(n))
  return out
}
const slug = (s) =>
  String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
const q = (s) => "'" + String(s).replaceAll('\\', '\\\\').replaceAll("'", "\\'").replaceAll('\n', '\\n') + "'"
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const POS = { NOUN: 'n', VERB: 'v', ADJECTIVE: 'adj', ADJ: 'adj', ADVERB: 'adv', ADV: 'adv', PREPOSITION: 'prep', PREP: 'prep', CONJUNCTION: 'conj', PHRASE: 'phrase', IDIOM: 'idiom' }

// ── bài mẫu ───────────────────────────────────────────────────────────────────────────────────
// 1 mục samples[] / ideas[]: content = mảng nút Slate; nút đầu 'title-vocab-idea' là CÂU HỎI, các nút sau là các đoạn (đoạn
// chỉ có chữ "Answer 1"… là nhãn).
function qaOf(content) {
  const nodes = JSON.parse(content)
  const head = nodes.find((n) => n.type === 'title-vocab-idea')
  return { question: head ? textOf(head).replace(/\s+/g, ' ').trim() : '', paras: nodes.filter((n) => n !== head) }
}
const isLabel = (t) => /^answer\s*\d+\s*:?$/i.test(t.trim())

// Chế độ "Từ vựng": tìm cụm từ vựng trong đoạn (chấp nhận đuôi -s/-es/-ed/-d/-ing), ưu tiên cụm dài, không chồng lấn
function markVocab(text, vocabs) {
  const hits = []
  for (const v of vocabs) {
    const re = new RegExp(`(?<![A-Za-z])${escapeRe(v.value.trim())}(?:s|es|ed|d|ing)?(?![A-Za-z])`, 'gi')
    for (let m; (m = re.exec(text)); ) hits.push({ start: m.index, end: m.index + m[0].length, v })
  }
  hits.sort((a, b) => b.end - b.start - (a.end - a.start) || a.start - b.start)
  const taken = []
  for (const h of hits) if (!taken.some((t) => h.start < t.end && h.end > t.start)) taken.push(h)
  taken.sort((a, b) => a.start - b.start)
  const spans = []
  let pos = 0
  for (const h of taken) {
    if (h.start > pos) spans.push({ text: text.slice(pos, h.start) })
    spans.push({ text: text.slice(h.start, h.end), vocabWord: h.v.value.trim(), vocabMeaning: h.v.meaning, ...(h.v.pronounce ? { vocabIpa: h.v.pronounce } : {}) })
    pos = h.end
  }
  if (pos < text.length) spans.push({ text: text.slice(pos) })
  return spans
}

// Chế độ "Dàn ý": nút `idea-flow` = cụm ý chính (highlight), chữ còn lại bị làm mờ
function ideaSpans(p) {
  return (p.children ?? []).map((c) => (c.type === 'idea-flow' ? { text: textOf(c), highlight: true } : { text: textOf(c) })).filter((s) => s.text)
}

// ── bài tập ───────────────────────────────────────────────────────────────────────────────────
function parseGapFill(exNodes, warn) {
  const items = []
  const bank = []
  for (const g of nodesOf(exNodes, 'exercise-gap-fill-with-hint')) {
    const options = nodesOf(g, 'exercise-gap-fill-with-hint-question-option').map((o) => ({ id: o.id, text: textOf(o).replace(/\s+/g, ' ').trim() }))
    const correct = new Map(nodesOf(g, 'correct-answer').map((c) => [c.forId, c.correctAnswer]))
    for (const o of options) if (o.text && !bank.includes(o.text)) bank.push(o.text)
    for (const p of nodesOf(g, 'p')) {
      const kids = p.children ?? []
      const bi = kids.findIndex((c) => c.type === 'blank-v2')
      if (bi < 0) continue
      const optId = correct.get(kids[bi].id)
      const opt = options.find((o) => o.id === optId)
      if (!opt) {
        warn(`chỗ trống ${kids[bi].id} không có đáp án đúng`)
        continue
      }
      let before = kids.slice(0, bi).map(textOf).join('').replace(/^\s*\d+\.\s*/, '').replace(/\s+$/, '')
      let after = kids.slice(bi + 1).map(textOf).join('')
      if (/^[A-Za-z0-9]/.test(after)) after = ' ' + after // "…to [blank]yourself…" trong nguồn dính liền
      items.push({ hintVi: '', before, after: after.replace(/\s+$/, ''), correctValue: opt.text })
    }
  }
  return { bank, items }
}

function parseShortAnswers(exNodes, warn) {
  const out = []
  for (const s of nodesOf(exNodes, 'exercise-short-answer-question')) {
    const p = nodesOf(s, 'p').find((x) => (x.children ?? []).some((c) => c.type === 'exercise_short_answer_blank'))
    const prompt = p ? (p.children ?? []).filter((c) => c.type !== 'exercise_short_answer_blank').map(textOf).join('').trim() : ''
    const ans = nodesOf(s, 'correct-answer').find((c) => c.forId === s.blankId)?.correctAnswer
    if (!prompt || !ans) {
      warn(`câu trả lời ngắn thiếu đề/đáp án (${s.id})`)
      continue
    }
    out.push({ prompt, correctAnswer: String(ans).trim() })
  }
  return out
}

// ── 1 đề ───────────────────────────────────────────────────────────────────────────────────────
function convert(entry) {
  const s = entry.sample
  const warnings = []
  const warn = (m) => warnings.push(m)
  const skill = /speaking/i.test(s.contentGroup ?? '') || /speaking/i.test(entry.name) ? 'speaking' : ''
  const cfg = SKILLS[skill]
  if (!cfg) return { skip: `${entry.name}: chưa hỗ trợ kỹ năng "${s.contentGroup ?? '?'}"` }

  const title = entry.name ?? s.title // tên trong syllabus (giữ nhóm chủ đề, vd "Urban Life & Noises: Noises")
  const id = slug(title.replace(/^IELTS\s*[\d.]+\s*-\s*Sample\s*/i, '') || title)
  const rawVocab = (s.vocab?.vocabs ?? []).filter((v) => v.value && v.meaning)
  const vocabSeen = new Set()
  const vocabs = rawVocab.filter((v) => (vocabSeen.has(v.value.trim().toLowerCase()) ? false : vocabSeen.add(v.value.trim().toLowerCase())))

  // ideas theo văn bản đoạn (khoá so khớp) — đề nào ideas lệch chữ thì đoạn đó không có chế độ Dàn ý
  const ideaByText = new Map()
  for (const it of s.ideas ?? []) for (const p of qaOf(it.content).paras) ideaByText.set(norm(textOf(p)), ideaSpans(p))

  const essay = []
  const questions = []
  let noIdea = 0
  for (const [qi, it] of (s.samples ?? []).entries()) {
    const { question, paras } = qaOf(it.content)
    if (question) {
      questions.push(question)
      essay.push({ id: `${id}-q${qi + 1}`, heading: question, headingKind: 'question', vocabView: [], ideaView: [] })
    }
    for (const [pi, p] of paras.entries()) {
      const text = textOf(p).replace(/^\s+|\s+$/g, '')
      if (!text) continue
      if (isLabel(text)) {
        essay.push({ id: `${id}-q${qi + 1}-l${pi + 1}`, heading: text, headingKind: 'label', vocabView: [], ideaView: [] })
        continue
      }
      let ideaView = ideaByText.get(norm(text))
      if (!ideaView) {
        noIdea++
        ideaView = [{ text }]
      } else {
        // bỏ khoảng trắng thừa ở 2 đầu đoạn
        ideaView = ideaView.map((sp) => ({ ...sp }))
        ideaView[0].text = ideaView[0].text.replace(/^\s+/, '')
        ideaView[ideaView.length - 1].text = ideaView[ideaView.length - 1].text.replace(/\s+$/, '')
      }
      essay.push({ id: `${id}-q${qi + 1}-p${pi + 1}`, vocabView: markVocab(text, vocabs), ideaView })
    }
  }
  if (noIdea) warn(`${noIdea} đoạn không khớp bản "ideas" → không tô được ý chính`)
  if (!essay.length) return { skip: `${entry.name}: không có bài mẫu (samples[] rỗng)` }

  const exNodes = s.exercises?.content ? JSON.parse(s.exercises.content) : []
  const knownEx = new Set(['exercise-gap-fill-with-hint', 'exercise-short-answer'])
  const unknownEx = new Set()
  walk(exNodes, (n) => typeof n.type === 'string' && /^exercise-(?!.*-(question|questions|option|options|content)$)/.test(n.type) && !knownEx.has(n.type) && unknownEx.add(n.type))
  if (unknownEx.size) warn(`dạng bài tập chưa hỗ trợ: ${[...unknownEx].join(', ')}`)
  const gapFill = parseGapFill(exNodes, warn)
  const shortAnswer = parseShortAnswers(exNodes, warn)
  for (const it of gapFill.items) if (!gapFill.bank.includes(it.correctValue)) warn(`đáp án "${it.correctValue}" không có trong danh sách chọn`)

  const partNo = (entry.speakingType ?? '').match(/PART_(\d)/)?.[1]
  return {
    warnings,
    sample: {
      id,
      skill,
      title,
      topic: s.topic?.name ?? '',
      resourceLabel: partNo ? `${cfg.label} Part ${partNo}` : cfg.label,
      part: entry.weekName ?? cfg.label,
      description: s.description ?? '',
      question: questions.map((x, i) => `${i + 1}. ${x}`).join('\n'),
      outline: [],
      essay,
      vocab: vocabs.map((v) => ({
        word: v.value.trim(),
        partOfSpeech: POS[String(v.type).toUpperCase()] ?? String(v.type ?? '').toLowerCase(),
        meaning: v.meaning.trim(),
        example: (v.example ?? '').trim(),
        ...(v.pronounce ? { ipa: v.pronounce.trim() } : {}),
        ...(v.image ? { image: v.image } : {}),
      })),
      gapFill,
      shortAnswer,
    },
  }
}

// ── xuất TypeScript ─────────────────────────────────────────────────────────────────────────────
const ident = (k) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : q(k))
function lit(v) {
  if (Array.isArray(v)) return '[' + v.map(lit).join(', ') + ']'
  if (v && typeof v === 'object') return '{ ' + Object.entries(v).map(([k, x]) => `${ident(k)}: ${lit(x)}`).join(', ') + ' }'
  return typeof v === 'string' ? q(v) : String(v)
}
function pp(v, indent) {
  const inline = lit(v)
  if (inline.length + indent.length <= 130 || typeof v !== 'object' || v === null) return inline
  const pad = indent + '  '
  if (Array.isArray(v)) return '[\n' + v.map((x) => pad + pp(x, pad) + ',').join('\n') + '\n' + indent + ']'
  return '{\n' + Object.entries(v).map(([k, x]) => `${pad}${ident(k)}: ${pp(x, pad)},`).join('\n') + '\n' + indent + '}'
}
function render(cfg, samples) {
  const out = [
    `import type { WritingSample } from '@/lib/ielts/practice'`,
    ``,
    `// FILE SINH TỰ ĐỘNG bởi scripts/import-lms-samples.mjs từ API "Sample" của LMS — đừng sửa tay. Dùng chung kiểu`,
    `// WritingSample và trang xem với Đề mẫu Writing (xem WritingSampleView).`,
    `export const ${cfg.constName}: WritingSample[] = [`,
  ]
  for (const s of samples) out.push('  ' + pp(s, '  ') + ',')
  out.push(`]`, ``)
  return out.join('\n')
}

const built = {}
const seen = new Set()
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
  for (const entry of JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))) {
    const r = convert(entry)
    if (r.skip) {
      console.warn('BỎ QUA', r.skip)
      continue
    }
    if (seen.has(r.sample.id)) {
      console.warn('TRÙNG id, bỏ qua:', r.sample.id)
      continue
    }
    seen.add(r.sample.id)
    for (const w of r.warnings) console.warn(`  [${r.sample.id}] ${w}`)
    ;(built[r.sample.skill] ??= []).push(r.sample)
  }
}
for (const [skill, cfg] of Object.entries(SKILLS)) {
  const list = (built[skill] ?? []).sort((a, b) => a.part.localeCompare(b.part, 'en', { numeric: true }) || a.id.localeCompare(b.id))
  fs.writeFileSync(cfg.file, render(cfg, list))
  const stat = (k) => list.reduce((n, s) => n + s[k].length, 0)
  console.log(`${cfg.label}: ${list.length} đề (${stat('essay')} đoạn, ${stat('vocab')} từ vựng, ${list.reduce((n, s) => n + s.gapFill.items.length, 0)} câu điền, ${stat('shortAnswer')} câu trả lời ngắn) → ${cfg.file}`)
}
