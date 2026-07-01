import * as d3 from 'd3';
import type { WordCount } from '../analysis/frequency';

const BAR_HEIGHT = 22;
const NARROW_WIDTH = 300;

// Bars are ink-blue; the single most frequent word gets the editor's red pen
// (docs/DESIGN.md, "The red pen") - the tool circles the word you lean on
// hardest. CSS variables keep both colors in step with the paper/night theme;
// the fallbacks are the paper values for environments without the stylesheet.
const BAR_FILL = 'var(--viz-bar, #33538c)';
const TOP_BAR_FILL = 'var(--viz-bar-top, #b0402f)';

/** Shrinks the label margin on narrow containers so bars keep usable width. */
function marginFor(width: number) {
  // The wide-layout margin fits "visualizations (12)"-length labels; the old
  // 90px clipped them to "…izations (1)".
  return { top: 8, right: 16, bottom: 8, left: width < NARROW_WIDTH ? 56 : 108 };
}

/** Formats a tooltip string with the exact count and share of total words. */
function tooltipText(d: WordCount, totalWords: number): string {
  const pct = totalWords > 0 ? ((d.count / totalWords) * 100).toFixed(1) : '0.0';
  return `${d.word}: ${d.count} (${pct}% of ${totalWords} words)`;
}

/**
 * Renders a horizontal bar chart of word counts, keyed by word so D3's
 * enter/update/exit joins animate bars into their new rank as text changes.
 * `totalWords` (all tokenized words, including stopwords) powers the
 * hover tooltip's percentage-of-total figure.
 */
export function renderFrequencyChart(svg: SVGSVGElement, data: WordCount[], totalWords = 0): void {
  const width = svg.clientWidth || 320;
  const MARGIN = marginFor(width);
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
    group = selection.append('g').attr('class', 'bars');
  }
  group.attr('transform', `translate(${MARGIN.left}, 0)`);

  const bars = group.selectAll<SVGRectElement, WordCount>('rect').data(data, (d) => d.word);

  bars
    .exit()
    .transition()
    .duration(200)
    .attr('width', 0)
    .remove();

  const barsEnter = bars
    .enter()
    .append('rect')
    .attr('x', 0)
    .attr('height', y.bandwidth())
    .attr('y', (d) => y(d.word) ?? 0)
    .attr('width', 0);
  barsEnter.append('title');

  const barsMerged = barsEnter.merge(bars);
  // Applied on every update, not just enter: the top word changes as you type,
  // and the red pen has to follow it.
  const topWord = data[0]?.word;
  barsMerged.attr('fill', (d) => (d.word === topWord ? TOP_BAR_FILL : BAR_FILL));
  barsMerged.select<SVGTitleElement>('title').text((d) => tooltipText(d, totalWords));

  barsMerged
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
