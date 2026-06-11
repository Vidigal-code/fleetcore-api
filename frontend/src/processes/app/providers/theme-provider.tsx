'use client';

import type { ReactNode } from 'react';
import { createContext, startTransition, useContext, useEffect, useMemo, useState } from 'react';

import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  applyThemeClass,
  readStoredTheme,
  type ThemeMode,
} from '@/shared/config/theme';

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const persistTheme = (mode: ThemeMode) => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(THEME_STORAGE_KEY, mode);
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<ThemeMode>(DEFAULT_THEME);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initial = readStoredTheme() ?? DEFAULT_THEME;
    applyThemeClass(initial);
    startTransition(() => {
      setThemeState(initial);
      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    persistTheme(theme);
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
