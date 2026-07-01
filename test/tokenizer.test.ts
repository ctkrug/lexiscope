import { describe, expect, it } from 'vitest';
import { tokenizeSentences, tokenizeWords } from '../src/analysis/tokenizer';

describe('tokenizeWords', () => {
  it('lowercases and strips punctuation', () => {
    expect(tokenizeWords("Hello, World! It's great.")).toEqual([
      'hello',
      'world',
      "it's",
      'great',
    ]);
  });

  it('returns an empty array for text with no words', () => {
    expect(tokenizeWords('   123 --- ')).toEqual([]);
  });
});

describe('tokenizeSentences', () => {
  it('splits on sentence-ending punctuation', () => {
    expect(tokenizeSentences('One. Two! Three?')).toEqual(['One', 'Two', 'Three']);
  });

  it('ignores trailing whitespace and empty fragments', () => {
    expect(tokenizeSentences('Only one sentence   ')).toEqual(['Only one sentence']);
  });
});
