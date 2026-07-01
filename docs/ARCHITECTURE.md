# Lexiscope — Architecture

A map of the codebase for anyone picking this project back up cold. See
[`VISION.md`](VISION.md) for design rationale and [`BACKLOG.md`](BACKLOG.md)
for what's built vs. planned.

## Layout

```
index.html            entry HTML: mounts all controls and SVG panels, loads src/main.ts
src/
  main.ts              wires DOM elements to analysis + viz modules; the only stateful module
  theme.ts              pure light/dark theme resolution (no DOM access)
  urlState.ts            pure encode/decode of text <-> ?text= query param
  style.css               all styling, incl. CSS custom properties + dark theme + mobile breakpoint
  analysis/               pure, DOM-free, unit-tested scoring functions
    tokenizer.ts            tokenizeWords / tokenizeSentences (unicode-aware, hyphen/apostrophe-aware)
    stopwords.ts             English stopword set
    frequency.ts              wordFrequency(text, {limit, stopwords}) -> ranked WordCount[]
    sentimentLexicon.ts        AFINN-style polarity table + negators + intensifiers
    sentiment.ts                analyzeSentiment / analyzeSentimentBySentence
    readability.ts               analyzeReadability (Flesch Reading Ease + Kincaid Grade)
    readingTime.ts                 estimateReadingMinutes(wordCount)
    summary.ts                      buildSummaryText(...) -> clipboard-ready digest
  viz/                    imperative D3/DOM rendering; takes a mount point + data, nothing else
    frequencyChart.ts        keyed bar chart with hover tooltips, responsive left margin
    sentimentGauge.ts         keyed arc gauge, tweened fill transition
    readabilityPanel.ts        two meters (ease, grade) color-coded by easy/medium/hard band
    statsStrip.ts               plain-DOM word/sentence/reading-time strip (no D3)
test/                  one *.test.ts per src module above, run with Vitest + jsdom
docs/                  VISION.md, BACKLOG.md, ARCHITECTURE.md (this file)
```

## Data flow

`main.ts` holds the only mutable state: DOM element references, the last
computed frequency/sentiment/readability results (for the copy-summary
button), and the current theme. On every input event (debounced ~120ms) or
settings change, it re-derives everything from the current textarea value:

```
textarea value
  -> tokenizeWords / tokenizeSentences (tokenizer.ts)
  -> wordFrequency / analyzeSentiment / analyzeReadability (analysis/*)
  -> renderFrequencyChart / renderSentimentGauge / renderReadabilityPanel / renderStatsStrip (viz/*)
  -> syncUrl (urlState.ts) via history.replaceState
```

There is no persisted app state beyond `localStorage` for the theme choice
and the URL query param for shareable text — everything else recomputes
from the textarea on each render pass. This keeps the analysis modules
trivially testable (pure functions in, structured data out) and keeps the
"live instrument" feel: every visual update is a full, cheap recomputation,
not an incremental patch to hidden state.

## Split rationale

- `analysis/` never touches the DOM or D3 — tested directly with Vitest,
  no jsdom needed for the pure-math ones (tokenizer, frequency, sentiment,
  readability, readingTime, summary).
- `viz/` never computes scores — takes an `SVGSVGElement`/`HTMLElement` and
  already-shaped data, and is tested with jsdom-backed Vitest (create a
  detached `<svg>`, render into it, assert on the resulting DOM).
- `main.ts` is the only file allowed to know about both sides; it has no
  tests of its own (thin wiring only — reading inputs, calling the two
  layers above, writing back to the DOM/URL/localStorage).

## Run / test / build

```bash
npm install
npm run dev      # Vite dev server
npm test         # vitest run — full suite, jsdom environment
npm run lint     # eslint .
npm run build    # tsc -b && vite build -> dist/ (relative-base, subpath-servable)
npm run preview  # serve dist/ locally
```

## Deployment

`vite.config.ts` sets `base: './'`, so `dist/` is fully relocatable — see
the Deployment section in [`../README.md`](../README.md) for the
subpath-serving details (e.g. `apps.charliekrug.com/lexiscope/`).
