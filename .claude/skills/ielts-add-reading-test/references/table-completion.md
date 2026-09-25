# Table completion (fill blanks inside a labeled table)

Source shows a real table (e.g. "The Early History of Cinnamon" with row labels like "Biblical
times", "Ancient Rome", each row containing prose text with one or more blanks to fill). This is
`PracticeGroup.table` (a `TableLayout`) plus `gap-fill`/`table`-typed questions referenced by id
from inside the table's cells — see `reading.ts`'s "Bringing Cinnamon To Europe" `g1` group for
the full worked example (it's long, this doc shows the shape, not a full copy).

```ts
{
  id: 'g1',
  instruction: 'Complete the table below. Choose **ONE WORD ONLY** from the passage for each answer.',
  table: {
    title: 'The Early History of Cinnamon',
    rows: [
      { label: 'Biblical times', lines: [{ q: 'q1' }, { q: 'q2' }] },
      { label: 'Ancient Rome', lines: [{ q: 'q3' }] },
      {
        label: 'Middle Ages:',
        lines: [
          'added to food, especially meat',   // plain prose line, no blank
          { q: 'q4' },
          { q: 'q5' },
        ],
      },
    ],
  },
  questions: [
    { id: 'q1', type: 'gap-fill', prompt: 'It was known in biblical times as an ingredient mixed with ___', answer: 'oils', explanation: EXPLAIN.q1, locate: [...] },
    // q2..q5, same shape — type can be 'gap-fill' or 'table', both render as an inline input
  ],
}
```

Each `TableLayout.rows[].lines` entry is either a plain string (static prose, no input) or
`{ q: '<questionId>' }`, which renders that question's `prompt` in place — the `prompt` should
contain `___` marking where the fillable blank sits within that row's text, and the row's
`renderQ` call passes `inline: true` automatically so it renders compactly inside the cell rather
than as a full bordered question card.

Answers here are usually short (the instruction states a word limit, e.g. "ONE WORD ONLY" or
"NO MORE THAN TWO WORDS") — `answer` should be the exact word(s) as they appear in the passage,
and use `alt` for accepted variants (e.g. singular/plural) rather than making `answer` a
comma-separated guess.

Don't confuse this with `matrix-match.md`'s `match` type just because both render as literal
tables — `table` here is about filling blanks inside table cells; `match` is about picking a
shared-legend letter per statement row. If nothing needs filling in and the questions are instead
"which letter applies to this row", it's `match`, not `table`.

## Note completion (bulleted notes, no table)

Source shows a small card with a title (e.g. "The nutmeg tree and fruit") and a **bullet list**,
some bullets containing a blank and some plain (no blank). Same data shape as a table, plus
`bullets: true` — the renderer flattens every row's `lines` into one `<ul>` and ignores `label`,
so use a single row with `label: ''`:

```ts
table: {
  title: 'The nutmeg tree and fruit',
  bullets: true,
  rows: [{ label: '', lines: [{ q: 'q1' }, { q: 'q2' }, 'The tree has yellow flowers and fruit'] }],
},
```

A table with **no title** in the source: pass `title: ''` — the heading is skipped. Worked example
for both: `reading.ts` "Nutmeg — a valuable spice" (g1 bullets, g3 untitled table).

Notes with **underlined sub-headings** (e.g. "Appearance and behaviour" / "Decline and extinction"):
one row per sub-heading, `label` = the sub-heading text — in `bullets` mode a non-empty `label` is
rendered as a sub-heading above that row's bullet list. Worked example: "The thylacine" g1.

Table with a **column-header row** (e.g. TEST | FINDINGS) → `headers: ['TEST', 'FINDINGS']`.
A blank **inside the left column** → `labelLines: [{ q: 'q1' }]` on that row (rendered instead of
`label`, in normal weight); keep `label: ''`. Worked example: "The Benefits of Being Bilingual" g1.

**Summary completion** — a titled card holding ONE flowing paragraph with several blanks (e.g. "The
writer’s own bias … 12 ___, and … 13 ___ people … Earth’s 14 ___, except …"): `summary: true`, one
row, each question's `prompt` is its consecutive chunk of the paragraph (with its `___`). The chunks
render inline as one paragraph. Worked example: "What is exploration?" g3.
