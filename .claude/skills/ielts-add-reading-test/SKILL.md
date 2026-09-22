---
name: ielts-add-reading-test
description: Add a new IELTS Reading practice test to this app from a passage (text/images) plus question screenshots the user pastes in chat. Use this whenever the user shares a new reading passage and questions and asks to add/create/tiếp tục làm đề for the IELTS reading section — it encodes the exact data shape, per-question-type decision rules (plain select/MCQ, True-False-Not Given, table completion, matrix matching, drag-and-drop endings), and structured-explanation format already established in this codebase, so the result matches existing tests (Bringing Cinnamon To Europe, Making The Most Of Trends) instead of reinventing the format each time.
---

# Add an IELTS reading test

Source of truth for the data shape is `src/lib/ielts/practice.ts` — re-read it if anything here
looks stale (a field renamed, a type added). This skill is a workflow guide, not the schema.

Two finished examples to pattern-match against: `src/data/ielts/practice/reading.ts` (the
`READING_TESTS` array) with `cinnamon-explain.ts` and `trends-explain.ts`.

## Files you'll touch

1. `src/data/ielts/practice/reading.ts` — append one `PracticeTest` object to `READING_TESTS`.
2. `src/data/ielts/practice/<slug>-explain.ts` — new file, one per test, holding the structured
   `explanation` objects. See `references/explanation-format.md`.
3. Vocab for the test is a separate concern — see the sibling `ielts-add-vocab` skill.

## Procedure

1. Clean the passage: paste-ins from PDFs/scans often prefix each paragraph with its letter
   doubled (`AAMost managers...`, `BBMany ignore...`) — strip that, keep only the paragraph text.
   Fix obvious OCR typos you're confident about, don't rewrite the author's voice.
2. Fill in the `PracticeTest` shell (shape below).
3. Split the questions into `PracticeGroup`s the way the source instructions do (they'll usually
   already say "Question 1–5", "Question 6–11", etc.).
4. **For each group, identify which question-type pattern it is** — this is the part that's easy
   to get wrong because several patterns look superficially similar. Read the matching reference
   file below before writing that group; each one has a worked example and, where two patterns
   could be confused, an explicit "how to tell them apart" note.
5. Write the structured `explanation` for each question — `references/explanation-format.md`
   (applies regardless of question type).
6. Run the checks in **After every edit** below.
7. Run the `ielts-verify-reading-test` skill on the test you just built, before telling the user
   it's done — answers written in one pass on a first read are exactly the kind of thing worth a
   genuine second look, not just a re-read of your own reasoning.

## The `PracticeTest` shell

```ts
{
  id: 'reading-<kebab-slug>',
  skill: 'reading',
  title: '<passage title>',
  category: 'Practice test',
  part: 'Reading <N>',       // next unused number — check existing tests' `part` values first
  durationMin: <int>,        // ~20 for ~13 questions, scale roughly with question count
  passageTitle: '<same as title, usually>',
  paragraphLabels: ['A', 'B', ...],   // one per paragraph, in order
  passage: ['<para A text>', '<para B text>', ...],
  groups: [ /* one PracticeGroup per instruction block — see the reference files */ ],
  vocab: [],   // filled separately by the ielts-add-vocab skill, or [] if not doing vocab yet
}
```

## Question-type reference files

Read the one that matches what the source screenshot shows, per group:

| Source looks like | Reference | App type |
|---|---|---|
| Radio-button A/B/C/D, each question has its own wording of options | `references/select-choices.md` | `mcq` |
| True / False / Not Given | `references/select-choices.md` | `tfng` |
| A labeled table (rows like "Biblical times", "Ancient Rome") with blanks to fill inside it | `references/table-completion.md` | `table` (group) + `gap-fill`/`table` (questions) |
| A summary/sentence with a blank, no table around it | `references/gap-fill.md` | `gap-fill` |
| A grid: column headers A/B/C/D, each row a statement, checkmark under the chosen column, legend below (e.g. A=Coach, B=Tesco) | `references/matrix-match.md` | `match` |
| Sentence stems with a "Drop or Select" target + a separate list of draggable full-text endings (⋮⋮ handles) | `references/drag-select-ending.md` | `bank` (group-level `optionBank`) |

If a group doesn't obviously fit one of these, re-read `src/lib/ielts/practice.ts` — there may be
a type or field added since this table was written.

## `locate`

Every question should carry `locate: [{ para: <0-based index into passage[]>, text: '<verbatim
quoted substring from that paragraph>' }]` when you can point to the evidence sentence — it drives
the "Locate" highlight toggle on the review page. Quote the passage exactly (same wording,
punctuation, curly quotes) so the substring match succeeds.

## When the user shares an official answer key

Sometimes the user pastes a screenshot from an external platform (e.g. DOL) showing the confirmed
correct answer highlighted. When that happens:

- Correct the `answer` field.
- **Also rewrite the `explanation`** to match the confirmed reasoning — don't just patch the
  answer and leave an explanation that was reasoned toward the old (wrong) answer.
- Keep the top-of-file disclaimer comment in `reading.ts` accurate: which questions are still
  self-derived guesses (unverified) versus confirmed by an official key. Update it as more
  questions get confirmed.

## After every edit

1. `npx tsc --noEmit -p .` from the repo root — must be clean.
2. Smoke-test the dev server: `curl -s -o /dev/null -w "%{http_code}\n"
   http://localhost:3000/ielts/reading/practice` should return `200`.
3. Only start a new dev server (`npm run dev`) if none is already running for this session —
   check first (e.g. `netstat -ano | grep ':3000'` on Windows) rather than assuming, since a stale
   `next start` process from a previous session can also be listening on that port and needs
   killing/replacing rather than a fresh server piling on top.
