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

  it('scores an intensified word higher than the bare word', () => {
    const bare = analyzeSentiment('good');
    const intensified = analyzeSentiment('very good');
    expect(intensified.score).toBeGreaterThan(bare.score);
  });

  it('scores a downplayed word lower than the bare word', () => {
    const bare = analyzeSentiment('good');
    const downplayed = analyzeSentiment('slightly good');
    expect(downplayed.score).toBeLessThan(bare.score);
    expect(downplayed.score).toBeGreaterThan(0);
  });

  it('combines negation and intensification', () => {
    const result = analyzeSentiment('not very good');
    expect(result.score).toBeLessThan(analyzeSentiment('not good').score);
  });
});
