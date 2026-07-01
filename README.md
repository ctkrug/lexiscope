# Lexiscope

[![CI](https://github.com/ctkrug/lexiscope/actions/workflows/ci.yml/badge.svg)](https://github.com/ctkrug/lexiscope/actions/workflows/ci.yml)

Paste text. Watch it think.

Lexiscope is a zero-backend web app that analyzes whatever you type or paste
and animates the results live: word-frequency distribution, sentiment, and
readability, all recomputed on every keystroke and rendered with D3.

There is no server, no API call, and no build-time text processing — every
byte you type stays in your browser. The entire analysis pipeline (tokenizing,
scoring, and scaling) runs client-side in TypeScript, and the visualizations
are driven by D3's data joins so they animate smoothly as the underlying
numbers shift.

## Why

Most "text analysis" demos either ship the text to a server or bolt a heavy
NLP library onto a static page and call it a day. Lexiscope is an exercise in
doing useful, real-time text analysis with nothing but the browser and a
handful of well-chosen heuristics — and making the *visualization* of that
analysis feel alive rather than static.

## Features

- **Live word-frequency chart** — an animated, sorted bar chart of the most
  frequent non-stopword tokens, re-laying-out as ranks change, with hover
  tooltips showing exact count and share of total words. The word limit and
  extra stopwords are configurable from the UI.
- **Sentiment gauge** — a lexicon-based polarity score (positive / negative /
  neutral) rendered as a continuously-updating needle gauge, with negation
  ("not good") and intensifier ("very good") handling.
- **Sentiment-by-sentence strip** — one colored segment per sentence (opacity
  scaled by confidence) so a paragraph's tone shifts are visible at a glance,
  not just its aggregate score.
- **Readability panel** — Flesch Reading Ease and Flesch-Kincaid Grade Level,
  computed from sentence/word/syllable counts, shown as a small multiple of
  meters color-coded by easy/medium/hard band.
- **Stats strip** — a compact word count, sentence count, and estimated
  reading time summary above the visualizations.
- **Debounced, non-blocking analysis** — recompute ~120ms after typing stops,
  with a pending indicator while a large paste or fast typing is queued.
- **File input** — load a `.txt` file by picking or dropping it onto the
  textarea, in addition to pasting.
- **Dark mode** — a toggle in the header, persisted across reloads.
- **Shareable URLs** — the current text is encoded into a `?text=` query
  param so an analysis can be linked or bookmarked.
- **Copy analysis summary** — copies a plain-text digest of the current
  scores to the clipboard.
- **Clear text** — resets the input (and the shared-URL state) in one
  click, handy after loading a shared link or a file.
- **Mobile-responsive layout** — panels and controls stack into a single
  column below 600px.

## Stack

- **TypeScript** for the analysis pipeline (tokenizer, frequency, sentiment,
  readability — all pure, unit-tested functions).
- **D3** for data-driven, animated SVG visualizations.
- **Vite** for a zero-config dev server and a single static `dist/` build
  with relative asset paths, so it can be hosted from any subpath.
- **Vitest** for unit tests of the analysis modules.

## Getting started

```bash
npm install
npm run dev      # local dev server
npm run build     # production build -> dist/
npm test          # run the analysis test suite
```

## Deployment

The Vite build (`npm run build`) emits a single static `dist/` with a
relative base path (`base: './'` in `vite.config.ts`), so every asset is
referenced as `./assets/...` rather than `/assets/...`. That means the same
build works whether it's served from a domain root or a subpath such as
`apps.charliekrug.com/lexiscope/` — copy `dist/` into the target directory
and serve it as-is, no rewriting required.

## Status

Core feature set implemented — see [`docs/VISION.md`](docs/VISION.md) for
the design and [`docs/BACKLOG.md`](docs/BACKLOG.md) for the build plan.

## License

MIT — see [`LICENSE`](LICENSE).
