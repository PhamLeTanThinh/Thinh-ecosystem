// Đổi JSON bài thi thử Listening tải từ LMS (scripts/lms-download-listening.console.js) thành data của app.
//   node scripts/import-lms-listening.mjs [thư-mục-json = scripts/lms-listening]
// Ghi src/data/ielts/listening/lms.ts (ghi đè toàn bộ mỗi lần chạy). Đáp án (LMS ẩn tới khi nộp bài) lấy từ
// scripts/lms-listening-answers/<testID>.json nếu có — định dạng: { "note": "nguồn…", "answers": { "1": ["egg"], "11": ["C"], "21": ["C","E"] } }.
// Âm thanh KHÔNG chép vào repo: audioUrl trỏ thẳng tới CDN của LMS (công khai, hỗ trợ tua).
import fs from 'node:fs'
import path from 'node:path'

const dir = process.argv[2] ?? 'scripts/lms-listening'
const ANSWER_DIR = path.join(path.dirname(dir), 'lms-listening-answers')
// Bản "chi tiết" (scripts/lms-download-listening-detail.console.js, GET online-tests): có sẵn đáp án + lời giải, được ưu tiên hơn bản POST.
const DETAIL_DIR = path.join(path.dirname(dir), 'lms-listening-detail')
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
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
  const blankIdOf = (n) => n.blankId ?? n.children?.[0]?.blankId ?? n.id
  const isBlank = (n) => n.type === 'blank' || n.type === 'editable-blank-void'
  // 1 ô của bảng → dãy chữ/ô trống trên 1 dòng (các đoạn trong ô nối bằng khoảng trắng)
  const cellOf = (cell) => {
    const segs = []
    const w = (n) => {
      if (isBlank(n)) return void segs.push({ blank: blankIdOf(n) })
      if (typeof n.text === 'string') {
        if (n.text) segs.push(n.bold ? { text: n.text, bold: true } : { text: n.text })
        return
      }
      for (const c of n.children ?? []) w(c)
      if (n.type === 'p') segs.push({ text: ' ' })
    }
    w(cell)
    const merged = []
    for (const s of segs) {
      const last = merged[merged.length - 1]
      if (last && 'text' in last && 'text' in s && !!last.bold === !!s.bold) last.text += s.text
      else merged.push({ ...s })
    }
    for (const s of merged) if ('text' in s) s.text = s.text.replace(/\s+/g, ' ')
    if (merged[0] && 'text' in merged[0]) merged[0].text = merged[0].text.replace(/^\s+/, '')
    const end = merged[merged.length - 1]
    if (end && 'text' in end) end.text = end.text.replace(/\s+$/, '')
    return { segs: merged.filter((s) => !('text' in s) || s.text !== ''), ...(cell.type === 'th' ? { th: true } : {}) }
  }
  const walk = (n, inLi) => {
    if (n.type === 'table') {
      flush()
      for (const tr of n.children ?? []) if (tr.type === 'tr') paras.push({ segs: [], cells: (tr.children ?? []).map(cellOf) })
      return
    }
    if (isBlank(n)) return void (cur ??= { segs: [] }).segs.push({ blank: blankIdOf(n) })
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
    return { ...(p.bullet ? { bullet: true } : {}), ...(p.cells ? { cells: p.cells } : {}), segs: segs.filter((s) => !('text' in s) || s.text !== '') }
  })
}

// ── 1 đề ───────────────────────────────────────────────────────────────────────────────────────
function convert(entry) {
  const d = entry.data
  const t = d.test
  const warnings = []
  let num = 1
  const auto = {} // đáp án rút từ chính dữ liệu LMS (nếu có): số câu → các đáp án chấp nhận được
  const optLetters = (arr) => (arr ?? []).map((o) => LETTERS[o.key]).filter(Boolean)
  const sections = d.testSections.map((sec, si) => {
    const groups = []
    for (const g of sec.questionGroups) {
      const items = []
      for (const qn of g.questions) {
        const type = qn.type ?? g.questionType
        if (type === 'NOTE_FORM_COMPLETION_V2' || type === 'NOTE_COMPLETION_NO_HINT') {
          const blanks = (qn.paragraph.blanks ?? []).sort((a, b) => a.key - b.key).map((b) => b.id)
          items.push({ type: 'fill', num, heading: clean(qn.heading) || undefined, body: bodyOf(qn.paragraph.editorValue), blanks })
          // "color/colour", "ten days/10 days" → các đáp án chấp nhận được
          for (const a of qn.correctAnswers ?? []) auto[num + a.key] = String(a.value).split('/').map((x) => x.trim()).filter(Boolean)
          num += blanks.length
        } else if (type === 'FLOW_CHART_GAP_FILL_V2') {
          // Sơ đồ các bước (STEP 1…): trình bày như ghi chú — mỗi bước là 1 đoạn mở đầu bằng tên bước in đậm
          const body = []
          const blankKeys = []
          for (const st of qn.sentences ?? []) {
            const paras = bodyOf(st.editorValue)
            if (paras[0] && st.title) paras[0].segs.unshift({ text: clean(st.title) + ': ', bold: true })
            body.push(...paras)
            blankKeys.push(...(st.blanks ?? []))
          }
          const blanks = blankKeys.sort((a, b) => a.key - b.key).map((b) => b.id)
          items.push({ type: 'fill', num, heading: clean(qn.heading) || undefined, body, blanks })
          for (const a of qn.correctAnswers ?? []) auto[num + a.key] = String(a.value).split('/').map((x) => x.trim()).filter(Boolean)
          num += blanks.length
        } else if (type === 'TABLE_COMPLETION') {
          // Bảng điền: mỗi hàng là 1 đoạn có cells (xem bodyOf); ô trống đánh số theo key
          const blanks = (qn.blanks ?? []).slice().sort((a, b) => a.key - b.key).map((b) => b.id)
          items.push({ type: 'fill', num, heading: clean(qn.question) || undefined, body: bodyOf(qn.editorValue), blanks })
          for (const a of qn.correctAnswers ?? []) auto[num + a.key] = String(a.value).split('/').map((x) => x.trim()).filter(Boolean)
          num += blanks.length
        } else if (type === 'SENTENCE_COMPLETE') {
          // Mỗi câu 1 đoạn, ô trống nằm trong câu
          const body = []
          const blankKeys = []
          for (const st of qn.sentences ?? []) {
            body.push(...bodyOf(st.editorValue))
            blankKeys.push(...(st.blanks ?? []))
          }
          const blanks = blankKeys.sort((a, b) => a.key - b.key).map((b) => b.id)
          items.push({ type: 'fill', num, body, blanks })
          for (const a of qn.correctAnswers ?? []) auto[num + a.key] = String(a.value).split('/').map((x) => x.trim()).filter(Boolean)
          num += blanks.length
        } else if (type === 'SHORT_ANSWER') {
          // Câu hỏi ngắn: mỗi câu là 1 đoạn "câu hỏi + ô trống" (id ô trống tự đặt: sa-<key>)
          const sents = (qn.sentences ?? []).slice().sort((a, b) => a.key - b.key)
          items.push({ type: 'fill', num, body: sents.map((x) => ({ segs: [{ text: clean(x.text) + ' ' }, { blank: 'sa-' + x.key }] })), blanks: sents.map((x) => 'sa-' + x.key) })
          for (const a of qn.correctAnswers ?? []) auto[num + a.key] = String(a.value).split('/').map((x) => x.trim()).filter(Boolean)
          num += sents.length
        } else if (type === 'DRAG_IN') {
          // Kéo đáp án (danh sách chữ) vào các vị trí đánh số trên hình
          const url = qn.image.url ?? CDN + qn.image.path
          items.push({
            type: 'match',
            num,
            options: qn.options.map(clean),
            labels: qn.questions.map((_, i) => 'Vị trí ' + (num + i) + ' trên hình'),
            image: { url, width: qn.image.width, height: qn.image.height },
            spots: qn.questions.map((x, i) => ({ label: String(num + i), x: x.x, y: x.y })),
          })
          ;(qn.correctOptions ?? []).forEach((o, i) => (auto[num + i] = [LETTERS[o.key]]))
          num += qn.questions.length
        } else if (type === 'SINGLE_ANSWER') {
          items.push({ type: 'choice', num, question: clean(qn.question), options: qn.options.map((o) => clean(o.value)) })
          if (qn.correctOptions?.length) auto[num] = optLetters(qn.correctOptions)
          num += 1
        } else if (type === 'MULTIPLE_ANSWER') {
          const count = qn.maxSelectedOptions ?? 2
          items.push({ type: 'multi', num, count, question: clean(qn.question), options: qn.options.map((o) => clean(o.value)) })
          if (qn.correctOptions?.length) auto[num] = optLetters(qn.correctOptions).sort()
          num += count
        } else if (type === 'DRAG_OUT_V2' || type === 'DRAG_OUT') {
          const url = qn.image.url ?? CDN + qn.image.path
          items.push({
            type: 'map',
            num,
            image: { url, width: qn.image.width, height: qn.image.height },
            spots: qn.spots.map((s) => ({ letter: s.text, x: s.x, y: s.y })),
            labels: qn.questions.map(clean),
          })
          // correctOptions[i] = đáp án của câu thứ i (theo thứ tự nhãn); key là chỉ số vị trí A, B, C…
          ;(qn.correctOptions ?? []).forEach((o, i) => (auto[num + i] = [LETTERS[o.key]]))
          num += qn.questions.length
        } else if (type === 'MATCHING_DRAG_DROP_V2') {
          items.push({ type: 'match', num, options: qn.options.map((o) => clean(o.value)), labels: qn.featureNames.map((f) => clean(f.value)) })
          ;(qn.correctOptions ?? []).forEach((o, i) => (auto[num + i] = [LETTERS[o.key]]))
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
  const overlay = fs.existsSync(af) ? JSON.parse(fs.readFileSync(af, 'utf8')) : null
  const multis = sections.flatMap((s) => s.groups.flatMap((g) => g.items.filter((it) => it.type === 'multi')))
  const missingOf = (ans) => {
    const missing = []
    // câu thứ 2 trở đi của 1 mục "chọn nhiều" nằm chung trong đáp án của câu đầu
    for (let n = 1; n <= total; n++) if (!ans[String(n)] && !multis.some((m) => n > m.num && n < m.num + m.count && ans[String(m.num)])) missing.push(n)
    return missing
  }
  if (Object.keys(auto).length) {
    answers = Object.fromEntries(Object.entries(auto))
    answersNote = 'Đáp án và lời giải chính thức của LMS (GET online-tests).'
    const missing = missingOf(answers)
    if (missing.length) warnings.push(`đáp án LMS thiếu câu: ${missing.join(', ')}`)
    if (overlay) {
      // đối chiếu với file đáp án nhập tay (nếu có): lệch chỗ nào báo chỗ đó
      const diff = Object.keys(overlay.answers).filter((k) => JSON.stringify((overlay.answers[k] ?? []).map((x) => String(x).toLowerCase()).sort()) !== JSON.stringify((answers[k] ?? []).map((x) => String(x).toLowerCase()).sort()))
      warnings.push(diff.length ? `đáp án LMS KHÁC file nhập tay ở câu: ${diff.join(', ')}` : 'đáp án LMS khớp hoàn toàn file nhập tay')
    }
  } else if (overlay) {
    answers = overlay.answers
    answersNote = overlay.note
    const missing = missingOf(answers)
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

// Bản chi tiết (GET) có dạng { detail: { id, name, testSections… } } → ghép về dạng { data: { test, testSections } } như bản POST.
const fromDetail = (e) => {
  const secs = e.detail.testSections
  return {
    data: {
      test: {
        testID: secs[0].testSectionId.replace(/_S\d+$/, ''),
        name: e.detail.name,
        totalQuestion: secs.reduce((n, s) => n + (s.totalQuestion ?? 0), 0),
        totalDuration: secs.reduce((n, s) => n + (s.duration ?? 0), 0),
        coverImage: e.detail.coverImage,
      },
      testSections: secs,
    },
  }
}
const entries = []
const readJsonDir = (d, map) => {
  if (!fs.existsSync(d)) return
  for (const f of fs.readdirSync(d).filter((x) => x.endsWith('.json')).sort()) for (const e of JSON.parse(fs.readFileSync(path.join(d, f), 'utf8'))) entries.push(map(e))
}
readJsonDir(DETAIL_DIR, fromDetail) // trước: bản có đáp án thắng khi trùng đề
readJsonDir(dir, (e) => e)

const tests = []
const seen = new Set()
for (const entry of entries) {
  {
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
