// Matches runs of Unicode letters/digits, allowing a single internal
// hyphen or apostrophe between runs so "state-of-the-art" and "it's"
// tokenize as one word each, while bare punctuation never matches.
const WORD_RE = /[\p{L}\p{N}]+(?:['-][\p{L}\p{N}]+)*/gu;
const SENTENCE_SPLIT_RE = /[.!?]+(?:\s+|$)/;

/** Extracts lowercase word tokens from raw text, stripping surrounding punctuation. */
export function tokenizeWords(text: string): string[] {
  return text.match(WORD_RE)?.map((w) => w.toLowerCase()) ?? [];
}

/** Splits raw text into non-empty sentences on ./!/? boundaries. */
export function tokenizeSentences(text: string): string[] {
  return text
    .split(SENTENCE_SPLIT_RE)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}
