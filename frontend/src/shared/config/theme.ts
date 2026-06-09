export type ThemeMode = 'light' | 'dark';

export interface ThemeOption {
  value: ThemeMode;
  label: string;
  description: string;
}

export const THEME_STORAGE_KEY = 'fleetcore.theme-preference';

export const themeOptions: ThemeOption[] = [
  {
    value: 'light',
    label: 'Claro',
    description: 'Laranja suave, superfícies claras e contraste quente.',
  },
  {
    value: 'dark',
    label: 'Escuro',
    description: 'Laranja profundo, superfícies âmbar e leitura confortável.',
  },
];

const START_THEME = (process.env.NEXT_PUBLIC_START_THEME ?? '').toLowerCase();

export const DEFAULT_THEME: ThemeMode = START_THEME === 'dark' ? 'dark' : 'light';
