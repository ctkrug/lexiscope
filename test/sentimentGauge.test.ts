import { describe, expect, it } from 'vitest';
import { renderSentimentGauge } from '../src/viz/sentimentGauge';

function makeSvg(): SVGSVGElement {
  return document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement;
}

describe('renderSentimentGauge', () => {
  it('colors the fill arc green for a positive result', () => {
    const svg = makeSvg();
    renderSentimentGauge(svg, { score: 3, matchedWords: 2, label: 'positive' });
    expect(svg.querySelector('path.fill')?.getAttribute('fill')).toBe('#4f9257');
  });

  it('colors the fill arc red for a negative result', () => {
    const svg = makeSvg();
    renderSentimentGauge(svg, { score: -3, matchedWords: 2, label: 'negative' });
    expect(svg.querySelector('path.fill')?.getAttribute('fill')).toBe('#c14e3d');
  });

  it('colors the fill arc gray for a neutral result', () => {
    const svg = makeSvg();
    renderSentimentGauge(svg, { score: 0, matchedWords: 0, label: 'neutral' });
    expect(svg.querySelector('path.fill')?.getAttribute('fill')).toBe('#a39a86');
  });

  it('labels the gauge with the sentiment word and score', () => {
    const svg = makeSvg();
    renderSentimentGauge(svg, { score: 1.234, matchedWords: 1, label: 'positive' });
    expect(svg.querySelector('text.label')?.textContent).toBe('positive (1.23)');
  });

  it('clamps the fill fraction instead of throwing for an out-of-range score', () => {
    const svg = makeSvg();
    // An intensifier ("extremely") can push a single word's score past ±5.
    expect(() => renderSentimentGauge(svg, { score: 8, matchedWords: 1, label: 'positive' })).not.toThrow();
    expect(svg.querySelector('path.fill')?.getAttribute('data-fraction')).toBe('1');
  });

  it('never labels a near-zero negative score as "-0.00"', () => {
    const svg = makeSvg();
    renderSentimentGauge(svg, { score: -0.001, matchedWords: 1, label: 'neutral' });
    expect(svg.querySelector('text.label')?.textContent).toBe('neutral (0.00)');
  });
});
