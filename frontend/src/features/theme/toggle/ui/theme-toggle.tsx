'use client';

import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/processes/app/providers/theme-provider';

export const ThemeToggle = () => {
  const { theme, toggleTheme, isReady } = useTheme();

  if (!isReady) {
    return null;
  }

  const isDark = theme === 'dark';
  const label = isDark ? 'Ativar modo claro' : 'Ativar modo escuro';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/50 bg-surface/60 text-foreground shadow-sm transition-colors duration-base ease-subtle hover:border-accent/60 hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};
