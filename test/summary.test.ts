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
});
