import * as d3 from 'd3';
import type { SentenceSentiment } from '../analysis/sentiment';
import { SENTIMENT_COLORS } from './sentimentColors';

const HEIGHT = 36;
const GAP = 2;
const MAX_SCORE = 5;

/** Truncates a sentence for the tooltip so a long paragraph doesn't produce a giant title. */
function tooltipText(d: SentenceSentiment): string {
  const preview = d.sentence.length > 80 ? `${d.sentence.slice(0, 77)}...` : d.sentence;
  return `${preview}\n${d.label} (${d.score.toFixed(2)})`;
}

/**
 * Renders one segment per sentence, colored by sentiment label and sized by
 * confidence (|score| / max), so tone shifts across a paragraph are visible
 * at a glance. Keyed by index since sentence text may repeat.
 */
export function renderSentenceSentimentStrip(svg: SVGSVGElement, sentences: SentenceSentiment[]): void {
  const width = svg.clientWidth || 320;
  const selection = d3.select(svg).attr('width', width).attr('height', HEIGHT);

  const count = Math.max(sentences.length, 1);
  const segmentWidth = (width - GAP * (count - 1)) / count;

  const segments = selection
    .selectAll<SVGRectElement, SentenceSentiment>('rect.segment')
    .data(sentences, (_d, i) => i);

  segments.exit().remove();

  const entered = segments
    .enter()
    .append('rect')
    .attr('class', 'segment')
    .attr('y', 0)
    .attr('height', HEIGHT);
  entered.append('title');

  const merged = entered.merge(segments);
  merged
    .attr('x', (_d, i) => i * (segmentWidth + GAP))
    .attr('width', segmentWidth)
    .attr('rx', 3)
    .attr('fill', (d) => SENTIMENT_COLORS[d.label])
    .attr('fill-opacity', (d) => 0.35 + 0.65 * Math.min(1, Math.abs(d.score) / MAX_SCORE));

  merged.select<SVGTitleElement>('title').text((d) => tooltipText(d));
}
