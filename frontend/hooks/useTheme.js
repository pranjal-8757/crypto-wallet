'use client';

import { useCallback, useEffect, useState } from 'react';

export const THEME_STORAGE_KEY = 'vault-theme';

/**
 * hooks/useTheme.js
 *
 * Manages the app-wide light/dark theme. Light is the default; dark
 * is opt-in and persisted to localStorage so the choice survives
 * reloads. Toggling just adds/removes a `dark` class on
 * `<html>` -- every color in app/globals.css is a CSS variable keyed
 * off that class, so no page reload and no per-component changes are
 * needed for the whole app to re-theme.
 *
 * A tiny inline script in app/layout.jsx applies the stored theme
 * before hydration to avoid a flash of the wrong theme; this hook
 * just keeps subsequent state (e.g. a toggle in the Navbar) in sync
 * with that.
 */
export function useTheme() {
  const [theme, setThemeState] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setThemeState(isDark ? 'dark' : 'light');
    setMounted(true);
  }, []);

  const setTheme = useCallback((next) => {
    setThemeState(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private browsing, disabled
      // storage) -- theme still applies for this session.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme, mounted };
}
