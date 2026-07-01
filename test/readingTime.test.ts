import { describe, expect, it } from 'vitest';
import { estimateReadingMinutes } from '../src/analysis/readingTime';

describe('estimateReadingMinutes', () => {
  it('returns zero for empty text', () => {
    expect(estimateReadingMinutes(0)).toBe(0);
  });

  it('rounds up to at least one minute for short text', () => {
    expect(estimateReadingMinutes(10)).toBe(1);
  });

  it('rounds up to the nearest whole minute for longer text', () => {
    expect(estimateReadingMinutes(450)).toBe(3);
  });

  it('divides evenly at the words-per-minute boundary', () => {
    expect(estimateReadingMinutes(400)).toBe(2);
  });
});
