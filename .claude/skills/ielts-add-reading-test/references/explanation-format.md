# Structured explanation format (applies to every question type)

Default to this structured `Explanation` object, not a plain string — it's what gives the review
page the color-coded paraphrase comparison and sentence breakdown, and it's the established look
for this app regardless of which question type the explanation belongs to. Only fall back to a
plain `explanation: '...'` string if the user explicitly wants something quick, and say so.

## Per-test explain file

One file per test: `src/data/ielts/practice/<slug>-explain.ts`, imported into `reading.ts` with an
alias (`import { EXPLAIN as <SLUG>_EXPLAIN } from './<slug>-explain'` — a bare `EXPLAIN` re-import
collides once there's more than one test file). Skeleton:

```ts
import type { ChipColor, ExChip, Explanation } from '@/lib/ielts/practice'

const chip = (color: ChipColor) => (text: string, label?: string): ExChip => ({ text, color, label })
const o = chip('orange')
const g = chip('green')
const b = chip('blue')
const s = (text: string, color?: ChipColor) => ({ text, color })

export const EXPLAIN: Record<string, Explanation> = {
  q1: {
    paraphrase: { question: [...], pairs: [...] },
    breakdown: { sentences: [...] },
    notes: '...',
  },
  // q2, q3, ...
}
```

## What each field is for

- **`paraphrase`** — how the question's wording maps onto the passage's wording. `question` is the
  question text broken into colored chips (`s('phrase', 'orange')`, or plain `s('phrase')` with no
  second argument for uncolored connective text). `pairs` is the list of `{ left, right, rel?,
  note? }` comparisons — `left` is a chip from the question, `right` the matching chip from the
  passage (built with `o()/g()/b()`, same color as its `left` counterpart so the pairing is
  traceable), `rel` defaults to `'='` (use `'≠'` for a contrast/negation relationship), and `note`
  covers cases needing a short aside (an inference rather than a direct synonym) or a claim with no
  `right` counterpart at all — evidence not in the passage, the pattern for Not Given/elimination
  reasoning.

- **`breakdown`** — a near-verbatim sentence (or a few, numbered via `n` when evidence spans more
  than one) from the passage, split into chips labeled with their grammatical role (`'S'`, `'V'`,
  or a short gloss) so the reader can see how the evidence sentence is built. `prefix: 'Bài đọc
  cho biết:'` is handy when introducing a quote.

- **`notes`** — step-by-step Vietnamese reasoning, one arrow (`→`) per step, ending in a conclusion
  line. Supports `**bold**`, `{ok}` (green check, after the right answer), `{no}` (red cross,
  after each eliminated wrong option with a one-line reason), and `[[N]]` (numbered badge
  referencing `breakdown` sentence `n`). Keep it terse and scannable, not a full essay.

## Worked example (abbreviated)

```ts
q1: {
  paraphrase: {
    question: [s('most managers', 'orange'), s(' '), s('are unaware of', 'green'), s(' the '), s('significant impact', 'blue'), s(' trends have on consumers’ lives.')],
    pairs: [
      { left: o('managers'), right: o('managers') },
      { left: g('are unaware of', 'không nhận ra'), right: g('fail to recognize', 'không nhận ra') },
      { left: b('significant impact...on consumers’ lives'), right: b('profound ways...influencing consumers’ aspirations, attitudes, and behaviors') },
    ],
  },
  breakdown: {
    sentences: [{ chips: [b('managers', 'S'), b('often fail to recognize', 'V'), g('the less obvious but profound ways', 'profound = significant'), b('these trends are influencing consumers’ aspirations, attitudes, and behaviors', '= consumers’ lives')] }],
  },
  notes: '→ profound = significant, influencing...aspirations/attitudes/behaviors = impact on consumers\' lives\n⇒ Chọn D {ok}',
},
```

## Pitfall

`s()`'s second argument is a `ChipColor` (`'orange' | 'green' | 'blue'`), **not** a free label —
passing `''` or a description string there is a TypeScript error (`Argument of type '""' is not
assignable to parameter of type 'ChipColor | undefined'`). If a `question` chip needs no color
(plain connective text like "and" or "you should"), omit the second argument entirely rather than
passing an empty string.

## Step-by-step format (`detail`) — "Linear thinking" for T/F/NG & Y/N/NG

When the user wants the 4-step layout (Step 01 read question → Step 02 locate → Step 03 read
evidence → Step 04 compare meaning, then "vì sao đáp án khác sai"), use `detail` instead of
`breakdown` + `notes`. It's an ordered array mixing text lines and chip rows, rendered exactly in
that order (so a "Simplified:" chip row can sit right under its step heading):

- string → a paragraph (`**bold**`, `*italic*`, `{ok}`, `{no}`, `[[N]]`); `'---'` → dashed divider;
  a string starting with `'• '` → indented bullet.
- `{ prefix?, chips }` (an `ExSentence`) → a chip row; `prefix` supports `**bold**`.
- Don't nest bold inside italic (`*a **b** c*`) — split into separate runs instead.

`ChipColor` also has `'red'` (e.g. the verb/claim that the passage doesn't support). In
`paraphrase.pairs`, a pair with `note` but no `right` renders the note in bold orange — use it for
the "→ Không được nhắc đến trong bài ⇒ **NOT GIVEN**" line. Worked example: `thylacine-explain.ts` q13.

**Default for every `tfng` / `ynng` question:** keep the `paraphrase` block, and write the detail
with the shared builder `linear()` from `src/data/ielts/practice/linear.ts` instead of hand-writing
`detail` (or `breakdown` + `notes`):

```ts
import { linear } from './linear'
const r = chip('red')

q9: {
  paraphrase: { ... },
  detail: linear({
    yn: true,                         // Yes/No/Not Given; omit for True/False/Not Given
    question: [g('SETI scientists', 'S'), r('are trying to find a life form that…', 'V - …'), '.'],
    keywords: '"SETI scientists", "life form", "resembles"',
    where: 'đoạn B',                  // or 'đoạn 7' when the passage has no letter labels
    topic: 'nói về các giả định của nhà khoa học SETI',
    quote: 'we make … assumption that **we are looking for a life form that is pretty well like us** …',
    evidence: [[g('we', 'S'), b('are looking for', 'V'), r('a life form that is pretty well like us', '…')]],
    result: [...],                    // optional "→ Result:" chip row
    mainIdea: '…', inPassage: '…', inQuestion: '…', conclusion: '…',
    answer: 'YES',
    others: [['NO', 'chỉ đúng nếu … → …'], ['NOT GIVEN', '…']],
  }),
},
```

Every existing T/F/NG and Y/N/NG question across all reading tests uses this — keep new ones consistent.
