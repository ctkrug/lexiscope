import { describe, expect, it } from 'vitest';
import { buildSummaryText } from '../src/analysis/summary';

describe('buildSummaryText', () => {
  it('formats a multi-line digest of the analysis', () => {
    const summary = buildSummaryText({
      frequency: [
        { word: 'cat', count: 3 },
        { word: 'mat', count: 1 },
      ],
      sentiment: { score: 1.5, matchedWords: 2, label: 'positive' },
      readability: {
        sentenceCount: 2,
        wordCount: 10,
        syllableCount: 12,
        fleschReadingEase: 80.456,
        fleschKincaidGrade: 3.21,
      },
    });

    expect(summary).toBe(
      [
        'Lexiscope analysis summary',
        'Words: 10 | Sentences: 2',
        'Sentiment: positive (1.50)',
        'Readability: Flesch ease 80.5, grade level 3.2',
        'Top words: cat (3), mat (1)',
      ].join('\n'),
    );
  });

  it('shows "none" when there are no frequent words', () => {
    const summary = buildSummaryText({
      frequency: [],
      sentiment: { score: 0, matchedWords: 0, label: 'neutral' },
      readability: { sentenceCount: 0, wordCount: 0, syllableCount: 0, fleschReadingEase: 0, fleschKincaidGrade: 0 },
    });

    expect(summary).toContain('Top words: none');
  });

  it('caps the top-words list at five entries even with more ranked words', () => {
    const frequency = ['one', 'two', 'three', 'four', 'five', 'six', 'seven'].map((word, i) => ({
      word,
      count: 7 - i,
    }));
    const summary = buildSummaryText({
      frequency,
      sentiment: { score: 0, matchedWords: 0, label: 'neutral' },
      readability: { sentenceCount: 1, wordCount: 7, syllableCount: 7, fleschReadingEase: 0, fleschKincaidGrade: 0 },
    });

    const topWordsLine = summary.split('\n').find((line) => line.startsWith('Top words:'));
    expect(topWordsLine).toBe('Top words: one (7), two (6), three (5), four (4), five (3)');
  });

  it('never shows a near-zero negative score as "-0.00"', () => {
    const summary = buildSummaryText({
      frequency: [],
      sentiment: { score: -0.001, matchedWords: 1, label: 'neutral' },
      readability: { sentenceCount: 1, wordCount: 1, syllableCount: 1, fleschReadingEase: 0, fleschKincaidGrade: 0 },
    });

    expect(summary).toContain('Sentiment: neutral (0.00)');
  });
});
