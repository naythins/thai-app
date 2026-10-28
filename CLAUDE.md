# Speak Thai (thai-app)

Quiz PWA to learn spoken Thai. Static HTML/JS, **no build step, no dependencies**.
Production: https://thai-app-lemon.vercel.app (Vercel project `thai-app`, deploys from `main`).

## Files
- `jungle.html` — the whole app (CSS + HTML + JS in one file). `index.html` just redirects to it.
- `sw.js` — offline service worker. `manifest.webmanifest` — install metadata.
- `jungle-assets/`, `icons/` — images. `classic.html` — old unused style, ignore it.

## Rules (do not skip)
1. **Bump `CACHE` in `sw.js`** (`thai-pwa-vN` -> `vN+1`) on every change that touches the app,
   otherwise installed phones keep serving the old version.
2. **The UI is in English.** All visible text, glosses and comments stay English.
3. The learner knows French and English; glosses (`fr:` field, historical name) are **English**.
4. Keep the existing style: ES5 (`var`, `function`), no frameworks, compact one-line helpers.
5. Thai romanization follows the existing entries (tones marked: `à á â ǎ`, `aa/uu/ii` for long vowels).
   Do not invent romanization you are unsure about; flag it in the PR instead.

## How the content works
Each theme is an array of `{fr, th, r}` (gloss, Thai script, romanization). `{i}`/`{ir}`/`{p}`/`{pr}`
are polite-particle placeholders resolved by `resolve()`.
Themes: `num` (generated numbers), `pol`, `pre`, `neg`, `food`, `base`, `verb`, `body`.

To add a theme, touch all of these in `jungle.html`:
- data array + its `...R` resolved copy, and add it to `WORDPOOL`
- `cats` defaults, the list in `buildItems()`, `CATNAME`, a `.cat-xxx` colour in the CSS
- a `<button class="theme" data-cat="xxx">` tile on the home screen
- the cheat sheet: an `<h4>` + `<div id="cheatXxx">` and a line in `openCheat()`
- `makePhrase()` pool map (or a dedicated generator like `makeBody()` for visual exercises)

Distractors must be of the same kind as the answer (verbs vs verbs, body parts vs body parts).

## Game rules already implemented
- 10 questions per round; end-of-round review replays at most `REVIEW_MAX` (3) mistakes, **once each**.
- Daily combo: +1 per day with 3 finished rounds, reset if a day is missed (`tn_combo` in localStorage).
- Sound effects are synthesized with Web Audio (`SFX`), with an on/off toggle (`tn_sound`).
- Body parts use an SVG avatar (`AV_SVG`): tap the named part or name the highlighted one.

## Checking a change
No test runner. Sanity checks that worked well: parse each inline `<script>` with `new Function`,
and run the question generators in Node with a stubbed `document`/`localStorage`.
For layout, screenshot in headless Edge/Chrome at ~500px wide.
