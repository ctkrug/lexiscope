import { describe, expect, it } from 'vitest';
import { decodeTextFromQuery, encodeTextToQuery } from '../src/urlState';

describe('encodeTextToQuery', () => {
  it('encodes text as a text= query string', () => {
    expect(encodeTextToQuery('hello world')).toBe('?text=hello%20world');
  });

  it('returns an empty string for empty text', () => {
    expect(encodeTextToQuery('')).toBe('');
  });

  it('percent-encodes special characters', () => {
    expect(encodeTextToQuery('a & b?')).toBe('?text=a%20%26%20b%3F');
  });
});

describe('decodeTextFromQuery', () => {
  it('round-trips text encoded by encodeTextToQuery', () => {
    const text = 'Lexiscope is great! Isn\'t it?';
    expect(decodeTextFromQuery(encodeTextToQuery(text))).toBe(text);
  });

  it('returns null when there is no text param', () => {
    expect(decodeTextFromQuery('')).toBeNull();
    expect(decodeTextFromQuery('?other=1')).toBeNull();
  });

  it('returns null for an empty text param', () => {
    expect(decodeTextFromQuery('?text=')).toBeNull();
  });

  it('round-trips unicode text, including newlines and emoji', () => {
    const text = 'café résumé\nこんにちは 🎉';
    expect(decodeTextFromQuery(encodeTextToQuery(text))).toBe(text);
  });

  it('ignores other params alongside text', () => {
    expect(decodeTextFromQuery('?foo=bar&text=hi&baz=1')).toBe('hi');
  });

  it('treats a literal + as a space, per query-string convention', () => {
    expect(decodeTextFromQuery('?text=hello+world')).toBe('hello world');
  });
});
