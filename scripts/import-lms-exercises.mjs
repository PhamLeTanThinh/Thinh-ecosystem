// Đổi JSON tải từ API "Exercise" của LMS (POST .../exercises/<id>/start) thành data của app.
//   node scripts/import-lms-exercises.mjs [thư-mục-json = scripts/lms-exercises]
// Mỗi file .json = 1 response (hoặc 1 mảng response). Ghi ra src/data/ielts/exercises/writing-lms.ts (ghi đè
// toàn bộ mỗi lần chạy).
//   - Bộ chỉ có INFO_MATCHING            → kind 'matching' (các vòng nối endings)
//   - Bộ có MULTIPLE_CHOICE / COMPLETION_WITH_HINTS (có thể trộn INFO_MATCHING) → kind 'quiz'
//   - Dạng khác (SENTENCE_BUILDING / SENTENCE_ARRANGEMENT / COMPLETION_WITHOUT_HINTS) → bỏ qua cả bộ + báo.
import fs from 'node:fs'
import path from 'node:path'

const dir = process.argv[2] ?? 'scripts/lms-exercises'
// Mỗi kỹ năng ghi ra 1 file riêng (src/data/ielts/exercises/<skill>-lms.ts). manual = file nhập tay cùng kỹ năng (nếu
// có) — bài nào trùng `part` với file đó sẽ bị bỏ qua để không hiện 2 lần.
const SKILLS = {
  writing: { label: 'Writing', file: 'src/data/ielts/exercises/writing-lms.ts', constName: 'WRITING_LMS_EXERCISES', manual: 'src/data/ielts/exercises/writing.ts' },
  speaking: { label: 'Speaking', file: 'src/data/ielts/exercises/speaking-lms.ts', constName: 'SPEAKING_LMS_EXERCISES', manual: null },
}
// Bài đánh dấu "(cũ)" (bản cũ, không còn bản mới thay thế) vẫn nhập; bỏ tiền tố khi phân tích tên, gắn lại nhãn ở cuối tiêu đề.
const isOld = (ex) => /^\(cũ\)\s*/i.test(ex.testName)
const cleanName = (ex) => ex.testName.replace(/^\(cũ\)\s*/i, '')
const skillOf = (ex) => (cleanName(ex).match(/^IELTS\s*[\d.]+\s*-\s*(Writing|Speaking|Reading|Listening)\s*-/i)?.[1] ?? ex.skillDisplay ?? '').toLowerCase()
// Dạng được trộn trong 1 bộ quiz. SENTENCE_BUILDING chỉ nhận khi CẢ bộ chỉ có dạng đó (→ kind 'sentence-building').
const SUPPORTED = new Set(['INFO_MATCHING', 'MULTIPLE_CHOICE', 'COMPLETION_WITH_HINTS', 'SENTENCE_ARRANGEMENT', 'COMPLETION_WITHOUT_HINTS', 'REPEATING', 'CONVERSATION'])

// ── Slate JSON (chuỗi) → text ────────────────────────────────────────────────────────────────
// Theo quy ước **đậm** / *nghiêng* của renderExplanation. Mỗi đoạn / mục danh sách là 1 dòng ("• " cho mục).
function inline(nodes) {
  return nodes
    .map((n) => {
      if (n.children) {
        const inner = inline(n.children).trim()
        return n.type === 'roundedElement' ? `[${inner}]` : inner
      }
      const t = n.text ?? ''
      if (!t.trim()) return t
      const [, pre, core, post] = t.match(/^(\s*)([\s\S]*?)(\s*)$/)
      const marked = n.bold && n.italic ? `***${core}***` : n.bold ? `**${core}**` : n.italic ? `*${core}*` : core
      return pre + marked + post
    })
    .join('')
}
function lines(nodes, out = [], bullet = '') {
  for (const n of nodes) {
    if (n.type === 'ul' || n.type === 'ol') lines(n.children ?? [], out, '• ')
    else if (n.type === 'li') {
      const nested = (n.children ?? []).filter((c) => c.type === 'ul' || c.type === 'ol')
      const own = (n.children ?? []).filter((c) => !nested.includes(c))
      out.push(bullet + inline(own))
      lines(nested, out, '– ')
    } else out.push(inline(n.children ?? [n]))
  }
  return out
}
function slate(str) {
  if (!str) return ''
  let doc
  try {
    doc = JSON.parse(str)
  } catch {
    return String(str)
  }
  return lines(doc)
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter((l) => l && l !== '•' && l !== '–')
    .join('\n')
}
const plain = (v) => (typeof v === 'string' && v.startsWith('[{') ? slate(v) : String(v ?? '').trim())

// ── Bài nói (Speaking): cây `words` của LMS → dãy cụm ─────────────────────────────────────────────
// Chỉ lấy cấp trên cùng: 1 nút có `children` là 1 cụm (value = cả cụm, meaning = nghĩa của cụm), nút lá là 1 từ.
const REPEAT_INSTRUCTION = 'Nghe câu gốc, rồi nói lại bằng cách diễn đạt trong khung bên dưới.'
const chunksOf = (words) =>
  (words ?? [])
    .map((w) => ({ text: String(w.value ?? '').trim(), ...(w.meaning?.trim() ? { meaning: w.meaning.trim() } : {}), ...(w.type === 'PUNCTUATION' ? { punct: true } : {}) }))
    .filter((w) => w.text)
const chunkText = (chunks) => chunks.map((c, i) => (i > 0 && !c.punct ? ' ' : '') + c.text).join('')
const normWords = (t) => t.toLowerCase().replace(/[^a-z0-9']+/g, ' ').trim()

// ── Đoạn có chỗ trống (completionForm) → dãy đoạn gồm chữ / chỗ trống ─────────────────────────────
// Bảng, danh sách, icon được làm phẳng: mỗi hàng bảng / mục danh sách / đoạn = 1 đoạn, các ô cách nhau " | ".
const BLOCKS = new Set(['p', 'li', 'lic', 'ul', 'ol', 'tr', 'table', 'align_left', 'align_center', 'align_right'])
function body(contentList) {
  const paras = []
  let cur = []
  const flush = () => {
    if (cur.some((s) => 'blank' in s || s.text.trim())) paras.push(cur)
    cur = []
  }
  const walk = (n, ix = 0, parent = null) => {
    if (n.type === 'blank') return void cur.push({ blank: n.id })
    if (n.type === 'ICON') return
    if (!n.children) {
      if (n.text) cur.push(n.bold ? { text: n.text, bold: true } : { text: n.text })
      return
    }
    const block = BLOCKS.has(n.type)
    if (block) flush()
    if (parent?.type === 'tr' && ix > 0) cur.push({ text: ' | ' })
    n.children.forEach((c, i) => walk(c, i, n))
    if (block) flush()
  }
  for (const item of contentList) {
    let doc
    try {
      doc = JSON.parse(item.content)
    } catch {
      continue
    }
    doc.forEach((n, i) => walk(n, i, null))
    flush()
  }
  // Gộp các đoạn chữ liền nhau cùng kiểu cho gọn
  return paras.map((para) =>
    para.reduce((acc, s) => {
      const last = acc[acc.length - 1]
      if (last && 'text' in last && 'text' in s && !!last.bold === !!s.bold) last.text += s.text
      else acc.push({ ...s })
      return acc
    }, []),
  )
}

// ── 1 trang QUESTION → 1 item ───────────────────────────────────────────────────────────────────
function convertItem(p) {
  const c = p.content
  const base = {
    id: p.id,
    instruction: slate(c.question),
    context: c.attachedQuestion?.enabled ? slate(c.attachedQuestion.passage?.content) : '',
    explanation: c.explanation?.enabled ? slate(c.explanation.content) : '',
  }
  if (c.questionType === 'MULTIPLE_CHOICE') {
    const options = c.answer.options.map((o) => ({ key: o.key, value: plain(o.value) }))
    if (!c.correctAnswers.length || c.correctAnswers.some((k) => !options.some((o) => o.key === k))) return { error: 'đáp án trắc nghiệm không khớp option' }
    return { item: { type: 'choice', ...base, multiple: c.answer.choiceType === 'MULTIPLE', options, correct: c.correctAnswers } }
  }
  if (c.questionType === 'COMPLETION_WITH_HINTS') {
    const bank = c.answer.options.map((o) => ({ key: o.key, value: plain(o.value) }))
    const paras = body(c.completionForm.contentList)
    const inText = paras.flatMap((para) => para.flatMap((s) => ('blank' in s ? [s.blank] : [])))
    const correctMap = Object.fromEntries(c.correctAnswers.map((a) => [a.blankKey, a.answerKey]))
    const okKeys =
      inText.length === Object.keys(correctMap).length &&
      inText.every((k) => correctMap[k] && bank.some((o) => o.key === correctMap[k])) // 1 mục có thể đúng cho nhiều chỗ trống
    if (!okKeys) return { error: `chỗ trống (${inText.length}) không khớp đáp án (${Object.keys(correctMap).length})` }
    return { item: { type: 'completion', ...base, body: paras, bank, correctMap } }
  }
  if (c.questionType === 'SENTENCE_ARRANGEMENT') {
    const options = c.answer.options.map((o) => ({ key: o.key, value: plain(o.value).replace(/\*+/g, '').replace(/\s*\n\s*/g, ' ') }))
    const ok = c.correctAnswers.length === options.length && new Set(c.correctAnswers).size === options.length && c.correctAnswers.every((k) => options.some((o) => o.key === k))
    if (!ok) return { error: 'thứ tự đúng không khớp các câu' }
    return { item: { type: 'order', ...base, options, correct: c.correctAnswers } }
  }
  if (c.questionType === 'COMPLETION_WITHOUT_HINTS') {
    const paras = body(c.completionForm.contentList)
    const inText = paras.flatMap((para) => para.flatMap((s) => ('blank' in s ? [s.blank] : [])))
    const answers = Object.fromEntries(c.correctAnswers.map((a) => [a.blankKey, a.answers.map((x) => plain(x)).filter(Boolean)]))
    const ok = inText.length > 0 && inText.length === Object.keys(answers).length && inText.every((k) => answers[k]?.length)
    if (!ok) return { error: `chỗ trống (${inText.length}) không khớp đáp án (${Object.keys(answers).length})` }
    return { item: { type: 'typing', ...base, body: paras, answers } }
  }
  if (c.questionType === 'REPEATING') {
    // Nói lặp lại: question = câu gốc (nghe), script.content = câu mẫu để nói, words = các cụm kèm nghĩa
    const script = plain(c.script?.content).replace(/\s+/g, ' ').trim()
    if (!script) return { error: 'thiếu câu mẫu (script)' }
    let chunks = chunksOf(c.words)
    // Các cụm không ghép lại đúng câu mẫu → bỏ gợi ý nghĩa, tách câu mẫu theo từ
    if (normWords(chunkText(chunks)) !== normWords(script)) chunks = script.split(' ').map((t) => ({ text: t }))
    return { item: { type: 'repeat', ...base, instruction: REPEAT_INSTRUCTION, prompt: slate(c.question), script, chunks } }
  }
  if (c.questionType === 'CONVERSATION') {
    // Hội thoại có kịch bản: lượt chúng tôi (người hỏi) xen kẽ lượt USER (câu cần nói). Mỗi lượt USER = 1 màn nói lặp lại,
    // câu nghe = (các) lượt chúng tôi ngay trước đó; chủ đề chung của cả hội thoại (question) làm khung dữ kiện.
    const topic = slate(c.question)
    const items = []
    let pending = []
    for (const [i, t] of (c.sentenceMeanings ?? []).entries()) {
      const chunks = chunksOf(t.words)
      const text = chunkText(chunks)
      if (!text) continue
      if (t.speakerType !== 'USER') {
        pending.push(text)
        continue
      }
      items.push({ type: 'repeat', id: `${p.id}-${i}`, instruction: REPEAT_INSTRUCTION, context: topic, explanation: '', prompt: pending.join(' ') || topic, script: text, chunks })
      pending = []
    }
    if (!items.length) return { error: 'hội thoại không có lượt nói nào của USER' }
    return { items }
  }
  if (c.questionType === 'INFO_MATCHING') {
    const correct = new Map(c.correctAnswers.map((a) => [a.questionKey, a.answerKey]))
    const good = new Set(correct.values())
    const options = c.answer.options.map((o) => ({ key: o.key, value: o.value.trim(), distractor: !good.has(o.key) }))
    const prompts = c.questions.map((x) => ({ key: x.key, value: x.value.trim() }))
    const correctMap = Object.fromEntries(prompts.map((x) => [x.key, correct.get(x.key)]))
    if (Object.values(correctMap).some((v) => !v || !options.some((o) => o.key === v))) return { error: 'đáp án nối không khớp option' }
    return { item: { type: 'matching', ...base, options, prompts, correctMap } }
  }
  return { error: `chưa hỗ trợ ${c.questionType}` }
}

function convert(res) {
  const ex = res.exercise
  const skill = skillOf(ex)
  const cfg = SKILLS[skill]
  if (!cfg) return { skip: `${ex.testName}: chưa hỗ trợ kỹ năng "${skill || '?'}"` }
  const title = cleanName(ex).replace(new RegExp(`^IELTS\\s*[\\d.]+\\s*-\\s*${cfg.label}\\s*-\\s*`, 'i'), '') + (isOld(ex) ? ' (cũ)' : '')
  // 'L5 - Exercise 2.1: …' (số thập phân), 'L6 - Exercise 1' (không có ':'), 'L9 - Ex2: …' đều hợp lệ
  const m = title.match(/^L(\d+)\s*-\s*Ex(?:ercise)?\s*(\d+(?:\.\d+)?)\s*(?::\s*(.*))?$/i)
  const questions = ex.pages.filter((p) => p.type === 'QUESTION')
  const types = [...new Set(questions.map((p) => p.content.questionType))]
  const headOf = () => ({
    skill,
    id: `${skill}-${m ? `l${m[1]}-ex${m[2].replace('.', '-')}${m[3] ? '-' + slug(m[3], skill) : ''}` : slug(title, skill)}`,
    title,
    // Bài không theo mẫu "L# - Exercise N" (vd Speaking "L1 - Interactive") vẫn gắn được số buổi: "Speaking 1"
    part: m ? `${cfg.label} ${m[1]} - Exercise ${m[2]}` : title.match(/^L(\d+)\b/i) ? `${cfg.label} ${title.match(/^L(\d+)\b/i)[1]}` : cfg.label,
  })
  if (types.length === 1 && types[0] === 'SENTENCE_BUILDING') {
    // Ghép câu (từ thẻ từ): thẻ CONFUSION là thẻ nhiễu
    const qs = questions.map((p) => ({
      id: p.id,
      sentenceVi: slate(p.content.sentence?.content),
      hint: p.content.hint?.enabled ? plain(p.content.hint.content) : '',
      correctAnswers: p.content.correctAnswers,
      words: p.content.answer.words.map((w) => ({ key: w.key, value: w.value, distractor: w.type === 'CONFUSION' })),
      explanation: p.content.explanation?.enabled ? slate(p.content.explanation.content) : '',
    }))
    if (qs.some((x) => !x.sentenceVi || !x.correctAnswers?.length)) return { skip: `${ex.testName}: câu ghép thiếu đề/đáp án` }
    return { set: { ...headOf(), kind: 'sentence-building', instruction: slate(questions[0].content.question), questions: qs } }
  }
  const bad = types.filter((t) => !SUPPORTED.has(t))
  if (bad.length) return { skip: `${ex.testName}: chưa hỗ trợ ${bad.join(', ')}` }
  const items = []
  for (const p of questions) {
    const r = convertItem(p)
    if (r.error) return { skip: `${ex.testName} (${p.name}): ${r.error}` }
    items.push(...(r.items ?? [r.item]))
  }
  const head = headOf()
  if (types.every((t) => t === 'INFO_MATCHING')) {
    // Giữ nguyên dạng "matching" (id vòng round-N) để không đổi id/tiến độ đã có
    const rounds = items.map((it, i) => ({ id: `round-${i + 1}`, instruction: it.instruction, context: it.context, options: it.options, prompts: it.prompts, correctMap: it.correctMap, explanation: it.explanation }))
    return { set: { ...head, kind: 'matching', rounds } }
  }
  return { set: { ...head, kind: 'quiz', items } }
}

// Writing giữ cách tạo slug cũ (đổi id sẽ làm mất tiến độ đã lưu); các kỹ năng mới phân biệt thêm "+" và "-" ở cuối
// (vd Speaking "Degree+" và "Degree-" phải ra 2 id khác nhau).
function slug(s, skill) {
  if (skill !== 'writing') s = s.replace(/\+/g, ' plus ').replace(/-(?=\s*(\)|$))/g, ' minus ')
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ── Xuất TypeScript ─────────────────────────────────────────────────────────────────────────────
const q = (s) => "'" + String(s).replaceAll('\\', '\\\\').replaceAll("'", "\\'").replaceAll('\n', '\\n') + "'"
const ident = (k) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : q(k))
function lit(v) {
  if (Array.isArray(v)) return '[' + v.map(lit).join(', ') + ']'
  if (v && typeof v === 'object') return '{ ' + Object.entries(v).map(([k, x]) => `${ident(k)}: ${lit(x)}`).join(', ') + ' }'
  return typeof v === 'string' ? q(v) : String(v)
}

// Bài đã nhập tay trước đây (writing.ts) — bỏ qua theo `part` để không hiện trùng.
const existingParts = new Set(
  Object.entries(SKILLS).flatMap(([skill, cfg]) => (cfg.manual ? [...fs.readFileSync(cfg.manual, 'utf8').matchAll(/part: '([^']+)'/g)].map((m) => `${skill}|${m[1]}`) : [])),
)

// Giải thích bổ sung do AI soạn cho các màn mà LMS không có (scripts/lms-explanations/*.json, khóa
// "<set id>/<item id>"). Giải thích gốc của LMS luôn được ưu tiên; phần AI có thêm dòng ghi chú nguồn.
const AI_NOTE = '\n---\n*Giải thích do AI soạn, chỉ mang tính tham khảo.*'
const overlay = {}
const overlayDir = path.join(path.dirname(dir), 'lms-explanations')
if (fs.existsSync(overlayDir)) {
  for (const f of fs.readdirSync(overlayDir).filter((x) => x.endsWith('.json'))) {
    for (const [k, v] of Object.entries(JSON.parse(fs.readFileSync(path.join(overlayDir, f), 'utf8')))) {
      if (k in overlay) console.warn('Giải thích bị khai báo 2 lần:', k)
      overlay[k] = v
    }
  }
}
const usedOverlay = new Set()
function applyOverlay(set) {
  const units = set.kind === 'matching' ? set.rounds : set.kind === 'quiz' ? set.items : []
  for (const u of units) {
    if (u.explanation) continue
    const key = `${set.id}/${u.id}`
    if (overlay[key]) {
      u.explanation = overlay[key].trim() + AI_NOTE
      usedOverlay.add(key)
    }
  }
}

const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort()
const sets = []
const seen = new Set()
for (const f of files) {
  const raw = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))
  for (const res of Array.isArray(raw) ? raw : [raw]) {
    const r = convert(res)
    if (r.skip) {
      console.warn('BỎ QUA', r.skip)
      continue
    }
    if (seen.has(r.set.id)) {
      console.warn('TRÙNG id', r.set.id)
      continue
    }
    if (existingParts.has(`${r.set.skill}|${r.set.part}`)) {
      console.warn('ĐÃ CÓ trong file nhập tay, bỏ qua:', r.set.part)
      continue
    }
    seen.add(r.set.id)
    applyOverlay(r.set)
    sets.push(r.set)
  }
}
sets.sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }))

function render(cfg, sets) {
const out = [
  `import type { ExerciseSet } from '@/lib/ielts/practice'`,
  ``,
  `// FILE SINH TỰ ĐỘNG bởi scripts/import-lms-exercises.mjs từ API "Exercise" của LMS — đừng sửa tay.`,
  `export const ${cfg.constName}: ExerciseSet[] = [`,
]
for (const s of sets) {
  out.push(`  {`, `    id: ${q(s.id)},`, `    skill: ${q(s.skill)},`, `    kind: ${q(s.kind)},`, `    title: ${q(s.title)},`, `    category: ${q(cfg.label + ' exercise')},`, `    part: ${q(s.part)},`)
  if (s.kind === 'sentence-building') {
    if (s.instruction) out.push(`    instruction: ${q(s.instruction)},`)
    out.push(`    questions: [`)
    for (const x of s.questions) {
      out.push(`      {`, `        id: ${q(x.id)},`, `        sentenceVi: ${q(x.sentenceVi)},`)
      if (x.hint) out.push(`        hint: ${q(x.hint)},`)
      out.push(`        correctAnswers: ${lit(x.correctAnswers)},`, `        words: [`)
      for (const w of x.words) out.push(`          ${lit(w)},`)
      out.push(`        ],`)
      if (x.explanation) out.push(`        explanation: ${q(x.explanation)},`)
      out.push(`      },`)
    }
    out.push(`    ],`)
  } else if (s.kind === 'matching') {
    out.push(`    rounds: [`)
    for (const r of s.rounds) {
      out.push(`      {`, `        id: ${q(r.id)},`, `        instruction: ${q(r.instruction)},`)
      if (r.context) out.push(`        context: ${q(r.context)},`)
      out.push(`        options: [`)
      for (const o of r.options) out.push(`          { key: ${q(o.key)}, value: ${q(o.value)}, distractor: ${o.distractor} },`)
      out.push(`        ],`, `        prompts: [`)
      for (const p of r.prompts) out.push(`          { key: ${q(p.key)}, value: ${q(p.value)} },`)
      out.push(`        ],`, `        correctMap: {`)
      for (const [k, v] of Object.entries(r.correctMap)) out.push(`          ${q(k)}: ${q(v)},`)
      out.push(`        },`)
      if (r.explanation) out.push(`        explanation: ${q(r.explanation)},`)
      out.push(`      },`)
    }
    out.push(`    ],`)
  } else {
    out.push(`    items: [`)
    for (const it of s.items) {
      out.push(`      {`, `        type: ${q(it.type)},`, `        id: ${q(it.id)},`, `        instruction: ${q(it.instruction || 'Chọn đáp án đúng')},`)
      if (it.context) out.push(`        context: ${q(it.context)},`)
      if (it.type === 'choice') {
        out.push(`        multiple: ${it.multiple},`, `        options: [`)
        for (const o of it.options) out.push(`          ${lit(o)},`)
        out.push(`        ],`, `        correct: ${lit(it.correct)},`)
      } else if (it.type === 'repeat') {
        out.push(`        prompt: ${q(it.prompt)},`, `        script: ${q(it.script)},`, `        chunks: [`)
        for (const c of it.chunks) out.push(`          ${lit(c)},`)
        out.push(`        ],`)
      } else if (it.type === 'order') {
        out.push(`        options: [`)
        for (const o of it.options) out.push(`          ${lit(o)},`)
        out.push(`        ],`, `        correct: ${lit(it.correct)},`)
      } else if (it.type === 'typing') {
        out.push(`        body: [`)
        for (const para of it.body) out.push(`          ${lit(para)},`)
        out.push(`        ],`, `        answers: ${lit(it.answers)},`)
      } else if (it.type === 'completion') {
        out.push(`        body: [`)
        for (const para of it.body) out.push(`          ${lit(para)},`)
        out.push(`        ],`, `        bank: [`)
        for (const o of it.bank) out.push(`          ${lit(o)},`)
        out.push(`        ],`, `        correctMap: ${lit(it.correctMap)},`)
      } else {
        out.push(`        options: [`)
        for (const o of it.options) out.push(`          ${lit(o)},`)
        out.push(`        ],`, `        prompts: [`)
        for (const p of it.prompts) out.push(`          ${lit(p)},`)
        out.push(`        ],`, `        correctMap: ${lit(it.correctMap)},`)
      }
      if (it.explanation) out.push(`        explanation: ${q(it.explanation)},`)
      out.push(`      },`)
    }
    out.push(`    ],`)
  }
  out.push(`  },`)
}
out.push(`]`, ``)
return out.join('\n')
}
for (const [skill, cfg] of Object.entries(SKILLS)) fs.writeFileSync(cfg.file, render(cfg, sets.filter((s) => s.skill === skill)))
for (const k of Object.keys(overlay)) if (!usedOverlay.has(k)) console.warn('Giải thích không khớp màn nào (sai id, hoặc màn đã có giải thích gốc):', k)
const missingExpl = sets.flatMap((s) => (s.kind === 'matching' ? s.rounds : s.kind === 'quiz' ? s.items : []).filter((u) => !u.explanation && u.type !== 'repeat').map((u) => `${s.id}/${u.id}`))
if (missingExpl.length) console.warn(`${missingExpl.length} màn vẫn chưa có giải thích:`, missingExpl.slice(0, 5).join(', '), '…')
console.log(`Giải thích AI đã gộp: ${usedOverlay.size}`)
const n = (k) => sets.filter((s) => s.kind === k).length
for (const [skill, cfg] of Object.entries(SKILLS)) console.log(`${cfg.label}: ${sets.filter((s) => s.skill === skill).length} bộ → ${cfg.file}`)
console.log(`Tổng ${sets.length} bộ (${n('matching')} matching, ${n('quiz')} quiz, ${n('sentence-building')} sentence-building)`)
