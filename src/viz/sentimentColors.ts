import type { SentimentResult } from '../analysis/sentiment';

/** Shared label→color mapping used by every sentiment-related visualization. */
export const SENTIMENT_COLORS: Record<SentimentResult['label'], string> = {
  negative: '#e6553f',
  neutral: '#9aa1ab',
  positive: '#3fb56f',
};
