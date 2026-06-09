'use client';

import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/processes/app/providers/theme-provider';
import { Button } from '@/shared/ui/button';

export const ThemeToggle = () => {
  const { theme, toggleTheme, isReady } = useTheme();

  if (!isReady) {
    return null;
  }

  const isDark = theme === 'dark';

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      icon={isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      className="gap-2 rounded-full border border-border/50 bg-surface/60 px-3 py-1.5 text-foreground hover:border-accent/60 hover:bg-accent/10"
    >
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted sm:inline">
        {isDark ? 'Claro' : 'Escuro'}
      </span>
    </Button>
  );
};
