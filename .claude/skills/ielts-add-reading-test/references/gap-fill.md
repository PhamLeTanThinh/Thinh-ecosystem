# Plain gap-fill (summary/sentence completion, no table)

Same as the blanks inside `table-completion.md`, but not inside a table — a standalone summary
paragraph or sentence set with blanks, no row labels. Skip `group.table` entirely; just list the
questions directly with `___` marking each blank.

```ts
{
  id: 'q3',
  type: 'gap-fill',
  prompt: 'Mourners attending funerals burnt cinnamon to create a ___.',
  answer: 'pleasant scent',
  alt: ['sweet smell'],   // only if the source genuinely accepts an alternate phrasing
  locate: [{ para: 2, text: 'mourners attending funerals burnt cinnamon to create a pleasant scent' }],
  explanation: EXPLAIN.q3,
}
```

Same rules as table gap-fills: answer text verbatim from the passage, respect the stated word
limit, use `alt` sparingly and only for genuine accepted variants (not near-synonyms you're
guessing might also be marked correct).
