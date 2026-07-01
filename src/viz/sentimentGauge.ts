import * as d3 from 'd3';
import type { SentimentResult } from '../analysis/sentiment';

const WIDTH = 240;
const HEIGHT = 130;
const RADIUS = 100;

const COLORS: Record<SentimentResult['label'], string> = {
  negative: '#e6553f',
  neutral: '#9aa1ab',
  positive: '#3fb56f',
};

const arcGenerator = d3
  .arc<number>()
  .innerRadius(RADIUS - 18)
  .outerRadius(RADIUS)
  .startAngle(-Math.PI / 2)
  .endAngle((d) => -Math.PI / 2 + d * Math.PI);

/** Renders a semicircular needle gauge from -5..5 sentiment score to angle. */
export function renderSentimentGauge(svg: SVGSVGElement, result: SentimentResult): void {
  const selection = d3.select(svg).attr('width', WIDTH).attr('height', HEIGHT);
  const center = `translate(${WIDTH / 2}, ${HEIGHT - 10})`;

  let track = selection.select<SVGPathElement>('path.track');
  if (track.empty()) {
    track = selection.append('path').attr('class', 'track').attr('transform', center).attr('fill', '#e3e6ea');
    track.attr('d', arcGenerator(1));
  }

  // Normalize score from [-5, 5] to a [0, 1] fill fraction.
  const fraction = Math.min(1, Math.max(0, (result.score + 5) / 10));

  let fill = selection.select<SVGPathElement>('path.fill');
  if (fill.empty()) {
    fill = selection.append('path').attr('class', 'fill').attr('transform', center);
  }

  fill
    .transition()
    .duration(300)
    .attrTween('d', function tween(this: SVGPathElement) {
      const previous = Number(this.getAttribute('data-fraction') ?? 0);
      const interpolate = d3.interpolateNumber(previous, fraction);
      return (t: number) => arcGenerator(interpolate(t)) ?? '';
    })
    .attr('fill', COLORS[result.label])
    .attr('data-fraction', fraction);

  let label = selection.select<SVGTextElement>('text.label');
  if (label.empty()) {
    label = selection
      .append('text')
      .attr('class', 'label')
      .attr('x', WIDTH / 2)
      .attr('y', HEIGHT - 30)
      .attr('text-anchor', 'middle')
      .attr('font-size', '1.1rem');
  }
  label.text(`${result.label} (${result.score.toFixed(2)})`);
}
