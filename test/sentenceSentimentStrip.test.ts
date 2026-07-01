import { describe, expect, it } from 'vitest';
import { renderSentenceSentimentStrip } from '../src/viz/sentenceSentimentStrip';

function makeSvg(): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement;
  Object.defineProperty(svg, 'clientWidth', { value: 300, configurable: true });
  return svg;
}

describe('renderSentenceSentimentStrip', () => {
  it('renders one segment per sentence, colored by label', () => {
    const svg = makeSvg();
    renderSentenceSentimentStrip(svg, [
      { sentence: 'This is wonderful.', score: 3, matchedWords: 1, label: 'positive' },
      { sentence: 'This is terrible.', score: -3, matchedWords: 1, label: 'negative' },
    ]);

    const segments = svg.querySelectorAll('rect.segment');
    expect(segments).toHaveLength(2);
    expect(segments[0].getAttribute('fill')).toBe('#4f9257');
    expect(segments[1].getAttribute('fill')).toBe('#c14e3d');
  });

  it('includes a tooltip with a truncated sentence preview and score', () => {
    const svg = makeSvg();
    const longSentence = 'a'.repeat(100);
    renderSentenceSentimentStrip(svg, [{ sentence: longSentence, score: 0, matchedWords: 0, label: 'neutral' }]);

    const title = svg.querySelector('rect.segment title');
    expect(title?.textContent).toBe(`${'a'.repeat(77)}...\nneutral (0.00)`);
  });

  it('removes stale segments when the sentence count shrinks', () => {
    const svg = makeSvg();
    renderSentenceSentimentStrip(svg, [
      { sentence: 'One.', score: 0, matchedWords: 0, label: 'neutral' },
      { sentence: 'Two.', score: 0, matchedWords: 0, label: 'neutral' },
    ]);
    renderSentenceSentimentStrip(svg, [{ sentence: 'One.', score: 0, matchedWords: 0, label: 'neutral' }]);

    expect(svg.querySelectorAll('rect.segment')).toHaveLength(1);
  });

  it('renders no segments for empty input without throwing', () => {
    const svg = makeSvg();
    expect(() => renderSentenceSentimentStrip(svg, [])).not.toThrow();
    expect(svg.querySelectorAll('rect.segment')).toHaveLength(0);
  });

  it('clamps opacity at full confidence for an out-of-range score', () => {
    const svg = makeSvg();
    renderSentenceSentimentStrip(svg, [{ sentence: 'Extremely amazing!', score: 8, matchedWords: 1, label: 'positive' }]);

    const segment = svg.querySelector('rect.segment');
    expect(segment?.getAttribute('fill-opacity')).toBe('1');
  });

  it('never shows a near-zero negative score as "-0.00" in the tooltip', () => {
    const svg = makeSvg();
    renderSentenceSentimentStrip(svg, [{ sentence: 'Roughly neutral.', score: -0.001, matchedWords: 1, label: 'neutral' }]);

    const title = svg.querySelector('rect.segment title');
    expect(title?.textContent).toBe('Roughly neutral.\nneutral (0.00)');
  });
});
