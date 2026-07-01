import { tokenizeWords } from './tokenizer';
import { STOPWORDS } from './stopwords';

export interface WordCount {
  word: string;
  count: number;
}

/**
 * Ranks non-stopword tokens by frequency, most common first. Ties break
 * alphabetically so re-renders don't jitter when counts are equal.
 */
export function wordFrequency(text: string, limit = 15): WordCount[] {
  const counts = new Map<string, number>();

  for (const word of tokenizeWords(text)) {
    if (STOPWORDS.has(word) || word.length < 2) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
    .slice(0, limit);
}
