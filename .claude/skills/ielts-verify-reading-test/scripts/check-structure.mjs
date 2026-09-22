#!/usr/bin/env node
// Heuristic structural checker for a PracticeTest object in src/data/ielts/practice/reading.ts.
// NOT a real TS/AST parser — just regexes over the object-literal text (tolerates both quote
// styles found in this codebase: 'id': 'q1' TS-literal style and "id": "q1" JSON-paste style, and
// both single-line and prettier-wrapped multi-line field layouts). Good enough to catch typos
// (duplicate ids, out-of-range/mismatched locate quotes, answers that don't exist in their own
// option set) but does NOT check whether an answer is actually CORRECT — that's a semantic
// judgement call, see the skill's SKILL.md for the required manual re-read pass.
//
// Usage: node check-structure.mjs <reading-test-id> [path-to-reading.ts]
// Example: node check-structure.mjs reading-venus-in-transit

import { readFileSync } from 'node:fs'

const testId = process.argv[2]
const filePath = process.argv[3] ?? 'src/data/ielts/practice/reading.ts'

if (!testId) {
  console.error('Usage: node check-structure.mjs <reading-test-id> [path-to-reading.ts]')
  process.exit(1)
}

const src = readFileSync(filePath, 'utf8')
const Q = `['"]`
const startRe = new RegExp(`id:\\s*${Q}${testId}${Q}`)
const startM = startRe.exec(src)
if (!startM) {
  console.error(`Test id not found: ${testId}`)
  process.exit(1)
}
const start = startM.index
// End of this test object: next top-level "  {" that starts another test, or EOF.
const nextStart = src.indexOf('\n  {\n', start)
const block = nextStart === -1 ? src.slice(start) : src.slice(start, nextStart)

let problems = 0
function fail(msg) {
  problems++
  console.log(`✕ ${msg}`)
}
function pass(msg) {
  console.log(`✓ ${msg}`)
}

// Pulls every '...'/"..." string literal out of a bracketed span (handles \' \" escapes).
function strings(span) {
  const re = /['"]((?:[^'"\\]|\\.)*)['"]/g
  const out = []
  let m
  while ((m = re.exec(span))) out.push(m[1])
  return out
}

// ── passage / paragraphLabels ──────────────────────────────────────────────
const labelsM = block.match(/paragraphLabels:\s*\[([^\]]*)\]/)
const labels = labelsM ? strings(labelsM[1]) : []

const passageStart = block.indexOf('passage:')
const passageOpen = block.indexOf('[', passageStart)
const passageClose = block.indexOf('],', passageOpen)
const paras = strings(block.slice(passageOpen, passageClose))

if (labels.length === paras.length) pass(`paragraphLabels (${labels.length}) matches passage length (${paras.length})`)
else fail(`paragraphLabels has ${labels.length} entries but passage has ${paras.length} paragraphs`)

// ── matchLegend / optionBank blocks, in file order (nearest-preceding one is attributed to a
//    question further down — this is why order in the source matters). ────────────────────────
const contextBlocks = []
const legendRe = /matchLegend:\s*\[([\s\S]*?)\n\s*\],/g
let lg
while ((lg = legendRe.exec(block))) {
  const keys = [...lg[1].matchAll(/key:\s*['"](\w+)['"]/g)].map((m) => m[1])
  contextBlocks.push({ at: lg.index, kind: 'match', keys })
}
const bankRe = /optionBank:\s*\[([\s\S]*?)\n\s*\],/g
let bk
while ((bk = bankRe.exec(block))) {
  contextBlocks.push({ at: bk.index, kind: 'bank', keys: strings(bk[1]) })
}
contextBlocks.sort((a, b) => a.at - b.at)

function nearestContext(pos) {
  let best = null
  for (const c of contextBlocks) {
    if (c.at < pos) best = c
    else break
  }
  return best
}

// ── questions: split the block into spans by each "id: 'qN'" occurrence ────────────────────────
const idRe = new RegExp(`\\{\\s*(?:${Q})?id${Q}?:\\s*${Q}(q\\d+)${Q}`, 'g')
const hits = []
let im
while ((im = idRe.exec(block))) hits.push({ id: im[1], at: im.index })

const seenIds = new Set()
for (let i = 0; i < hits.length; i++) {
  const { id, at } = hits[i]
  const end = i + 1 < hits.length ? hits[i + 1].at : block.length
  const span = block.slice(at, end)

  if (seenIds.has(id)) fail(`duplicate question id: ${id}`)
  seenIds.add(id)

  const typeM = span.match(new RegExp(`type${Q}?:\\s*${Q}(\\w[\\w-]*)${Q}`))
  const type = typeM?.[1]
  if (!type) {
    fail(`${id}: couldn't find a "type" field — check manually`)
    continue
  }

  const answerM = span.match(new RegExp(`answer${Q}?:\\s*${Q}((?:[^'"\\\\]|\\\\.)*)${Q}`))
  const answer = answerM?.[1]
  if (answer === undefined) {
    fail(`${id} (${type}): no "answer" field found (or it contains something the regex couldn't parse — check manually)`)
  } else if (type === 'tfng') {
    if (!['True', 'False', 'Not Given'].includes(answer)) fail(`${id} (tfng): answer "${answer}" is not True/False/Not Given`)
  } else if (type === 'match') {
    const ctx = nearestContext(at)
    if (!ctx || ctx.kind !== 'match') fail(`${id} (match): no matchLegend found before this question`)
    else if (!ctx.keys.includes(answer)) fail(`${id} (match): answer "${answer}" not in nearest matchLegend keys [${ctx.keys.join(',')}]`)
  } else if (type === 'bank') {
    const ctx = nearestContext(at)
    if (!ctx || ctx.kind !== 'bank') fail(`${id} (bank): no optionBank found before this question`)
    else if (!ctx.keys.includes(answer)) fail(`${id} (bank): answer text not found verbatim in nearest optionBank`)
  } else if (type === 'mcq') {
    const optM = span.match(/options:\s*\[([\s\S]*?)\n\s*\],/)
    const opts = optM ? strings(optM[1]) : []
    if (opts.length === 0) fail(`${id} (mcq): no options array found`)
    else if (!opts.includes(answer)) fail(`${id} (mcq): answer not found verbatim in its own options`)
  }

  // locate quotes must be verbatim substrings of passage[para] — tolerate newlines/whitespace
  // between "para:" and "text:" since prettier may wrap these onto separate lines.
  const locateBlockM = span.match(/locate:\s*\[([\s\S]*?)\]/)
  let hadLocate = false
  if (locateBlockM) {
    const locateRe = new RegExp(`para:\\s*(\\d+)[\\s\\S]*?text:\\s*${Q}((?:[^'"\\\\]|\\\\.)*)${Q}`, 'g')
    let lm
    while ((lm = locateRe.exec(locateBlockM[1]))) {
      hadLocate = true
      const para = Number(lm[1])
      const text = lm[2]
      const p = paras[para]
      if (p === undefined) fail(`${id}: locate para=${para} is out of range (passage has ${paras.length} paragraphs)`)
      else if (!p.includes(text)) fail(`${id}: locate text not found verbatim in paragraph ${para} — check for smart-quote / wording mismatch`)
    }
  }
  if (!hadLocate) console.log(`  (info) ${id}: no locate found — fine if intentional, but worth a second look`)
}

console.log(`\n${seenIds.size} questions checked.`)
if (problems === 0) {
  console.log('✓ No structural problems found. This does NOT mean the answers are correct — do the manual re-read pass from SKILL.md next.')
} else {
  console.log(`✕ ${problems} structural problem(s) found — fix these before doing the semantic re-read pass.`)
  process.exitCode = 1
}
