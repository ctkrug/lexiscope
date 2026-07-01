import { wordFrequency } from './analysis/frequency';
import { analyzeSentiment } from './analysis/sentiment';
import { analyzeReadability } from './analysis/readability';
import { STOPWORDS } from './analysis/stopwords';
import { tokenizeWords } from './analysis/tokenizer';
import { renderFrequencyChart } from './viz/frequencyChart';
import { renderSentimentGauge } from './viz/sentimentGauge';
import { renderReadabilityPanel } from './viz/readabilityPanel';
import { renderStatsStrip } from './viz/statsStrip';

const DEBOUNCE_MS = 120;
const DEFAULT_WORD_LIMIT = 15;

const input = document.querySelector<HTMLTextAreaElement>('#input');
const wordLimitInput = document.querySelector<HTMLInputElement>('#word-limit');
const extraStopwordsInput = document.querySelector<HTMLInputElement>('#extra-stopwords');
const frequencySvg = document.querySelector<SVGSVGElement>('#frequency-chart');
const sentimentSvg = document.querySelector<SVGSVGElement>('#sentiment-gauge');
const readabilitySvg = document.querySelector<SVGSVGElement>('#readability-panel');
const statsStripEl = document.querySelector<HTMLElement>('#stats-strip');

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

function render(text: string): void {
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
  input.addEventListener('input', () => debouncedRender(input.value));
  wordLimitInput?.addEventListener('input', () => render(input.value));
  extraStopwordsInput?.addEventListener('input', () => render(input.value));

  if (frequencySvg && typeof ResizeObserver !== 'undefined') {
    const debouncedResize = debounce(render, DEBOUNCE_MS);
    new ResizeObserver(() => debouncedResize(input.value)).observe(frequencySvg.parentElement ?? frequencySvg);
  }

  const sample =
    'Lexiscope is a wonderful little tool. It is not boring at all, ' +
    'and the visualizations feel genuinely alive as you type.';
  input.value = sample;
  render(sample);
}
