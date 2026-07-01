import { describe, expect, it } from 'vitest';
import { analyzeReadability, countSyllables } from '../src/analysis/readability';

describe('countSyllables', () => {
  it('counts simple words', () => {
    expect(countSyllables('cat')).toBe(1);
    expect(countSyllables('happy')).toBe(2);
  });

  it('drops a trailing silent e', () => {
    expect(countSyllables('like')).toBe(1);
  });

  it('never returns fewer than one syllable', () => {
    expect(countSyllables('the')).toBeGreaterThanOrEqual(1);
  });
});

describe('analyzeReadability', () => {
  it('returns zeroed metrics for empty text', () => {
    expect(analyzeReadability('')).toEqual({
      sentenceCount: 0,
      wordCount: 0,
      syllableCount: 0,
      fleschReadingEase: 0,
      fleschKincaidGrade: 0,
    });
  });

  it('scores simple text as easier than complex text', () => {
    const simple = analyzeReadability('The cat sat on the mat. It was a good day.');
    const complex = analyzeReadability(
      'The multifaceted implementation necessitated extraordinarily comprehensive documentation.',
    );
    expect(simple.fleschReadingEase).toBeGreaterThan(complex.fleschReadingEase);
  });

  it('counts sentences and words correctly', () => {
    const result = analyzeReadability('One two three. Four five.');
    expect(result.sentenceCount).toBe(2);
    expect(result.wordCount).toBe(5);
  });
});
