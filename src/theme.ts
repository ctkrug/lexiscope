export type Theme = 'light' | 'dark';

/**
 * Resolves the theme to apply on load: an explicit stored preference wins,
 * otherwise fall back to the OS-level dark-mode preference.
 */
export function resolveInitialTheme(stored: string | null, prefersDark: boolean): Theme {
  if (stored === 'light' || stored === 'dark') return stored;
  return prefersDark ? 'dark' : 'light';
}

export function oppositeTheme(theme: Theme): Theme {
  return theme === 'dark' ? 'light' : 'dark';
}
