'use client';

import type { ReactNode } from 'react';
import { createContext, startTransition, useContext, useEffect, useMemo, useState } from 'react';

import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  type ThemeMode,
} from '@/shared/config/theme';
import { designTokens } from '@/shared/constants/theme-tokens';

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const readStoredTheme = (): ThemeMode | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return null;
};

const toCssVarName = (token: string) =>
  token.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

const applyThemeClass = (mode: ThemeMode) => {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(mode);
  root.dataset.theme = mode;

  const palette = designTokens.palette[mode];
  Object.entries(palette).forEach(([token, value]) => {
    root.style.setProperty(`--color-${toCssVarName(token)}`, value);
  });

  root.style.setProperty('--shadow-elevated', designTokens.shadow.elevated);
  root.style.setProperty('--shadow-floating', designTokens.shadow.floating);
  root.style.setProperty('--color-warning-foreground', palette.foreground);
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<ThemeMode>(DEFAULT_THEME);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initial = readStoredTheme() ?? DEFAULT_THEME;
    startTransition(() => {
      setThemeState(initial);
      setIsReady(true);
    });
    applyThemeClass(initial);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyThemeClass(theme);
  }, [theme, isReady]);

  const handleSetTheme = (mode: ThemeMode) => {
    startTransition(() => {
      setThemeState(mode);
    });
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme: handleSetTheme, toggleTheme, isReady }),
    [theme, isReady],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
};
