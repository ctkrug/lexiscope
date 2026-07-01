import { describe, expect, it } from 'vitest';
import { wordFrequency } from '../src/analysis/frequency';

describe('wordFrequency', () => {
  it('counts words and excludes stopwords', () => {
    const result = wordFrequency('the cat sat on the mat with the cat');
    expect(result).toEqual([
      { word: 'cat', count: 2 },
      { word: 'mat', count: 1 },
      { word: 'sat', count: 1 },
    ]);
  });

  it('respects the limit parameter', () => {
    const result = wordFrequency('alpha beta gamma delta', 2);
    expect(result).toHaveLength(2);
  });

  it('returns an empty array for stopword-only text', () => {
    expect(wordFrequency('the a an of')).toEqual([]);
  });
});
