import { tokenizeWords } from './tokenizer';
import { INTENSIFIERS, NEGATORS, SENTIMENT_LEXICON } from './sentimentLexicon';

export interface SentimentResult {
  /** Average per-word polarity, roughly in [-5, 5]. 0 for neutral/empty text. */
  score: number;
  /** Count of lexicon words that contributed to the score. */
  matchedWords: number;
  label: 'positive' | 'neutral' | 'negative';
}

const NEUTRAL_BAND = 0.15;

/**
 * Scores a pre-tokenized word list, flipping the sign of any word
 * immediately preceded by a negator ("not good" -> negative) and scaling
 * it by any immediately preceding intensifier ("very good" scores higher
 * than a bare "good").
 */
function scoreWords(words: string[]): SentimentResult {
  let total = 0;
  let matchedWords = 0;
  let negate = false;
  let intensity = 1;

  for (const word of words) {
    if (NEGATORS.has(word)) {
      negate = true;
      continue;
    }

    if (word in INTENSIFIERS) {
      intensity = INTENSIFIERS[word];
      continue;
    }

    const polarity = SENTIMENT_LEXICON[word];
    if (polarity !== undefined) {
      const scaled = polarity * intensity;
      total += negate ? -scaled : scaled;
      matchedWords += 1;
    }
    negate = false;
    intensity = 1;
  }

  const score = matchedWords > 0 ? total / matchedWords : 0;
  const label = score > NEUTRAL_BAND ? 'positive' : score < -NEUTRAL_BAND ? 'negative' : 'neutral';

  return { score, matchedWords, label };
}

/** Scores the polarity of an entire text, in the same style as {@link scoreWords}. */
export function analyzeSentiment(text: string): SentimentResult {
  return scoreWords(tokenizeWords(text));
}
