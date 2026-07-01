import * as d3 from 'd3';
import { formatScore, type SentimentResult } from '../analysis/sentiment';
import { SENTIMENT_COLORS } from './sentimentColors';

const WIDTH = 240;
const HEIGHT = 130;
const RADIUS = 100;

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
    track = selection.append('path').attr('class', 'track').attr('transform', center).attr('fill', 'var(--viz-track, #eae1cf)');
    track.attr('d', arcGenerator(1));
  }

  // Normalize score from [-5, 5] to a [0, 1] fill fraction.
  const fraction = Math.min(1, Math.max(0, (result.score + 5) / 10));

  let fill = selection.select<SVGPathElement>('path.fill');
  if (fill.empty()) {
    fill = selection.append('path').attr('class', 'fill').attr('transform', center);
  }

  const previousFraction = Number(fill.attr('data-fraction') ?? 0);
  fill
    .attr('fill', SENTIMENT_COLORS[result.label])
    .attr('data-fraction', fraction)
    .transition()
    .duration(300)
    .attrTween('d', () => {
      const interpolate = d3.interpolateNumber(previousFraction, fraction);
      return (t: number) => arcGenerator(interpolate(t)) ?? '';
    });

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
  label.text(`${result.label} (${formatScore(result.score)})`);
}
