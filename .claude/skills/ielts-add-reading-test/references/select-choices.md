# Select-choices questions (mcq, tfng)

Covers the plain "pick one of several options" pattern — radio-button A/B/C/D, or True/False/Not
Given. This is the most common type; questions 1–5 in "Making The Most Of Trends" and most of
"Bringing Cinnamon To Europe" are this.

## `mcq` — own set of options per question

Each question has its own 4 (or however many) options, unrelated to any other question's options.

```ts
{
  id: 'q1',
  type: 'mcq',
  prompt: 'In the first paragraph, the writer says that most managers',
  options: [
    'fail to spot the key consumer trends of the moment.',
    'make the mistake of focusing only on the principal consumer trends.',
    'misinterpret market research data relating to current consumer trends.',
    'are unaware of the significant impact that trends have on consumers’ lives.',
  ],
  answer: 'are unaware of the significant impact that trends have on consumers’ lives.',  // exact match to one option, verbatim
  locate: [{ para: 0, text: '<verbatim evidence sentence from that paragraph>' }],
  explanation: EXPLAIN.q1,  // see ../references or the main SKILL.md's Explanation section
}
```

`answer` must be an **exact string match** (including punctuation/casing) to one entry in
`options` — `isCorrect()` in `practice.ts` compares trimmed+lowercased, but exact text still
avoids surprises in the review page's option-highlighting.

## `tfng` — True / False / Not Given

No `options` needed — the UI hardcodes the three choices. `answer` is exactly `'True'`, `'False'`,
or `'Not Given'`.

```ts
{
  id: 'q10',
  type: 'tfng',
  prompt: 'The trees planted by the Dutch produced larger quantities of cinnamon than the wild trees.',
  answer: 'Not Given',
  locate: [{ para: 4, text: 'the Dutch began cultivating their own cinnamon trees to supplement the diminishing number of wild trees' }],
  explanation: EXPLAIN.q10,
}
```

For Not Given specifically: the `explanation`'s `paraphrase.pairs` entry for the unmatched claim
should have no `right` counterpart, just a `note` saying the information isn't in the passage —
see `cinnamon-explain.ts` `q12` for a worked example of that pattern.

## `ynng` — Yes / No / Not Given

Same shape as `tfng` (no `options`, the UI renders the three choices from `FIXED_CHOICES` in
`practice.ts`), but `answer` is exactly `'Yes'`, `'No'`, or `'Not Given'`. Use it whenever the
source says YES/NO/NOT GIVEN (questions about the writer's views/claims) — don't force it into
`tfng`, the buttons would read True/False. Worked example: `seti-explain.ts` q8–q13.

## Deciding "does this look like `match` instead?"

If several consecutive questions all present the **same fixed set of options** (e.g. always
Coach/Tesco/Nike/iToys, or always A/B/C paragraph letters) rather than each question having its
own wording of options, it's probably the matrix `match` type, not `mcq` — see
`references/matrix-match.md`. The tell: in `mcq` each option's text is specific to that one
question; in `match` the exact same option list repeats verbatim under every question in the
group.

## `multi` — "Choose TWO letters" (one card, counts as N questions)

Source shows ONE question numbered like "7-8." with checkboxes, "Choose **TWO** letters, A-E". Make N
consecutive questions (q7, q8) with the **same** `prompt` and `options`; each gets one correct option
as `answer` and the other correct option(s) in `alt`:

```ts
{ id: 'q7', type: 'multi', prompt: 'Which TWO measures…?', options: [...], answer: 'Spying', alt: ['Restrictions on access to its ports'] },
{ id: 'q8', type: 'multi', prompt: 'Which TWO measures…?', options: [...], answer: 'Restrictions on access to its ports', alt: ['Spying'] },
```

The group renders as one checkbox card (`MultiGroup`); picks are sorted by option order and assigned
to q7, q8 — because each accepts every correct option, the score is |picked ∩ correct| regardless of
order. Share one explanation object between them. Worked example: "Measures to combat infectious
disease in tsarist Russia" g2.
