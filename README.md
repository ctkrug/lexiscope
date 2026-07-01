# Lexiscope

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

## Planned features

- **Live word-frequency chart** — an animated, sorted bar chart of the most
  frequent non-stopword tokens, re-laying-out as ranks change.
- **Sentiment gauge** — a lexicon-based polarity score (positive / negative /
  neutral) rendered as a continuously-updating needle gauge.
- **Readability panel** — Flesch Reading Ease and Flesch-Kincaid Grade Level,
  computed from sentence/word/syllable counts, shown as a small multiple of
  gauges.
- **Debounced, non-blocking analysis** — recompute on input without janking
  the textarea, even on longer pastes.
- **Shareable snapshots** *(stretch)* — encode the current text into the URL
  so an analysis can be linked or bookmarked.

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

## Status

Early scaffold — see [`docs/VISION.md`](docs/VISION.md) for the design and
[`docs/BACKLOG.md`](docs/BACKLOG.md) for the build plan.

## License

MIT — see [`LICENSE`](LICENSE).
