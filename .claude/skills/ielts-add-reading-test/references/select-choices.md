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

## Deciding "does this look like `match` instead?"

If several consecutive questions all present the **same fixed set of options** (e.g. always
Coach/Tesco/Nike/iToys, or always A/B/C paragraph letters) rather than each question having its
own wording of options, it's probably the matrix `match` type, not `mcq` — see
`references/matrix-match.md`. The tell: in `mcq` each option's text is specific to that one
question; in `match` the exact same option list repeats verbatim under every question in the
group.
