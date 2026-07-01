import { wordFrequency } from './analysis/frequency';
import { analyzeSentiment } from './analysis/sentiment';
import { analyzeReadability } from './analysis/readability';
import { STOPWORDS } from './analysis/stopwords';
import { tokenizeWords } from './analysis/tokenizer';
import { renderFrequencyChart } from './viz/frequencyChart';
import { renderSentimentGauge } from './viz/sentimentGauge';
import { renderReadabilityPanel } from './viz/readabilityPanel';
import { renderStatsStrip } from './viz/statsStrip';
import { oppositeTheme, resolveInitialTheme, type Theme } from './theme';
import { decodeTextFromQuery, encodeTextToQuery } from './urlState';

const DEBOUNCE_MS = 120;
const DEFAULT_WORD_LIMIT = 15;
const THEME_STORAGE_KEY = 'lexiscope-theme';

const input = document.querySelector<HTMLTextAreaElement>('#input');
const wordLimitInput = document.querySelector<HTMLInputElement>('#word-limit');
const extraStopwordsInput = document.querySelector<HTMLInputElement>('#extra-stopwords');
const frequencySvg = document.querySelector<SVGSVGElement>('#frequency-chart');
const sentimentSvg = document.querySelector<SVGSVGElement>('#sentiment-gauge');
const readabilitySvg = document.querySelector<SVGSVGElement>('#readability-panel');
const statsStripEl = document.querySelector<HTMLElement>('#stats-strip');
const fileInput = document.querySelector<HTMLInputElement>('#file-input');
const pendingIndicator = document.querySelector<HTMLElement>('#pending-indicator');
const themeToggle = document.querySelector<HTMLButtonElement>('#theme-toggle');

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

async function loadFileIntoInput(file: File): Promise<void> {
  if (!input) return;
  input.value = await readFileAsText(file);
  render(input.value);
}

/** Merges the built-in stopword list with the comma-separated custom entries. */
function activeStopwords(): Set<string> {
  const extra = (extraStopwordsInput?.value ?? '')
    .split(',')
    .map((w) => w.trim().toLowerCase())
    .filter((w) => w.length > 0);
  return extra.length > 0 ? new Set([...STOPWORDS, ...extra]) : STOPWORDS;
}

function activeWordLimit(): number {
  const parsed = Number(wordLimitInput?.value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_WORD_LIMIT;
}

/** Reflects the current text into the URL so the analysis can be linked or bookmarked. */
function syncUrl(text: string): void {
  const query = encodeTextToQuery(text);
  history.replaceState(null, '', `${location.pathname}${query}`);
}

function render(text: string): void {
  if (pendingIndicator) pendingIndicator.hidden = true;
  syncUrl(text);

  if (frequencySvg) {
    const frequency = wordFrequency(text, { limit: activeWordLimit(), stopwords: activeStopwords() });
    renderFrequencyChart(frequencySvg, frequency, tokenizeWords(text).length);
  }
  if (sentimentSvg) renderSentimentGauge(sentimentSvg, analyzeSentiment(text));

  const readability = analyzeReadability(text);
  if (readabilitySvg) renderReadabilityPanel(readabilitySvg, readability);
  if (statsStripEl) {
    renderStatsStrip(statsStripEl, {
      wordCount: readability.wordCount,
      sentenceCount: readability.sentenceCount,
    });
  }
}

function debounce(fn: (text: string) => void, delay: number): (text: string) => void {
  let handle: ReturnType<typeof setTimeout> | undefined;
  return (text: string) => {
    if (handle) clearTimeout(handle);
    handle = setTimeout(() => fn(text), delay);
  };
}

if (input) {
  const debouncedRender = debounce(render, DEBOUNCE_MS);
  input.addEventListener('input', () => {
    if (pendingIndicator) pendingIndicator.hidden = false;
    debouncedRender(input.value);
  });
  wordLimitInput?.addEventListener('input', () => render(input.value));
  extraStopwordsInput?.addEventListener('input', () => render(input.value));

  if (frequencySvg && typeof ResizeObserver !== 'undefined') {
    const debouncedResize = debounce(render, DEBOUNCE_MS);
    new ResizeObserver(() => debouncedResize(input.value)).observe(frequencySvg.parentElement ?? frequencySvg);
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
  render(input.value);
}
