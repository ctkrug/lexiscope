# Lexiscope — Backlog

High-level epic/story breakdown to guide build runs. Stories are
intentionally coarse-grained; a build run may split one into several
commits.

## Epic 1: Core analysis engine

- [x] Harden the tokenizer for numbers, hyphenated words, and unicode
      letters (accents, non-Latin scripts) instead of ASCII-only matching.
- [x] Expand the sentiment lexicon and add intensifier handling (e.g.
      "very good" scoring higher than "good").
- [x] Support per-sentence sentiment breakdown, not just an aggregate score,
      so a paragraph's tone shifts can be surfaced.
- [x] Make the stopword list and frequency limit configurable from the UI
      instead of hardcoded constants.

## Epic 2: Visualizations & interactivity

- [ ] Add hover tooltips to frequency bars showing exact count and
      percentage of total words.
- [ ] Color-code the readability meters by band (easy/medium/hard) instead
      of a single flat fill color.
- [ ] Add a compact summary stat strip (word count, sentence count, reading
      time estimate) above the visualization panels.
- [ ] Make the frequency chart responsive to container resizing, not just
      initial `clientWidth`.

## Epic 3: Input & performance

- [ ] Support loading text from a dropped or selected `.txt` file, not just
      pasting into the textarea.
- [ ] Add a lightweight loading/pending indicator for large pastes (multi-
      thousand-word) while the debounced analysis is in flight.
- [ ] Add a dark mode theme toggle.
- [ ] Add a mobile-responsive layout for narrow viewports (stack panels,
      shrink chart margins).

## Epic 4: Deployment & sharing

- [ ] Verify and document the subpath deployment flow for
      `apps.charliekrug.com/lexiscope` (confirm relative asset resolution
      end-to-end, not just in local preview).
- [ ] Add URL-based sharing: encode the current text into a query param so
      an analysis can be linked or bookmarked.
- [ ] Add a "copy analysis summary" button that copies a plain-text digest
      of the current scores to the clipboard.
