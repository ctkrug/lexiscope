import { describe, expect, it } from 'vitest';
import { STOPWORDS } from '../src/analysis/stopwords';

describe('STOPWORDS', () => {
  it('contains only lowercase, non-empty entries', () => {
    for (const word of STOPWORDS) {
      expect(word).toBe(word.toLowerCase());
      expect(word.length).toBeGreaterThan(0);
    }
  });

});
