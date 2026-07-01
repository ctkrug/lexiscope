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

  it('respects the limit option', () => {
    const result = wordFrequency('alpha beta gamma delta', { limit: 2 });
    expect(result).toHaveLength(2);
  });

  it('returns an empty array for stopword-only text', () => {
    expect(wordFrequency('the a an of')).toEqual([]);
  });

  it('accepts a custom stopword set', () => {
    const result = wordFrequency('alpha beta gamma', { stopwords: new Set(['alpha']) });
    expect(result).toEqual([
      { word: 'beta', count: 1 },
      { word: 'gamma', count: 1 },
    ]);
  });

  it('excludes single-character tokens even when not a stopword', () => {
    const result = wordFrequency('x marks the spot, x again', { stopwords: new Set() });
    expect(result.find((w) => w.word === 'x')).toBeUndefined();
  });

  it('breaks count ties alphabetically for stable ordering', () => {
    const result = wordFrequency('zebra apple mango');
    expect(result.map((w) => w.word)).toEqual(['apple', 'mango', 'zebra']);
  });
});
