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
