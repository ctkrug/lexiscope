const WORD_RE = /[A-Za-z']+/g;
const SENTENCE_SPLIT_RE = /[.!?]+(?:\s+|$)/;

/** Extracts lowercase word tokens from raw text, stripping punctuation. */
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
