export type ThemeMode = 'light' | 'dark';

export interface ThemeOption {
  value: ThemeMode;
  label: string;
  description: string;
}

export const THEME_STORAGE_KEY = 'fleetcore.theme-preference';

export const THEME_MODES: ThemeMode[] = ['light', 'dark'];

export const themeOptions: ThemeOption[] = [
  {
    value: 'light',
    label: 'Claro',
    description: 'Amarelo claro, superfícies suaves e contraste quente.',
  },
  {
    value: 'dark',
    label: 'Escuro',
    description: 'Amarelo escuro, superfícies grafite e leitura confortável.',
  },
];

const START_THEME = (process.env.NEXT_PUBLIC_START_THEME ?? '').toLowerCase();

export const DEFAULT_THEME: ThemeMode = START_THEME === 'dark' ? 'dark' : 'light';

const isThemeMode = (value: unknown): value is ThemeMode =>
  value === 'light' || value === 'dark';

export const readStoredTheme = (): ThemeMode | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isThemeMode(stored) ? stored : null;
};

/**
 * Aplica o tema apenas alternando a classe (`light`/`dark`) e o `data-theme` no
 * elemento raiz. As cores de cada tema vivem exclusivamente no globals.css
 * (fonte unica de verdade), entao nao ha injecao de cor via JS — o que evita
 * duplicacao e o bug de `rgb(rgb(...))` que quebrava as cores em runtime.
 */
export const applyThemeClass = (mode: ThemeMode): void => {
  if (typeof document === 'undefined') {
    return;
  }
  const root = document.documentElement;
  THEME_MODES.forEach((value) => root.classList.remove(value));
  root.classList.add(mode);
  root.dataset.theme = mode;
};

/**
 * Script sincrono injetado antes da hidratacao para aplicar o tema salvo ainda
 * no primeiro paint, evitando o flash de tema incorreto (FOUC).
 */
export const buildThemeBootstrapScript = (): string =>
  `(function(){try{var k='${THEME_STORAGE_KEY}';var s=localStorage.getItem(k);` +
  `var t=(s==='light'||s==='dark')?s:'${DEFAULT_THEME}';var r=document.documentElement;` +
  `r.classList.remove('light','dark');r.classList.add(t);r.dataset.theme=t;}catch(e){}})();`;
