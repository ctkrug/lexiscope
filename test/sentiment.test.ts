import { describe, expect, it } from 'vitest';
import { analyzeSentiment, analyzeSentimentBySentence, formatScore } from '../src/analysis/sentiment';

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

  it('carries negation through a filler word before the scored word', () => {
    const result = analyzeSentiment('not a bad restaurant');
    expect(result.score).toBeGreaterThan(0);
  });

  it('resets negation scope once it has applied to a scored word', () => {
    const result = analyzeSentiment('not bad but also good');
    expect(result.matchedWords).toBe(2);
    expect(result.score).toBeGreaterThan(0);
  });

  it('scores lexicon words regardless of input case', () => {
    expect(analyzeSentiment('AMAZING')).toEqual(analyzeSentiment('amazing'));
  });
});

describe('analyzeSentimentBySentence', () => {
  it('scores each sentence independently', () => {
    const results = analyzeSentimentBySentence('This is wonderful. This is terrible.');
    expect(results).toHaveLength(2);
    expect(results[0].sentence).toBe('This is wonderful');
    expect(results[0].label).toBe('positive');
    expect(results[1].sentence).toBe('This is terrible');
    expect(results[1].label).toBe('negative');
  });

  it('returns an empty array for empty text', () => {
    expect(analyzeSentimentBySentence('')).toEqual([]);
  });

  it('scores a neutral sentence among positive and negative ones', () => {
    const results = analyzeSentimentBySentence('This is wonderful. The cat sat down. This is terrible.');
    expect(results.map((r) => r.label)).toEqual(['positive', 'neutral', 'negative']);
  });
});

describe('formatScore', () => {
  it('formats an ordinary score to two decimals', () => {
    expect(formatScore(1.234)).toBe('1.23');
    expect(formatScore(-2.5)).toBe('-2.50');
  });

  it('normalizes a small negative score that rounds to zero', () => {
    expect(formatScore(-0.001)).toBe('0.00');
    expect(formatScore(-0)).toBe('0.00');
  });
});
