/**
 * Small hand-curated polarity lexicon, scored -5 (very negative) to +5
 * (very positive) in the style of AFINN. Not exhaustive by design — it's a
 * lightweight, dependency-free approximation, not a research-grade model.
 */
export const SENTIMENT_LEXICON: Record<string, number> = {
  abysmal: -4, adequate: 1, amazing: 4, angry: -3, annoying: -2, awesome: 4, awful: -3,
  bad: -3, beautiful: 3, best: 4, boring: -2, brilliant: 4, broken: -2,
  calm: 2, catastrophic: -4, charming: 3, cheerful: 3, clumsy: -1, confusing: -1,
  delight: 3, delightful: 3, depressing: -3, disappointing: -2, disaster: -3,
  dislike: -2, disgusting: -3, dreadful: -3, dull: -1, elegant: 2, embarrassing: -2,
  enjoy: 2, excellent: 4, exciting: 3, fail: -2, failure: -3, fantastic: 4,
  fear: -2, fine: 1, flawless: 4, frustrating: -2, fun: 2, good: 2,
  gorgeous: 3, great: 3, happy: 3, harsh: -2, hate: -3, horrible: -3,
  hurt: -2, ideal: 3, impressive: 3, inspiring: 3, joy: 3, joyful: 3,
  lacking: -1, lame: -2, love: 3, lovely: 3, magnificent: 4, mediocre: -1,
  messy: -1, miserable: -3, nice: 2, outstanding: 4, painful: -2, perfect: 4,
  pleasant: 2, pleased: 2, poor: -2, positive: 2, pretty: 2, sad: -2,
  satisfied: 2, scary: -2, shoddy: -2, stunning: 4, superb: 4, terrible: -3,
  terrific: 3, tragic: -3, ugly: -2, unhappy: -2, upset: -2, useless: -2,
  vibrant: 3, wonderful: 4, worst: -4, worthless: -3,
};

/** Negators that flip the polarity of the following word. */
export const NEGATORS = new Set(["not", "no", "never", "isn't", "don't", "didn't", "can't"]);

/**
 * Adverbs that scale the polarity of the word immediately following them,
 * so "very good" scores higher than a bare "good" and "slightly good"
 * scores lower.
 */
export const INTENSIFIERS: Record<string, number> = {
  very: 1.5,
  extremely: 2,
  incredibly: 2,
  really: 1.5,
  remarkably: 1.5,
  somewhat: 0.5,
  slightly: 0.5,
  barely: 0.3,
};
