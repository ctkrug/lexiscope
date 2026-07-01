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
    expect(tokenizeWords('   --- ...  ')).toEqual([]);
  });

  it('treats digit runs as tokens', () => {
    expect(tokenizeWords('There are 42 cats and 7 dogs.')).toEqual([
      'there',
      'are',
      '42',
      'cats',
      'and',
      '7',
      'dogs',
    ]);
  });

  it('keeps hyphenated compounds as a single token', () => {
    expect(tokenizeWords('a state-of-the-art design')).toEqual([
      'a',
      'state-of-the-art',
      'design',
    ]);
  });

  it('matches unicode letters such as accents and non-Latin scripts', () => {
    expect(tokenizeWords('café résumé naïve')).toEqual(['café', 'résumé', 'naïve']);
    expect(tokenizeWords('こんにちは 世界')).toEqual(['こんにちは', '世界']);
  });

  it('does not include leading or trailing punctuation in a token', () => {
    expect(tokenizeWords('"quoted"—dash, (parens)')).toEqual(['quoted', 'dash', 'parens']);
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
