import { describe, expect, it } from 'vitest';
import {
  parseThemePreference,
  readThemePreference,
  resolveTheme,
  THEME_STORAGE_KEY,
} from './theme';

describe('theme', () => {
  it('resolves explicit preferences before the system preference', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('resolves system mode from prefers-color-scheme', () => {
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
  });

  it('falls back to system for missing or invalid persisted values', () => {
    expect(parseThemePreference(null)).toBe('system');
    expect(parseThemePreference('sepia')).toBe('system');
    expect(parseThemePreference('dark')).toBe('dark');
  });

  it('reads the namespaced preference and tolerates unavailable storage', () => {
    expect(
      readThemePreference({
        getItem: (key) => (key === THEME_STORAGE_KEY ? 'light' : null),
      }),
    ).toBe('light');
    expect(
      readThemePreference({
        getItem: () => {
          throw new Error('blocked');
        },
      }),
    ).toBe('system');
    expect(readThemePreference(null)).toBe('system');
  });
});
