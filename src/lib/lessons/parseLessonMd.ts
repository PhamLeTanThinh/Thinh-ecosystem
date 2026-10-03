import type { Lesson, LessonBlock, LessonBoxKind, LessonSection, LessonTerm } from './types'

// Định dạng 1 file bài học:
//
//   ---
//   title: Tên bài
//   short: Tên ngắn
//   icon: 📈
//   summary: 1-2 câu giới thiệu
//   ---
//   # Mục tiêu            ← danh sách "- " (mục đặc biệt)
//   # <Tên phần>          ← mỗi "# " là 1 phần nội dung
//   # Ghi nhớ nhanh       ← danh sách "- " (mục đặc biệt)
//   # Thuật ngữ           ← "- **Term** (Full name): giải thích" (mục đặc biệt)
//
// Trong 1 phần: đoạn văn, "### " tiêu đề nhỏ, "- " / "1. " danh sách, bảng "| a | b |", khối ```code```,
// hộp "::: example|analogy|tip|warn|formula Tiêu đề" ... ":::", hình "![chú thích](/it/ml/x.webp =1200x600)", đồ thị động "!viz[chú thích](tên)". Inline: **đậm**, `code`, [[thuật ngữ]]
// hoặc [[chữ hiển thị|thuật ngữ]] (hiện giải thích khi rê chuột/chạm).

const BOX_KINDS: LessonBoxKind[] = ['example', 'analogy', 'tip', 'warn', 'formula']
const SPECIAL = { goals: 'mục tiêu', takeaways: 'ghi nhớ nhanh', terms: 'thuật ngữ' }

function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Tách ô theo "|" — trừ "\|" (dấu gạch đứng thật trong ô, vd trị tuyệt đối |θ|)
const splitRow = (line: string) =>
  line
    .trim()
    .replace(/^\||\|$/g, '')
    .split(/(?<!\\)\|/)
    .map((c) => c.trim().replace(/\\\|/g, '|'))

export function parseBlocks(lines: string[]): LessonBlock[] {
  const blocks: LessonBlock[] = []
  let para: string[] = []
  const flush = () => {
    if (para.length) blocks.push({ t: 'p', text: para.join(' ') })
    para = []
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/\s+$/, '')

    if (/^```/.test(line)) {
      flush()
      const lang = line.slice(3).trim() || undefined
      const code: string[] = []
      while (++i < lines.length && !/^```/.test(lines[i])) code.push(lines[i].replace(/\s+$/, ''))
      blocks.push({ t: 'code', lang, code: code.join('\n') })
      continue
    }

    const box = line.match(/^:::\s*(\w+)\s*(.*)$/)
    if (box && BOX_KINDS.includes(box[1] as LessonBoxKind)) {
      flush()
      const inner: string[] = []
      while (++i < lines.length && lines[i].trim() !== ':::') inner.push(lines[i])
      blocks.push({ t: 'box', kind: box[1] as LessonBoxKind, title: box[2] || undefined, blocks: parseBlocks(inner) })
      continue
    }

    if (!line.trim()) {
      flush()
      continue
    }

    const viz = line.trim().match(/^!viz\[([^\]]*)\]\(([\w-]+)\)$/)
    if (viz) {
      flush()
      blocks.push({ t: 'viz', caption: viz[1], name: viz[2] })
      continue
    }

    const img = line.trim().match(/^!\[([^\]]*)\]\((\S+?)(?:\s+=(\d+)x(\d+))?\)$/)
    if (img) {
      flush()
      blocks.push({ t: 'img', caption: img[1], src: img[2], width: img[3] ? Number(img[3]) : undefined, height: img[4] ? Number(img[4]) : undefined })
      continue
    }

    if (line.startsWith('### ')) {
      flush()
      blocks.push({ t: 'h3', text: line.slice(4).trim() })
      continue
    }

    if (line.trim().startsWith('|')) {
      flush()
      const rows: string[][] = []
      for (; i < lines.length && lines[i].trim().startsWith('|'); i++) {
        if (/^\s*\|[\s:|-]+\|\s*$/.test(lines[i])) continue // dòng phân cách |---|---|
        rows.push(splitRow(lines[i]))
      }
      i--
      blocks.push({ t: 'table', head: rows[0] ?? [], rows: rows.slice(1) })
      continue
    }

    const ul = line.match(/^(\s*)[-*] (.*)$/)
    const ol = line.match(/^(\s*)\d+[.)] (.*)$/)
    if (ul || ol) {
      flush()
      const [, indent, text] = (ul ?? ol)!
      const level = Math.floor(indent.length / 2)
      const last = blocks[blocks.length - 1]
      // Mục lồng (thụt lề) luôn nối vào danh sách đang mở, kể cả khác kiểu "-" / "1."
      if (last && (last.t === 'ul' || last.t === 'ol') && lines[i - 1]?.trim() && (level > 0 || last.t === (ul ? 'ul' : 'ol'))) {
        last.items.push(text)
        last.levels.push(level)
      } else blocks.push({ t: ul ? 'ul' : 'ol', items: [text], levels: [level] })
      continue
    }

    // Dòng tiếp nối của 1 mục danh sách (thụt lề, không có dấu "- ")
    const last = blocks[blocks.length - 1]
    if (!para.length && /^\s{2,}\S/.test(line) && last && (last.t === 'ul' || last.t === 'ol') && lines[i - 1]?.trim()) {
      last.items[last.items.length - 1] += ' ' + line.trim()
      continue
    }

    para.push(line.trim())
  }
  flush()
  return blocks
}

const listItems = (lines: string[]) =>
  lines
    .map((l) => l.match(/^\s*[-*] (.*)$/)?.[1]?.trim())
    .filter((s): s is string => !!s)

function parseTerms(lines: string[]): LessonTerm[] {
  const out: LessonTerm[] = []
  for (const l of lines) {
    const m = l.match(/^\s*[-*] \*\*(.+?)\*\*(?:\s*\(([^)]+)\))?\s*:\s*(.+)$/)
    if (m) out.push({ term: m[1].trim(), full: m[2]?.trim(), explain: m[3].trim() })
  }
  return out
}

export function parseLessonMd(slug: string, raw: string): Lesson {
  const text = raw.replace(/\r/g, '')
  const fm = text.match(/^---\n([\s\S]*?)\n---\n/)
  const meta: Record<string, string> = {}
  for (const l of (fm?.[1] ?? '').split('\n')) {
    const m = l.match(/^(\w+):\s*(.*)$/)
    if (m) meta[m[1]] = m[2].trim().replace(/^(['"])(.*)\1$/, '$2') // bỏ cặp nháy bao ngoài nếu có
  }
  const body = fm ? text.slice(fm[0].length) : text

  const parts: { heading: string; lines: string[] }[] = []
  let inFence = false
  for (const line of body.split('\n')) {
    if (/^```/.test(line)) inFence = !inFence
    if (!inFence && /^# /.test(line)) parts.push({ heading: line.slice(2).trim(), lines: [] })
    else parts[parts.length - 1]?.lines.push(line)
  }

  let goals: string[] = []
  let takeaways: string[] = []
  let terms: LessonTerm[] = []
  const sections: LessonSection[] = []
  for (const p of parts) {
    const key = p.heading.toLowerCase()
    if (key === SPECIAL.goals) goals = listItems(p.lines)
    else if (key === SPECIAL.takeaways) takeaways = listItems(p.lines)
    else if (key === SPECIAL.terms) terms = parseTerms(p.lines)
    else sections.push({ id: slugify(p.heading), heading: p.heading, blocks: parseBlocks(p.lines) })
  }

  const words = body.split(/\s+/).filter(Boolean).length
  return {
    slug,
    title: meta.title ?? slug,
    short: meta.short ?? meta.title ?? slug,
    icon: meta.icon ?? '📘',
    summary: meta.summary ?? '',
    goals,
    sections,
    takeaways,
    terms,
    minutes: Math.max(1, Math.round(words / 200)),
  }
}

// Gộp thuật ngữ của mọi bài thành 1 bảng tra cứu chung (khoá = term viết thường) — bài sau nhắc lại
// thuật ngữ đã giải thích ở bài trước vẫn hiện được giải thích. Đồng thời bổ sung vào danh sách
// thuật ngữ của từng bài những thuật ngữ bài đó nhắc tới bằng [[...]] nhưng khai báo ở bài khác.
export function linkGlossary(lessons: Lesson[], raws: string[]): { lessons: Lesson[]; glossary: Record<string, LessonTerm> } {
  const glossary: Record<string, LessonTerm> = {}
  for (const l of lessons) for (const t of l.terms) glossary[t.term.toLowerCase()] ??= t

  const linked = lessons.map((l, i) => {
    const own = new Set(l.terms.map((t) => t.term.toLowerCase()))
    const extra: LessonTerm[] = []
    for (const m of raws[i].matchAll(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g)) {
      const key = (m[2] ?? m[1]).trim().toLowerCase()
      if (!own.has(key) && glossary[key]) {
        own.add(key)
        extra.push(glossary[key])
      }
    }
    return { ...l, terms: [...l.terms, ...extra] }
  })
  return { lessons: linked, glossary }
}
