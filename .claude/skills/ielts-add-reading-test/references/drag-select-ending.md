# Drag-and-drop sentence endings (câu 12-14 style)

Source material for this pattern shows sentence stems with a "Drop or Select" drag target, and a
separate "List of options" panel below with drag handles (⋮⋮) next to each ending — the user drags
an ending onto a stem, or taps to select. The app has no literal drag-and-drop, but it does have a
**dedicated `bank` question type** that mirrors the two-part layout (word bank shown once, each
stem just shows a compact selectable target) — use that, not `mcq` (an earlier version of this
skill said to fall back to `mcq`, which rendered the full option list repeated under every stem;
that didn't match the source and was replaced by `bank`).

```ts
{
  id: 'g3',
  instruction: 'Complete each sentence with the correct ending, **A, B, C** or **D** below.',
  optionBank: [
    'employ a combination of strategies to maintain your consumer base.',
    'identify the most appropriate innovation strategy to use.',
    'emphasise your brand’s traditional values with the counteract-and-reaffirm strategy.',
    'use the combine-and-transcend strategy to integrate the two worlds.',
  ],
  questions: [
    {
      id: 'q12',
      type: 'bank',
      prompt: 'If there are any trend-related changes impacting on your category, you should',
      answer: 'identify the most appropriate innovation strategy to use.',   // exact text from optionBank, not a letter
      locate: [{ para: 8, text: 'you can determine which of our three innovation strategies to pursue' }],
      explanation: EXPLAIN.q12,
    },
    // q13, q14, same shape
  ],
}
```

`optionBank` lives on the **group**, once — not repeated per question. `answer` is the exact
ending text (matches one `optionBank` entry verbatim), not a letter like `match` uses.

`prompt` keeps the stem's own leading text and stops right where the drop target/blank was (e.g.
ending in `you should`, no trailing `___`) — `bank` (like `mcq`) prints the prompt string as-is
without splitting on `___`, so a literal `___` would show up as stray text right before the
selectable target. Trim it off.

Rendered by `BankGroup` in `TestRunner.tsx`: each stem shows a dashed pill ("Drop or Select" until
picked). Clicking the pill opens an inline dropdown right there listing all `optionBank` entries
(the selected one highlighted) — click one to assign and close it; click outside (a transparent
backdrop) to close without picking. The same click also marks that stem as the "active" target for
the second, slower way to assign: the shared "List of options" panel below all the stems — click
an item there and it's assigned to whichever stem is currently active. Not a real drag
interaction, but the dropdown-on-click plus shared-list-below layout matches the source far better
than a per-question radio list did.

## Telling this apart from `matrix-match.md`'s `match`

Both `match` and `bank` reuse a shared option set across several questions — the difference is
what gets picked and how it's displayed. `match` picks a **letter** (a short label like a
company/person name) via a matrix grid with column headers. `bank` picks a **full sentence/phrase**
via a shared list shown once below the stems, with no grid. If the source shows drag handles (⋮⋮)
or the options are full sentences rather than short labels/letters, it's `bank`.
