// Đổi JSON bài thi thử Listening tải từ LMS (scripts/lms-download-listening.console.js) thành data của app.
//   node scripts/import-lms-listening.mjs [thư-mục-json = scripts/lms-listening]
// Ghi src/data/ielts/listening/lms.ts (ghi đè toàn bộ mỗi lần chạy). Đáp án (LMS ẩn tới khi nộp bài) lấy từ
// scripts/lms-listening-answers/<testID>.json nếu có — định dạng: { "note": "nguồn…", "answers": { "1": ["egg"], "11": ["C"], "21": ["C","E"] } }.
// Âm thanh KHÔNG chép vào repo: audioUrl trỏ thẳng tới CDN của LMS (công khai, hỗ trợ tua).
import fs from 'node:fs'
import path from 'node:path'

const dir = process.argv[2] ?? 'scripts/lms-listening'
const ANSWER_DIR = path.join(path.dirname(dir), 'lms-listening-answers')
const OUT = 'src/data/ielts/listening/lms.ts'
const CDN = 'https://suijm9clouobj.vcdn.cloud/'

// ── tiện ích Slate ────────────────────────────────────────────────────────────────────────────
const textOf = (n) => (typeof n.text === 'string' ? n.text : (n.children ?? []).map(textOf).join(''))
const slug = (s) =>
  String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
const q = (s) => "'" + String(s).replaceAll('\\', '\\\\').replaceAll("'", "\\'").replaceAll('\n', '\\n') + "'"
const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim()

// Hướng dẫn: các đoạn {children:[{text,bold}]} → dãy chữ có đánh dấu đậm
function instructionOf(g) {
  const src = g.compactGuideline?.enable ? g.compactGuideline.content : g.guideline?.content
  const spans = []
  for (const [i, p] of (src ?? []).entries()) {
    if (i > 0) spans.push({ text: ' ' })
    for (const c of p.children ?? []) if (c.text) spans.push(c.bold ? { text: c.text, bold: true } : { text: c.text })
  }
  return spans.length ? spans : [{ text: clean(g.displayedQuestionType) }]
}

// Bảng ghi chú (Slate): đoạn/mục danh sách/ô trống → dãy đoạn. Mục danh sách (li) thành đoạn có bullet.
function bodyOf(editorValue) {
  const paras = []
  let cur = null
  const flush = () => {
    if (cur && cur.segs.some((s) => 'blank' in s || s.text.trim())) paras.push(cur)
    cur = null
  }
  const open = (bullet) => {
    flush()
    cur = { ...(bullet ? { bullet: true } : {}), segs: [] }
  }
  const walk = (n, inLi) => {
    if (n.type === 'blank') return void (cur ??= { segs: [] }).segs.push({ blank: n.blankId ?? n.id })
    if (typeof n.text === 'string') {
      if (n.text) (cur ??= { segs: [] }).segs.push(n.bold ? { text: n.text, bold: true } : { text: n.text })
      return
    }
    const block = ['p', 'li', 'ul', 'ol'].includes(n.type)
    if (n.type === 'li') open(true)
    else if (block && !inLi) open(false)
    for (const c of n.children ?? []) walk(c, inLi || n.type === 'li')
    if (n.type === 'li') flush()
    else if (block && !inLi) flush()
  }
  for (const n of JSON.parse(editorValue)) walk(n, false)
  flush()
  // gộp các đoạn chữ liền nhau cùng kiểu, bỏ khoảng trắng thừa ở mép
  return paras.map((p) => {
    const segs = []
    for (const s of p.segs) {
      const last = segs[segs.length - 1]
      if (last && 'text' in last && 'text' in s && !!last.bold === !!s.bold) last.text += s.text
      else segs.push({ ...s })
    }
    const t0 = segs[0]
    if (t0 && 'text' in t0) t0.text = t0.text.replace(/^\s+/, '')
    const t1 = segs[segs.length - 1]
    if (t1 && 'text' in t1) t1.text = t1.text.replace(/\s+$/, '')
    return { ...(p.bullet ? { bullet: true } : {}), segs: segs.filter((s) => !('text' in s) || s.text !== '') }
  })
}

// ── 1 đề ───────────────────────────────────────────────────────────────────────────────────────
function convert(entry) {
  const d = entry.data
  const t = d.test
  const warnings = []
  let num = 1
  const sections = d.testSections.map((sec, si) => {
    const groups = []
    for (const g of sec.questionGroups) {
      const items = []
      for (const qn of g.questions) {
        const type = qn.type ?? g.questionType
        if (type === 'NOTE_FORM_COMPLETION_V2') {
          const blanks = (qn.paragraph.blanks ?? []).sort((a, b) => a.key - b.key).map((b) => b.id)
          items.push({ type: 'fill', num, heading: clean(qn.heading) || undefined, body: bodyOf(qn.paragraph.editorValue), blanks })
          num += blanks.length
        } else if (type === 'SINGLE_ANSWER') {
          items.push({ type: 'choice', num, question: clean(qn.question), options: qn.options.map((o) => clean(o.value)) })
          num += 1
        } else if (type === 'MULTIPLE_ANSWER') {
          const count = qn.maxSelectedOptions ?? 2
          items.push({ type: 'multi', num, count, question: clean(qn.question), options: qn.options.map((o) => clean(o.value)) })
          num += count
        } else if (type === 'DRAG_OUT_V2') {
          const url = qn.image.url ?? CDN + qn.image.path
          items.push({
            type: 'map',
            num,
            image: { url, width: qn.image.width, height: qn.image.height },
            spots: qn.spots.map((s) => ({ letter: s.text, x: s.x, y: s.y })),
            labels: qn.questions.map(clean),
          })
          num += qn.questions.length
        } else if (type === 'MATCHING_DRAG_DROP_V2') {
          items.push({ type: 'match', num, options: qn.options.map((o) => clean(o.value)), labels: qn.featureNames.map((f) => clean(f.value)) })
          num += qn.featureNames.length
        } else {
          warnings.push(`section ${si + 1}: dạng câu hỏi chưa hỗ trợ ${type}`)
        }
      }
      if (items.length) groups.push({ instruction: instructionOf(g), items })
    }
    const speakers = Object.fromEntries((sec.script?.characters ?? []).map((c) => [c.id, c.name]))
    const cues = (sec.script?.subtitle ?? [])
      .filter((c) => c.type === 'cue' && c.data?.text?.trim())
      .map((c) => ({ start: c.data.start, end: c.data.end, text: clean(c.data.text), ...(speakers[c.character] ? { speaker: speakers[c.character] } : {}) }))
    const audioPath = sec.script?.audio?.path
    if (!audioPath) warnings.push(`section ${si + 1}: thiếu file âm thanh`)
    const wave = Array.isArray(sec.script?.wave) && sec.script.wave.length ? sec.script.wave : undefined
    if (!wave) warnings.push(`section ${si + 1}: chưa có sóng âm (chạy lại script tải bản mới) → thanh phát vẽ tạm theo transcript`)
    // File đã tải bằng scripts/download-listening-audio.mjs (đúng dung lượng LMS báo) thì ưu tiên phát cục bộ
    const localRel = `ielts/audio/${'listening-' + slug(t.testID || t.name)}/s${si + 1}.mp3`
    const localOk = fs.existsSync(path.join('public', localRel)) && fs.statSync(path.join('public', localRel)).size === sec.script?.audio?.size
    return { id: `s${si + 1}`, title: clean(sec.name), durationMin: sec.duration, audioUrl: audioPath ? CDN + audioPath : '', audioLocal: localOk ? '/' + localRel : undefined, wave, groups, cues }
  })
  const total = num - 1
  if (total !== t.totalQuestion) warnings.push(`đếm được ${total} câu nhưng LMS báo ${t.totalQuestion}`)

  const id = 'listening-' + slug(t.testID || t.name)
  let answers, answersNote
  const af = path.join(ANSWER_DIR, `${t.testID}.json`)
  if (fs.existsSync(af)) {
    const a = JSON.parse(fs.readFileSync(af, 'utf8'))
    answers = a.answers
    answersNote = a.note
    const missing = []
    for (let n = 1; n <= total; n++) if (!answers[String(n)] && !Object.keys(answers).some((k) => sections.some((s) => s.groups.some((g) => g.items.some((it) => it.type === 'multi' && String(it.num) === k && n > it.num && n < it.num + it.count)))) ) missing.push(n)
    if (missing.length) warnings.push(`đáp án thiếu câu: ${missing.join(', ')}`)
  } else warnings.push('chưa có file đáp án → đề làm được nhưng chưa chấm điểm')

  const cover = t.coverImage?.url
  return {
    warnings,
    test: {
      id,
      skill: 'listening',
      title: clean(t.name),
      category: 'Practice test',
      part: (t.name.match(/^(.*?)\s*-\s*Listening/i)?.[1] ?? 'Listening').trim(),
      durationMin: t.totalDuration,
      ...(cover ? { coverImage: cover } : {}),
      sections,
      ...(answers ? { answers, answersNote } : {}),
    },
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

const tests = []
const seen = new Set()
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
  for (const entry of JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))) {
    const r = convert(entry)
    if (seen.has(r.test.id)) {
      console.warn('TRÙNG id, bỏ qua:', r.test.id)
      continue
    }
    seen.add(r.test.id)
    for (const w of r.warnings) console.warn(`  [${r.test.id}] ${w}`)
    tests.push(r.test)
  }
}
tests.sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }))
const out = [
  `import type { ListeningTest } from '@/lib/ielts/listening'`,
  ``,
  `// FILE SINH TỰ ĐỘNG bởi scripts/import-lms-listening.mjs từ API "online-tests" của LMS — đừng sửa tay.`,
  `// Nội dung đề Cambridge IELTS có bản quyền: chỉ commit nếu repo private. Âm thanh không nằm trong repo (audioUrl → CDN của LMS).`,
  `export const LISTENING_TESTS: ListeningTest[] = [`,
  ...tests.map((t) => '  ' + pp(t, '  ') + ','),
  `]`,
  ``,
]
fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, out.join('\n'))
console.log(`Listening: ${tests.length} đề, ${tests.reduce((n, t) => n + t.sections.reduce((m, s) => m + s.groups.reduce((k, g) => k + g.items.length, 0), 0), 0)} mục câu hỏi → ${OUT}`)
