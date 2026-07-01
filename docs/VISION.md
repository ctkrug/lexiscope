# Lexiscope — Vision

## The problem

Text-analysis tools tend to fall into one of two camps: a heavyweight NLP
service behind an API call (slow feedback loop, requires a backend, raises
privacy questions for whatever you paste in), or a static "paste and click
analyze" form that computes once and shows a table of numbers. Neither feels
alive, and neither is something you'd casually poke at just to see how a
sentence's shape changes as you edit it.

## Who it's for

Anyone who writes and wants a quick, private, exploratory feel for their
text: writers checking readability, developers curious about the tone of a
commit message or README, students studying a passage of prose. It's a toy
in the best sense — something you open, paste something into, and watch
react, with no sign-up, no upload, and no server round-trip.

## The core idea

Every keystroke re-runs three small, pure analyses over the current text —
word frequency, sentiment, and readability — and feeds the results into D3
visualizations that use keyed data joins so they *animate* between states
instead of redrawing. The feeling should be closer to a live instrument
panel than a report: bars re-rank as new words dominate, a needle sweeps as
tone shifts, meters slide as sentences get denser or simpler.

Everything runs in the browser. There is no backend, no database, and no
network call in the critical path — the text never leaves the tab.

## Key design decisions

- **Pure analysis functions, imperative D3 rendering.** The `src/analysis/`
  modules are dependency-free, synchronous, and unit-testable in isolation
  from the DOM. The `src/viz/` modules are the only place that touch D3 and
  the SVG DOM; they take a mount point and structured data, nothing else.
  This split is what makes the analysis testable without jsdom and the
  rendering swappable without touching the scoring logic.
- **Heuristics over ML.** Sentiment uses a small hand-curated AFINN-style
  lexicon with negation handling; readability uses the standard Flesch
  formulas with a vowel-group syllable heuristic. These are intentionally
  "good enough" approximations, not research-grade NLP — the point is
  instant, explainable, dependency-free feedback, not state-of-the-art
  accuracy.
- **Debounced, not throttled, input handling.** Analysis re-runs ~120ms
  after the user stops typing, not on every keystroke, so long pastes and
  fast typists don't jank the textarea.
- **Static, relocatable output.** The Vite build uses a relative base path
  and emits a single self-contained `dist/`, so the same build can be
  served from a domain root or a subpath (e.g.
  `apps.charliekrug.com/lexiscope`) with no configuration change.
- **Keyed D3 joins everywhere.** Bars, arcs, and meters are keyed by a
  stable identity (word, metric name) so D3's enter/update/exit can
  transition existing elements instead of tearing down and rebuilding the
  SVG on every render — this is what makes the "live instrument" feel
  possible.

## What "v1 done" looks like

- All three visualizations (frequency, sentiment, readability) render and
  animate smoothly on typed input and on large pastes (a few thousand
  words) without noticeable jank.
- The analysis modules have solid unit test coverage and the whole suite is
  green in CI on every push.
- The app is a single static build with relative asset paths, verified to
  work when served from a non-root subpath.
- The README accurately describes what's implemented (not just planned),
  and the backlog's must-have stories are all checked off.
