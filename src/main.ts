import { wordFrequency } from './analysis/frequency';
import { analyzeSentiment } from './analysis/sentiment';
import { analyzeReadability } from './analysis/readability';
import { renderFrequencyChart } from './viz/frequencyChart';
import { renderSentimentGauge } from './viz/sentimentGauge';
import { renderReadabilityPanel } from './viz/readabilityPanel';

const DEBOUNCE_MS = 120;

const input = document.querySelector<HTMLTextAreaElement>('#input');
const frequencySvg = document.querySelector<SVGSVGElement>('#frequency-chart');
const sentimentSvg = document.querySelector<SVGSVGElement>('#sentiment-gauge');
const readabilitySvg = document.querySelector<SVGSVGElement>('#readability-panel');

function render(text: string): void {
  if (frequencySvg) renderFrequencyChart(frequencySvg, wordFrequency(text));
  if (sentimentSvg) renderSentimentGauge(sentimentSvg, analyzeSentiment(text));
  if (readabilitySvg) renderReadabilityPanel(readabilitySvg, analyzeReadability(text));
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

  const sample =
    'Lexiscope is a wonderful little tool. It is not boring at all, ' +
    'and the visualizations feel genuinely alive as you type.';
  input.value = sample;
  render(sample);
}
