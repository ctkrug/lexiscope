import * as d3 from 'd3';
import type { ReadabilityResult } from '../analysis/readability';

const WIDTH = 240;
const BAR_HEIGHT = 18;
const ROW_GAP = 34;

interface Metric {
  key: string;
  label: string;
  value: number;
  domain: [number, number];
  /** Which end of the domain reads as "easy" for this metric. */
  easyEnd: 'high' | 'low';
}

function metricsFor(result: ReadabilityResult): Metric[] {
  return [
    { key: 'ease', label: 'Reading ease', value: result.fleschReadingEase, domain: [0, 100], easyEnd: 'high' },
    { key: 'grade', label: 'Grade level', value: result.fleschKincaidGrade, domain: [0, 18], easyEnd: 'low' },
  ];
}

// Same paper-and-ink family as SENTIMENT_COLORS (docs/DESIGN.md).
const BAND_COLORS = { easy: '#4f9257', medium: '#d9a13f', hard: '#c14e3d' } as const;

/** Colors a meter fill by how "easy" its value reads within its domain. */
function bandColor(metric: Metric): string {
  const [min, max] = metric.domain;
  const clamped = Math.min(max, Math.max(min, metric.value));
  const fraction = (clamped - min) / (max - min);
  const ease = metric.easyEnd === 'high' ? fraction : 1 - fraction;

  if (ease >= 0.66) return BAND_COLORS.easy;
  if (ease >= 0.33) return BAND_COLORS.medium;
  return BAND_COLORS.hard;
}

/** Renders small horizontal meters for Flesch reading ease and grade level. */
export function renderReadabilityPanel(svg: SVGSVGElement, result: ReadabilityResult): void {
  const metrics = metricsFor(result);
  const height = metrics.length * ROW_GAP + 10;
  const selection = d3.select(svg).attr('width', WIDTH).attr('height', height);

  const rows = selection.selectAll<SVGGElement, Metric>('g.metric').data(metrics, (d) => d.key);

  const entered = rows
    .enter()
    .append('g')
    .attr('class', 'metric')
    .attr('transform', (_d, i) => `translate(0, ${i * ROW_GAP})`);

  entered.append('text').attr('class', 'metric-label').attr('y', 12).attr('font-size', '0.8rem');
  entered.append('rect').attr('class', 'metric-track').attr('y', 16).attr('height', BAR_HEIGHT).attr('width', WIDTH).attr('fill', 'var(--viz-track, #eae1cf)');
  entered.append('rect').attr('class', 'metric-fill').attr('y', 16).attr('height', BAR_HEIGHT);
  entered.append('text').attr('class', 'metric-value').attr('y', 16 + BAR_HEIGHT - 4).attr('x', 6).attr('font-size', '0.75rem').attr('fill', '#fff');

  const merged = entered.merge(rows);

  merged.select<SVGTextElement>('text.metric-label').text((d) => d.label);
  merged
    .select<SVGTextElement>('text.metric-value')
    .text((d) => d.value.toFixed(1));

  merged
    .select<SVGRectElement>('rect.metric-fill')
    .attr('fill', (d) => bandColor(d))
    .transition()
    .duration(250)
    .attr('width', (d) => {
      const [min, max] = d.domain;
      const clamped = Math.min(max, Math.max(min, d.value));
      return (WIDTH * (clamped - min)) / (max - min);
    });
}
