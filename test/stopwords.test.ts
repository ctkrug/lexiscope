import { describe, expect, it } from 'vitest';
import { STOPWORDS } from '../src/analysis/stopwords';

describe('STOPWORDS', () => {
  it('contains only lowercase, non-empty entries', () => {
    for (const word of STOPWORDS) {
      expect(word).toBe(word.toLowerCase());
      expect(word.length).toBeGreaterThan(0);
    }
  });

  it('contains common function words', () => {
    for (const word of ['the', 'a', 'is', 'and', 'of', 'to']) {
      expect(STOPWORDS.has(word)).toBe(true);
    }
  });

  it('does not contain common content words', () => {
    for (const word of ['amazing', 'terrible', 'cat', 'lexiscope']) {
      expect(STOPWORDS.has(word)).toBe(false);
    }
  });
});
