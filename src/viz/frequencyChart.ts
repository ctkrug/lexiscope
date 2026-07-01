import * as d3 from 'd3';
import type { WordCount } from '../analysis/frequency';

const MARGIN = { top: 8, right: 16, bottom: 8, left: 90 };
const BAR_HEIGHT = 22;

/**
 * Renders a horizontal bar chart of word counts, keyed by word so D3's
 * enter/update/exit joins animate bars into their new rank as text changes.
 */
export function renderFrequencyChart(svg: SVGSVGElement, data: WordCount[]): void {
  const width = svg.clientWidth || 320;
  const height = Math.max(data.length, 1) * BAR_HEIGHT + MARGIN.top + MARGIN.bottom;

  const selection = d3.select(svg).attr('width', width).attr('height', height);

  const maxCount = d3.max(data, (d) => d.count) ?? 1;
  const x = d3.scaleLinear().domain([0, maxCount]).range([0, width - MARGIN.left - MARGIN.right]);
  const y = d3
    .scaleBand()
    .domain(data.map((d) => d.word))
    .range([MARGIN.top, height - MARGIN.bottom])
    .padding(0.2);

  let group = selection.select<SVGGElement>('g.bars');
  if (group.empty()) {
    group = selection.append('g').attr('class', 'bars').attr('transform', `translate(${MARGIN.left}, 0)`);
  }

  const bars = group.selectAll<SVGRectElement, WordCount>('rect').data(data, (d) => d.word);

  bars
    .exit()
    .transition()
    .duration(200)
    .attr('width', 0)
    .remove();

  bars
    .enter()
    .append('rect')
    .attr('x', 0)
    .attr('height', y.bandwidth())
    .attr('fill', '#4f8ef7')
    .attr('y', (d) => y(d.word) ?? 0)
    .attr('width', 0)
    .merge(bars)
    .transition()
    .duration(250)
    .attr('y', (d) => y(d.word) ?? 0)
    .attr('height', y.bandwidth())
    .attr('width', (d) => x(d.count));

  const labels = group.selectAll<SVGTextElement, WordCount>('text').data(data, (d) => d.word);

  labels.exit().remove();

  labels
    .enter()
    .append('text')
    .attr('x', -6)
    .attr('text-anchor', 'end')
    .attr('dominant-baseline', 'middle')
    .merge(labels)
    .transition()
    .duration(250)
    .attr('y', (d) => (y(d.word) ?? 0) + y.bandwidth() / 2)
    .text((d) => `${d.word} (${d.count})`);
}
