---
name: ielts-verify-reading-test
description: Verify a just-built (or existing) IELTS reading test in this app — checks the data is structurally sound (no duplicate question ids, answers actually exist in their own option set, locate quotes are verbatim substrings of the right paragraph) AND does a genuine second-pass re-read of the passage to sanity-check every answer and its explanation. Run this automatically right after finishing an ielts-add-reading-test pass on a new test, and whenever the user explicitly asks to verify/check/rà soát/kiểm tra lại đáp án for a reading test.
---

# Verify an IELTS reading test

Companion to `ielts-add-reading-test`. Run this right after building a test with that skill,
before telling the user it's done — "the answers are self-derived guesses" is a much weaker
statement to hand back than "I re-checked them and here's my confidence level per question."

Two passes, in this order. Don't skip the first one to save time — it's cheap and catches real
bugs before you spend effort re-reasoning about a typo.

## Pass 1 — structural check (scripted, fast)

```
node .claude/skills/ielts-verify-reading-test/scripts/check-structure.mjs <reading-test-id>
```

This is a **heuristic regex-based checker, not a real parser** — it reads `reading.ts` as text, so
treat a clean run as "no obvious wiring bugs," not as any kind of correctness proof. It checks:

- `paragraphLabels.length` matches `passage.length`.
- No duplicate question ids within the test.
- `tfng` answers are exactly `'True'`, `'False'`, or `'Not Given'`.
- `match` answers exist in the **nearest preceding** `matchLegend`'s keys.
- `bank` answers exist verbatim in the **nearest preceding** `optionBank`.
- `mcq` answers exist verbatim in that question's own `options`.
- Every `locate[].text` is a verbatim substring of `passage[locate[].para]` (catches curly-quote
  mismatches, para off-by-one, or a quote that drifted from the paragraph after an edit).

It prints `(info) qN: no locate found` for questions where it couldn't locate a `locate:` block —
this is a soft nudge, not a failure. Known false positive: a handful of older questions in
`cinnamon-explain.ts`'s test were originally pasted in JSON style (`"id": "q1"` with quoted keys
throughout) rather than the TS-literal style (`id: 'q1'`) everything since has used; the script's
key-matching doesn't yet handle that older style for the `locate:` field specifically, so it'll
report false "no locate" infos there even though the data has `locate`. If you hit real ✕ failures
on a test, fix the data — don't just relax the check.

If the script reports `✕` failures, fix `reading.ts` and rerun before moving to Pass 2 — no point
re-reasoning about an answer whose data has a typo.

## Pass 2 — semantic re-read (the part that actually matters)

For each question, independently: re-read the relevant paragraph(s) fresh, decide what you think
the answer is, and only then compare against what's stored. Don't just re-read your own
`explanation` and nod along — that's confirmation bias, not verification. A few habits that catch
real mistakes:

- **Re-derive, don't re-justify.** If your first instinct lands on the stored answer through a
  different chain of reasoning than the `explanation` used, that's a good sign (convergent
  evidence). If you have to stretch to make the stored answer fit, that's the question to flag.
- **Read one paragraph too many.** For "which paragraph" / matching-type questions, check the
  paragraph immediately before and after the chosen one too — IELTS distractors are often built
  from adjacent-paragraph content that's almost right.
- **Check the exact scope of the claim.** IELTS wrong options are usually right in a way that's
  too broad, too narrow, or reversed in polarity — not simply "unrelated." If two options both
  seem defensible, that's usually the tell that the actual answer hinges on one precise word (see
  `references/explanation-format.md`'s `rel: '≠'` pattern), not that the question is ambiguous.
- **For True/False/Not Given specifically**, actively look for the counter-case: could this be
  Not Given instead of False (or vice versa)? The three-way split is where self-derived answers
  are most often wrong — False requires the passage to actually contradict the statement, not just
  fail to support it.
- **Cross-check `locate`** against the conclusion — if the quoted evidence doesn't actually support
  the stored answer when you read it cold, the answer (or the `locate`) is wrong.

## Reporting back to the user

Don't just say "verified." Be specific about what changed and what your confidence level is per
question group, using the same disclaimer convention as `ielts-add-reading-test`:

- Questions where Pass 2 **confirmed** the original reasoning — say so briefly, no need to re-paste
  the whole explanation.
- Questions where Pass 2 **changed your mind** — fix `answer` and rewrite `explanation` to match
  the new reasoning (don't leave stale reasoning pointing at an old answer), and call out the
  change explicitly so the user knows something moved.
- Questions that are **still genuinely ambiguous** after a careful re-read (two options both
  defensible) — say so plainly rather than picking one with false confidence; this is exactly the
  kind of thing an official answer key resolves and self-derivation can't.

Update the disclaimer comment at the top of `reading.ts` for this test to reflect the new
confidence level, same as the existing convention there.

## After fixing anything

Rerun Pass 1 (the data changed) and the standard checks from `ielts-add-reading-test`'s "After
every edit" section (`npx tsc --noEmit -p .`, dev-server smoke test).
