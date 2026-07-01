import { describe, expect, it } from 'vitest';
import { renderReadabilityPanel } from '../src/viz/readabilityPanel';

function makeSvg(): SVGSVGElement {
  return document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement;
}

function fills(svg: SVGSVGElement): string[] {
  return [...svg.querySelectorAll('rect.metric-fill')].map((el) => el.getAttribute('fill') ?? '');
}

describe('renderReadabilityPanel', () => {
  it('colors an easy-to-read result green on both meters', () => {
    const svg = makeSvg();
    renderReadabilityPanel(svg, {
      sentenceCount: 3,
      wordCount: 20,
      syllableCount: 20,
      fleschReadingEase: 95,
      fleschKincaidGrade: 1,
    });
    expect(fills(svg)).toEqual(['#3fb56f', '#3fb56f']);
  });

  it('colors a hard-to-read result red on both meters', () => {
    const svg = makeSvg();
    renderReadabilityPanel(svg, {
      sentenceCount: 1,
      wordCount: 40,
      syllableCount: 90,
      fleschReadingEase: 5,
      fleschKincaidGrade: 17,
    });
    expect(fills(svg)).toEqual(['#e6553f', '#e6553f']);
  });

  it('colors a mid-range result amber on both meters', () => {
    const svg = makeSvg();
    renderReadabilityPanel(svg, {
      sentenceCount: 2,
      wordCount: 20,
      syllableCount: 30,
      fleschReadingEase: 50,
      fleschKincaidGrade: 9,
    });
    expect(fills(svg)).toEqual(['#e0a83e', '#e0a83e']);
  });

  it('clamps out-of-domain values instead of throwing', () => {
    const svg = makeSvg();
    expect(() =>
      renderReadabilityPanel(svg, {
        sentenceCount: 1,
        wordCount: 5,
        syllableCount: 5,
        fleschReadingEase: -40,
        fleschKincaidGrade: 25,
      }),
    ).not.toThrow();
    expect(fills(svg)).toEqual(['#e6553f', '#e6553f']);
  });
});
