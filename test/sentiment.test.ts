import { describe, expect, it } from 'vitest';
import { analyzeSentiment } from '../src/analysis/sentiment';

describe('analyzeSentiment', () => {
  it('scores clearly positive text as positive', () => {
    const result = analyzeSentiment('This is an amazing and wonderful day.');
    expect(result.label).toBe('positive');
    expect(result.score).toBeGreaterThan(0);
  });

  it('scores clearly negative text as negative', () => {
    const result = analyzeSentiment('This is a terrible and awful mess.');
    expect(result.label).toBe('negative');
    expect(result.score).toBeLessThan(0);
  });

  it('flips polarity after a negator', () => {
    const result = analyzeSentiment('not good');
    expect(result.score).toBeLessThan(0);
  });

  it('treats text with no lexicon matches as neutral', () => {
    const result = analyzeSentiment('the quick brown fox jumps');
    expect(result).toEqual({ score: 0, matchedWords: 0, label: 'neutral' });
  });
});
