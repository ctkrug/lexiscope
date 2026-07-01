import { tokenizeWords } from './tokenizer';
import { NEGATORS, SENTIMENT_LEXICON } from './sentimentLexicon';

export interface SentimentResult {
  /** Average per-word polarity, roughly in [-5, 5]. 0 for neutral/empty text. */
  score: number;
  /** Count of lexicon words that contributed to the score. */
  matchedWords: number;
  label: 'positive' | 'neutral' | 'negative';
}

const NEUTRAL_BAND = 0.15;

/**
 * Scores text polarity by averaging lexicon hits, flipping the sign of any
 * word immediately preceded by a negator ("not good" -> negative).
 */
export function analyzeSentiment(text: string): SentimentResult {
  const words = tokenizeWords(text);
  let total = 0;
  let matchedWords = 0;
  let negate = false;

  for (const word of words) {
    if (NEGATORS.has(word)) {
      negate = true;
      continue;
    }

    const polarity = SENTIMENT_LEXICON[word];
    if (polarity !== undefined) {
      total += negate ? -polarity : polarity;
      matchedWords += 1;
    }
    negate = false;
  }

  const score = matchedWords > 0 ? total / matchedWords : 0;
  const label = score > NEUTRAL_BAND ? 'positive' : score < -NEUTRAL_BAND ? 'negative' : 'neutral';

  return { score, matchedWords, label };
}
