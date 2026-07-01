import { wordFrequency } from './analysis/frequency';
import { analyzeSentiment, analyzeSentimentBySentence } from './analysis/sentiment';
import { analyzeReadability } from './analysis/readability';
import { STOPWORDS } from './analysis/stopwords';
import { tokenizeWords } from './analysis/tokenizer';
import { renderFrequencyChart } from './viz/frequencyChart';
import { renderSentimentGauge } from './viz/sentimentGauge';
import { renderSentenceSentimentStrip } from './viz/sentenceSentimentStrip';
import { renderReadabilityPanel } from './viz/readabilityPanel';
import { renderStatsStrip } from './viz/statsStrip';
import { oppositeTheme, resolveInitialTheme, type Theme } from './theme';
import { decodeTextFromQuery, encodeTextToQuery } from './urlState';
import { buildSummaryText } from './analysis/summary';
import type { WordCount } from './analysis/frequency';
import type { SentimentResult } from './analysis/sentiment';
import type { ReadabilityResult } from './analysis/readability';

const DEBOUNCE_MS = 120;
const DEFAULT_WORD_LIMIT = 15;
const MIN_WORD_LIMIT = 3;
const MAX_WORD_LIMIT = 50;
const THEME_STORAGE_KEY = 'lexiscope-theme';

const input = document.querySelector<HTMLTextAreaElement>('#input');
const wordLimitInput = document.querySelector<HTMLInputElement>('#word-limit');
const extraStopwordsInput = document.querySelector<HTMLInputElement>('#extra-stopwords');
const frequencySvg = document.querySelector<SVGSVGElement>('#frequency-chart');
const sentimentSvg = document.querySelector<SVGSVGElement>('#sentiment-gauge');
const sentenceSentimentSvg = document.querySelector<SVGSVGElement>('#sentence-sentiment-strip');
const readabilitySvg = document.querySelector<SVGSVGElement>('#readability-panel');
const statsStripEl = document.querySelector<HTMLElement>('#stats-strip');
const fileInput = document.querySelector<HTMLInputElement>('#file-input');
const pendingIndicator = document.querySelector<HTMLElement>('#pending-indicator');
const themeToggle = document.querySelector<HTMLButtonElement>('#theme-toggle');
const copySummaryButton = document.querySelector<HTMLButtonElement>('#copy-summary');
const clearInputButton = document.querySelector<HTMLButtonElement>('#clear-input');

let lastFrequency: WordCount[] = [];
let lastSentiment: SentimentResult = { score: 0, matchedWords: 0, label: 'neutral' };
let lastReadability: ReadabilityResult = {
  sentenceCount: 0,
  wordCount: 0,
  syllableCount: 0,
  fleschReadingEase: 0,
  fleschKincaidGrade: 0,
};

function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
}

if (themeToggle) {
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  let theme = resolveInitialTheme(localStorage.getItem(THEME_STORAGE_KEY), prefersDark);
  applyTheme(theme);

  themeToggle.addEventListener('click', () => {
    theme = oppositeTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyTheme(theme);
  });
}

/** Reads a File's contents as text via the FileReader API. */
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

const PENDING_TEXT_DEFAULT = pendingIndicator?.textContent ?? '';

/** Flashes a failure message in the pending indicator, then restores its usual text. */
function flashFileErrorMessage(): void {
  if (!pendingIndicator) return;
  pendingIndicator.hidden = false;
  pendingIndicator.textContent = "Couldn't read that file.";
  setTimeout(() => {
    if (pendingIndicator) {
      pendingIndicator.hidden = true;
      pendingIndicator.textContent = PENDING_TEXT_DEFAULT;
    }
  }, 2500);
}

async function loadFileIntoInput(file: File): Promise<void> {
  if (!input) return;
  try {
    input.value = await readFileAsText(file);
    render(input.value);
  } catch {
    flashFileErrorMessage();
  }
}

/** Merges the built-in stopword list with the comma-separated custom entries. */
function activeStopwords(): Set<string> {
  const extra = (extraStopwordsInput?.value ?? '')
    .split(',')
    .map((w) => w.trim().toLowerCase())
    .filter((w) => w.length > 0);
  return extra.length > 0 ? new Set([...STOPWORDS, ...extra]) : STOPWORDS;
}

/** Reads the word-limit input, clamped to the range its min/max attributes advertise. */
function activeWordLimit(): number {
  const parsed = Number(wordLimitInput?.value);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_WORD_LIMIT;
  return Math.min(MAX_WORD_LIMIT, Math.max(MIN_WORD_LIMIT, Math.trunc(parsed)));
}

/** Reflects the current text into the URL so the analysis can be linked or bookmarked. */
function syncUrl(text: string): void {
  const query = encodeTextToQuery(text);
  history.replaceState(null, '', `${location.pathname}${query}`);
}

/** Runs the analysis + viz pipeline; does not touch the URL (see {@link render}). */
function renderAnalysis(text: string): void {
  if (pendingIndicator) pendingIndicator.hidden = true;

  const frequency = wordFrequency(text, { limit: activeWordLimit(), stopwords: activeStopwords() });
  lastFrequency = frequency;
  if (frequencySvg) renderFrequencyChart(frequencySvg, frequency, tokenizeWords(text).length);

  const sentiment = analyzeSentiment(text);
  lastSentiment = sentiment;
  if (sentimentSvg) renderSentimentGauge(sentimentSvg, sentiment);
  if (sentenceSentimentSvg) renderSentenceSentimentStrip(sentenceSentimentSvg, analyzeSentimentBySentence(text));

  const readability = analyzeReadability(text);
  lastReadability = readability;
  if (readabilitySvg) renderReadabilityPanel(readabilitySvg, readability);
  if (statsStripEl) {
    renderStatsStrip(statsStripEl, {
      wordCount: readability.wordCount,
      sentenceCount: readability.sentenceCount,
    });
  }
}

/** Runs the analysis pipeline and reflects the text into the URL for sharing. */
function render(text: string): void {
  renderAnalysis(text);
  syncUrl(text);
}

function debounce(fn: (text: string) => void, delay: number): (text: string) => void {
  let handle: ReturnType<typeof setTimeout> | undefined;
  return (text: string) => {
    if (handle) clearTimeout(handle);
    handle = setTimeout(() => fn(text), delay);
  };
}

/** Flashes the button's label, then restores it after a short delay. */
function flashCopyButtonLabel(label: string): void {
  if (!copySummaryButton) return;
  const original = copySummaryButton.dataset.originalLabel ?? copySummaryButton.textContent ?? '';
  copySummaryButton.dataset.originalLabel = original;
  copySummaryButton.textContent = label;
  setTimeout(() => {
    if (copySummaryButton) copySummaryButton.textContent = original;
  }, 1500);
}

copySummaryButton?.addEventListener('click', () => {
  const summary = buildSummaryText({ frequency: lastFrequency, sentiment: lastSentiment, readability: lastReadability });
  Promise.resolve()
    .then(() => navigator.clipboard.writeText(summary))
    .then(
      () => flashCopyButtonLabel('Copied!'),
      () => flashCopyButtonLabel('Copy failed'),
    );
});

if (input) {
  const debouncedRender = debounce(render, DEBOUNCE_MS);
  input.addEventListener('input', () => {
    if (pendingIndicator) pendingIndicator.hidden = false;
    debouncedRender(input.value);
  });
  wordLimitInput?.addEventListener('input', () => render(input.value));
  clearInputButton?.addEventListener('click', () => {
    input.value = '';
    render('');
    input.focus();
  });
  extraStopwordsInput?.addEventListener('input', () => render(input.value));

  if (typeof ResizeObserver !== 'undefined') {
    const debouncedResize = debounce(render, DEBOUNCE_MS);
    const resizeObserver = new ResizeObserver(() => debouncedResize(input.value));
    if (frequencySvg) resizeObserver.observe(frequencySvg.parentElement ?? frequencySvg);
    if (sentenceSentimentSvg) resizeObserver.observe(sentenceSentimentSvg.parentElement ?? sentenceSentimentSvg);
  }

  fileInput?.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (file) void loadFileIntoInput(file);
  });

  input.addEventListener('dragover', (event) => {
    event.preventDefault();
    input.classList.add('drag-over');
  });
  input.addEventListener('dragleave', () => input.classList.remove('drag-over'));
  input.addEventListener('drop', (event) => {
    event.preventDefault();
    input.classList.remove('drag-over');
    const file = event.dataTransfer?.files?.[0];
    if (file) void loadFileIntoInput(file);
  });

  const sample =
    'Lexiscope is a wonderful little tool. It is not boring at all, ' +
    'and the visualizations feel genuinely alive as you type.';
  input.value = decodeTextFromQuery(location.search) ?? sample;
  // Analyze without syncing the URL: a shared link's URL already matches,
  // and the placeholder sample shouldn't overwrite a clean root URL.
  renderAnalysis(input.value);
}
