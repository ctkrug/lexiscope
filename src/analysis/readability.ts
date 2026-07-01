import { tokenizeSentences, tokenizeWords } from './tokenizer';

export interface ReadabilityResult {
  sentenceCount: number;
  wordCount: number;
  syllableCount: number;
  /** Flesch Reading Ease, roughly 0 (very hard) to 100 (very easy). */
  fleschReadingEase: number;
  /** Flesch-Kincaid Grade Level, approximate US school grade. */
  fleschKincaidGrade: number;
}

const VOWEL_GROUPS_RE = /[aeiouy]+/g;

/**
 * Heuristic syllable count: counts vowel groups, drops a trailing silent
 * "e", and floors at one syllable per word. Good enough for aggregate
 * readability scoring, not meant to be phonetically precise.
 */
export function countSyllables(word: string): number {
  const lower = word.toLowerCase();
  const groups = lower.match(VOWEL_GROUPS_RE) ?? [];
  let count = groups.length;

  if (lower.endsWith('e') && !lower.endsWith('le') && count > 1) {
    count -= 1;
  }

  return Math.max(1, count);
}

/** Computes Flesch readability metrics over the given text. */
export function analyzeReadability(text: string): ReadabilityResult {
  const sentences = tokenizeSentences(text);
  const words = tokenizeWords(text);
  const sentenceCount = Math.max(1, sentences.length);
  const wordCount = words.length;
  const syllableCount = words.reduce((sum, w) => sum + countSyllables(w), 0);

  if (wordCount === 0) {
    return { sentenceCount: 0, wordCount: 0, syllableCount: 0, fleschReadingEase: 0, fleschKincaidGrade: 0 };
  }

  const wordsPerSentence = wordCount / sentenceCount;
  const syllablesPerWord = syllableCount / wordCount;

  const fleschReadingEase = 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;
  const fleschKincaidGrade = 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59;

  return {
    sentenceCount: sentences.length,
    wordCount,
    syllableCount,
    fleschReadingEase,
    fleschKincaidGrade,
  };
}
