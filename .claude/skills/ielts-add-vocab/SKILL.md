---
name: ielts-add-vocab
description: Add or fill in a Vocab set for an IELTS test in this app — from a pasted vocabulary list, an exported HTML page from an external LMS (e.g. a saved "vocab set" page with word cards, IPA, definitions, examples, images), or a request to fill in missing images/icons for words that only have an emoji placeholder. Use this whenever the user shares vocabulary for an IELTS test (reading/listening/speaking/writing) and asks to add it, or asks to finish/complete a vocab set that's partly done. Companion to the ielts-add-reading-test skill — that one covers passage + questions, this one covers the `vocab` array and its images.
---

# Add an IELTS vocab set

Source of truth for the data shape is `src/lib/ielts/practice.ts` (`PracticeVocab` interface) —
re-read it if anything here looks stale. The worked example to pattern-match against is the
22-word "Bringing Cinnamon To Europe" set plus its 8 self-added extras, both in
`src/data/ielts/practice/reading.ts` (the `vocab:` array on that test) — look there for concrete
examples of every field below, including the mix of real photos and hand-drawn SVG icons.

## Where vocab lives

Each `PracticeTest` in `src/data/ielts/practice/reading.ts` (`READING_TESTS` array — see
`ielts-add-reading-test` skill) has its own `vocab: PracticeVocab[]`. There's no separate
top-level vocab file — it's attached to the test it came from. `vocabForSkill()` in
`src/lib/ielts/tests.ts` just flattens these across tests for the skill-wide vocab list page; you
never edit that file directly, only the `vocab:` array on the relevant test object.

## The PracticeVocab shape

```ts
{
  word: 'cultivation',
  partOfSpeech: 'n',                 // 'n' | 'v' | 'adj' | 'adv' — short form, lowercase
  meaning: 'sự cày cấy / sự trồng trọt',       // VI, required
  example: 'The cultivation of wheat required the most fertile lands.',   // EN, required
  ipa: '/ˌkʌltɪˈveɪʃn/',
  definitionEn: 'the act of preparing land and growing crops on it, or the act of growing a particular crop',
  exampleVi: 'Sự trồng trọt lúa mì yêu cầu những vùng đất màu mỡ nhất.',
  image: '/ielts/images/vocab/cultivation.jpg',   // preferred — see Images below
  // emoji: '🌸',                                  // fallback ONLY if no image (see Images below)
}
```

`word`, `meaning`, `example`, `partOfSpeech` are required; the rest are optional but include them
whenever the source has them — the flashcard view (`FlashModal` in
`src/components/ielts/VocabView.tsx`) renders `ipa`, `definitionEn`, and `exampleVi` when present,
so skipping them silently degrades that view for no reason.

## Extracting from a pasted source

The user typically pastes one of:

- **A saved HTML export** from an external LMS vocab-set page (word cards with term, IPA, part of
  speech, VI/EN definitions, VI/EN example sentences, and an image per word). Read through the DOM
  text for each card and map field-by-field into a `PracticeVocab` entry — the card markup usually
  repeats a predictable structure (term, pronunciation, definition block with VI/EN tags, "word in
  context" block with a numbered VI sentence then the EN sentence). Don't paraphrase the VI/EN
  text — copy it as given, it's already the source content.
- **A plain word list** (just words, maybe with rough meanings) — in this case you're composing
  the rest yourself (IPA, definitions, examples); say so, since it's now your own content rather
  than sourced, same disclaimer spirit as the reading-test skill's answer-key notes.

## Images

Prefer a real `image` over `emoji`. Where the image comes from, in priority order:

1. **A local export folder** — if the user's HTML export references images from a sibling
   `..._files/` folder (common when someone saves a full webpage), those image files are already
   on disk next to the HTML. Copy the ones you need into
   `public/ielts/images/vocab/<word-lowercase-hyphenated>.<ext>` (keep the original extension —
   `.jpg`, `.avif`, etc. — no need to convert), matching the filename to the vocab word, not to
   whatever cryptic name the export gave it. Verify the copy isn't a 0-byte file before moving on.
2. **No source image available** (self-added extra words, or the user asks you to fill in
   words that only ended up with an `emoji` fallback) — draw a simple flat-style SVG icon instead
   of leaving it on emoji. Established style, copy the pattern from
   `public/ielts/images/vocab/fragrant.svg`, `anoint.svg`, `token.svg`, `additive.svg`,
   `condiment.svg`, `ailment.svg`, `exorbitantly.svg`, `supersede.svg`:
   - `viewBox="0 0 300 300"`, rounded card background (`rx="24"`) in a soft pastel matching the
     word's theme,
   - 1–3 flat colored shapes illustrating the concept (no photorealism, no gradients-heavy
     detail, no text/labels baked into the image),
   - save as `public/ielts/images/vocab/<word>.svg` and point `image` at
     `/ielts/images/vocab/<word>.svg`.
   Only use `emoji` (skip `image` entirely) if you're moving fast and the user hasn't asked for
   full polish — but default to the SVG icon, it's cheap and it's what's been done consistently so
   far.

Filename convention: lowercase, spaces → hyphens (`economic potential` → `economic-potential.jpg`).

## After adding

1. `npx tsc --noEmit -p .` from the repo root — must be clean.
2. If you copied image files, sanity-check sizes aren't 0 bytes (a failed/empty copy still creates
   the file): e.g. `ls -la public/ielts/images/vocab/` and eyeball the sizes.
3. Smoke-test: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/ielts/<skill>/vocab`
   should return `200` (only start `npm run dev` if no dev server is already running for this
   session — check first rather than assuming).
4. Mention the new word count so the user can cross-check against what they expected (e.g. "22/22
   từ đã có ảnh").
