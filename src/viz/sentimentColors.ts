import type { SentimentResult } from '../analysis/sentiment';

/** Shared label→color mapping used by every sentiment-related visualization.
 * Values sit in the paper-and-ink family from docs/DESIGN.md, not stock
 * traffic lights, so the charts read as part of the page. */
export const SENTIMENT_COLORS: Record<SentimentResult['label'], string> = {
  negative: '#c14e3d',
  neutral: '#a39a86',
  positive: '#4f9257',
};
