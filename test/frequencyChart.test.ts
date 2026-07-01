import { describe, expect, it } from 'vitest';
import { renderFrequencyChart } from '../src/viz/frequencyChart';

function makeSvg(): SVGSVGElement {
  return document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement;
}

describe('renderFrequencyChart', () => {
  it('renders one bar per word with a hover tooltip', () => {
    const svg = makeSvg();
    renderFrequencyChart(svg, [{ word: 'cat', count: 3 }, { word: 'mat', count: 1 }], 20);

    const bars = svg.querySelectorAll('rect');
    expect(bars).toHaveLength(2);

    const catTitle = bars[0].querySelector('title');
    expect(catTitle?.textContent).toBe('cat: 3 (15.0% of 20 words)');
  });

  it('shows 0.0% when total words is zero', () => {
    const svg = makeSvg();
    renderFrequencyChart(svg, [{ word: 'cat', count: 1 }], 0);

    const title = svg.querySelector('rect title');
    expect(title?.textContent).toBe('cat: 1 (0.0% of 0 words)');
  });

  it('shrinks the label margin on narrow containers', () => {
    const wide = makeSvg();
    Object.defineProperty(wide, 'clientWidth', { value: 400, configurable: true });
    renderFrequencyChart(wide, [{ word: 'cat', count: 1 }]);
    const wideTransform = wide.querySelector('g.bars')?.getAttribute('transform');

    const narrow = makeSvg();
    Object.defineProperty(narrow, 'clientWidth', { value: 200, configurable: true });
    renderFrequencyChart(narrow, [{ word: 'cat', count: 1 }]);
    const narrowTransform = narrow.querySelector('g.bars')?.getAttribute('transform');

    expect(wideTransform).toBe('translate(90, 0)');
    expect(narrowTransform).toBe('translate(56, 0)');
  });
});
