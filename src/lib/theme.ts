import { useCallback, useEffect, useMemo, useState } from 'react';

export const THEME_STORAGE_KEY = 'agent-cli-guide:theme';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = Exclude<ThemePreference, 'system'>;

export function parseThemePreference(value: string | null): ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system' ? value : 'system';
}

export function readThemePreference(storage?: Pick<Storage, 'getItem'> | null): ThemePreference {
  if (!storage) return 'system';
  try {
    return parseThemePreference(storage.getItem(THEME_STORAGE_KEY));
  } catch {
    return 'system';
  }
}

export function resolveTheme(preference: ThemePreference, systemDark: boolean): ResolvedTheme {
  return preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;
}

function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyTheme(theme: ResolvedTheme, preference: ThemePreference): void {
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.themePreference = preference;
  document.documentElement.style.colorScheme = theme;
}

export function useTheme() {
  const [preference, setPreferenceState] = useState<ThemePreference>(() =>
    readThemePreference(window.localStorage),
  );
  const [systemDark, setSystemDark] = useState(systemPrefersDark);
  const resolvedTheme = useMemo(
    () => resolveTheme(preference, systemDark),
    [preference, systemDark],
  );

  useEffect(() => {
    applyTheme(resolvedTheme, preference);
  }, [preference, resolvedTheme]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      setPreferenceState(parseThemePreference(event.newValue));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Theme switching still works when storage is unavailable.
    }
  }, []);

  return { preference, resolvedTheme, setPreference };
}
