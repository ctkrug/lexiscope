const WORDS_PER_MINUTE = 200;

/**
 * Estimates reading time in whole minutes at an average 200 words/minute,
 * rounding up so any non-empty text reads as at least one minute.
 */
export function estimateReadingMinutes(wordCount: number): number {
  if (wordCount <= 0) return 0;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}
