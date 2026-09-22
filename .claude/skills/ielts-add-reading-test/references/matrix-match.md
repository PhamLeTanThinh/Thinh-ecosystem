# Matrix matching (câu 6-11 style — "Match each statement with A/B/C/D")

Source shows a grid: column headers A/B/C/D, each row a statement, a checkmark under the column
the user picks, plus a legend below explaining what each letter means (e.g. A=Coach, B=Tesco).
This is the app's `match` question type, rendered by `MatchGroup` in `TestRunner.tsx` /
`AnswerReview.tsx` — a real matrix, not a vertical option list.

```ts
{
  id: 'g2',
  instruction: 'Match each statement with the correct company, **A, B, C** or **D**.',
  matchLegend: [
    { key: 'A', label: 'Coach' },
    { key: 'B', label: 'Tesco' },
    { key: 'C', label: 'Nike' },
    { key: 'D', label: 'iToys' },
  ],
  questions: [
    {
      id: 'q6',
      type: 'match',
      prompt: 'It turned the notion that its products could have harmful effects to its own advantage.',
      answer: 'D',   // the LEGEND KEY, not the label — 'D', not 'iToys'
      locate: [{ para: 7, text: 'By reaffirming the toy category’s association with physical play, the ME2 counteracted some of the widely perceived negative impacts of digital gaming devices' }],
      explanation: EXPLAIN.q6,
    },
    // q7..q11, same shape
  ],
}
```

`matchLegend` lives on the **group**, once — not repeated per question. Every question in the
group must be `type: 'match'` with no `options` field (the shared legend supplies the choices).

## Variant: "Which paragraph contains the following information?"

Same `match` mechanics, but the legend keys ARE the paragraph letters themselves (matching
`paragraphLabels`) rather than short labels for something else — there's nothing meaningful to put
in `label`, so use `label: ''` for every entry (the matrix still needs one legend row per column
to render the header, the footer legend list just ends up showing bare letters, which is correct
here since the passage's own paragraph markers already convey what A/B/C… mean).

```ts
matchLegend: [
  { key: 'A', label: '' },
  { key: 'B', label: '' },
  // ... one per paragraphLabels entry
],
questions: [
  { id: 'q1', type: 'match', prompt: 'examples of different ways in which the parallax principle has been applied', answer: 'F', /* ... */ },
],
```

This variant often benefits from **multiple `locate` entries** per question (an array with more
than one `{ para, text }`) when the matching paragraph covers more than one idea relevant to the
prompt — don't force it down to a single quote if the paragraph's evidence is spread across two
sentences.

## Recognizing this pattern vs `select-choices.md`'s `mcq`

The tell is whether the **same fixed set of options is reused verbatim** across every question in
the block (→ `match`) or each question phrases its own options (→ `mcq`). If the source shows
"A B C D" as a legend used repeatedly across many rows, rather than full option sentences under
each individual question, it's `match`.

## Recognizing this pattern vs `drag-select-ending.md`'s `bank`

Both `match` and `bank` reuse a shared option set — the difference is what gets picked and how.
`match` picks a **letter** (a short label like a company/person/paragraph name) via a matrix grid
with column headers. `bank` picks a **full sentence/phrase** via a shared list shown once below
the stems, no grid. If the source material shows drag handles (⋮⋮) or the options are full
sentences rather than short labels/letters, use `drag-select-ending.md`'s `bank` type instead.
