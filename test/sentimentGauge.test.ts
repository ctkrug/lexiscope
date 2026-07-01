import { describe, expect, it } from 'vitest';
import { renderSentimentGauge } from '../src/viz/sentimentGauge';

function makeSvg(): SVGSVGElement {
  return document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement;
}

describe('renderSentimentGauge', () => {
  it('colors the fill arc green for a positive result', () => {
    const svg = makeSvg();
    renderSentimentGauge(svg, { score: 3, matchedWords: 2, label: 'positive' });
    expect(svg.querySelector('path.fill')?.getAttribute('fill')).toBe('#3fb56f');
  });

  it('colors the fill arc red for a negative result', () => {
    const svg = makeSvg();
    renderSentimentGauge(svg, { score: -3, matchedWords: 2, label: 'negative' });
    expect(svg.querySelector('path.fill')?.getAttribute('fill')).toBe('#e6553f');
  });

  it('colors the fill arc gray for a neutral result', () => {
    const svg = makeSvg();
    renderSentimentGauge(svg, { score: 0, matchedWords: 0, label: 'neutral' });
    expect(svg.querySelector('path.fill')?.getAttribute('fill')).toBe('#9aa1ab');
  });

  it('labels the gauge with the sentiment word and score', () => {
    const svg = makeSvg();
    renderSentimentGauge(svg, { score: 1.234, matchedWords: 1, label: 'positive' });
    expect(svg.querySelector('text.label')?.textContent).toBe('positive (1.23)');
  });
});
