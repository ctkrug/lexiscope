import { estimateReadingMinutes } from '../analysis/readingTime';

export interface StatsStripData {
  wordCount: number;
  sentenceCount: number;
}

interface Stat {
  label: string;
  value: string;
}

function statsFor(data: StatsStripData): Stat[] {
  const minutes = estimateReadingMinutes(data.wordCount);
  return [
    { label: 'Words', value: String(data.wordCount) },
    { label: 'Sentences', value: String(data.sentenceCount) },
    { label: 'Reading time', value: data.wordCount > 0 ? `${minutes} min` : '—' },
  ];
}

/** Renders a compact word/sentence/reading-time summary into the container. */
export function renderStatsStrip(container: HTMLElement, data: StatsStripData): void {
  container.innerHTML = '';
  for (const stat of statsFor(data)) {
    const item = document.createElement('div');
    item.className = 'stat';

    const value = document.createElement('span');
    value.className = 'stat-value';
    value.textContent = stat.value;

    const label = document.createElement('span');
    label.className = 'stat-label';
    label.textContent = stat.label;

    item.append(value, label);
    container.append(item);
  }
}
