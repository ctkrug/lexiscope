import { describe, expect, it } from 'vitest';
import { oppositeTheme, resolveInitialTheme } from '../src/theme';

describe('resolveInitialTheme', () => {
  it('prefers a stored theme over the OS preference', () => {
    expect(resolveInitialTheme('light', true)).toBe('light');
    expect(resolveInitialTheme('dark', false)).toBe('dark');
  });

  it('falls back to the OS preference when nothing is stored', () => {
    expect(resolveInitialTheme(null, true)).toBe('dark');
    expect(resolveInitialTheme(null, false)).toBe('light');
  });

  it('ignores an invalid stored value', () => {
    expect(resolveInitialTheme('sepia', true)).toBe('dark');
  });
});

describe('oppositeTheme', () => {
  it('flips light and dark', () => {
    expect(oppositeTheme('light')).toBe('dark');
    expect(oppositeTheme('dark')).toBe('light');
  });
});
