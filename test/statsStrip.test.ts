import { describe, expect, it } from 'vitest';
import { renderStatsStrip } from '../src/viz/statsStrip';

describe('renderStatsStrip', () => {
  it('renders word count, sentence count, and reading time', () => {
    const container = document.createElement('div');
    renderStatsStrip(container, { wordCount: 400, sentenceCount: 12 });

    const values = [...container.querySelectorAll('.stat-value')].map((el) => el.textContent);
    expect(values).toEqual(['400', '12', '2 min']);
  });

  it('shows a placeholder reading time for empty text', () => {
    const container = document.createElement('div');
    renderStatsStrip(container, { wordCount: 0, sentenceCount: 0 });

    const values = [...container.querySelectorAll('.stat-value')].map((el) => el.textContent);
    expect(values).toEqual(['0', '0', '—']);
  });

  it('replaces previous content on re-render instead of appending', () => {
    const container = document.createElement('div');
    renderStatsStrip(container, { wordCount: 10, sentenceCount: 1 });
    renderStatsStrip(container, { wordCount: 20, sentenceCount: 2 });

    expect(container.querySelectorAll('.stat')).toHaveLength(3);
  });
});
