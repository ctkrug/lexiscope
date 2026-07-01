import type { WordCount } from './frequency';
import type { ReadabilityResult } from './readability';
import { formatScore, type SentimentResult } from './sentiment';

export interface SummaryInput {
  frequency: WordCount[];
  sentiment: SentimentResult;
  readability: ReadabilityResult;
}

/** Builds a plain-text digest of the current analysis, suitable for copying. */
export function buildSummaryText({ frequency, sentiment, readability }: SummaryInput): string {
  const topWords = frequency
    .slice(0, 5)
    .map((w) => `${w.word} (${w.count})`)
    .join(', ');

  const lines = [
    'Lexiscope analysis summary',
    `Words: ${readability.wordCount} | Sentences: ${readability.sentenceCount}`,
    `Sentiment: ${sentiment.label} (${formatScore(sentiment.score)})`,
    `Readability: Flesch ease ${readability.fleschReadingEase.toFixed(1)}, grade level ${readability.fleschKincaidGrade.toFixed(1)}`,
    `Top words: ${topWords.length > 0 ? topWords : 'none'}`,
  ];

  return lines.join('\n');
}
