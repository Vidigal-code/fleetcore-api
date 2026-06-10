type CssColor = `#${string}` | `rgb(${string})` | `hsl(${string})`;

export interface ThemePalette {
  background: CssColor;
  surface: CssColor;
  surfaceStrong: CssColor;
  border: CssColor;
  foreground: CssColor;
  foregroundMuted: CssColor;
  accent: CssColor;
  accentStrong: CssColor;
  warning: CssColor;
  danger: CssColor;
  positive: CssColor;
}

export interface DesignTokens {
  palette: Record<'light' | 'dark', ThemePalette>;
  typography: {
    fontSans: string;
    fontMono: string;
  };
  spacing: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number>;
  radius: Record<'sm' | 'md' | 'lg' | 'xl', string>;
  shadow: Record<'floating' | 'elevated', string>;
  layout: {
    container: number;
    sectionSpacing: number;
  };
}

export const designTokens: DesignTokens = {
  palette: {
    light: {
      background: 'rgb(248 247 239)',
      surface: 'rgb(255 252 242)',
      surfaceStrong: 'rgb(246 233 197)',
      border: 'rgb(214 188 126)',
      foreground: 'rgb(42 32 18)',
      foregroundMuted: 'rgb(122 97 50)',
      accent: 'rgb(229 166 19)',
      accentStrong: 'rgb(186 127 9)',
      warning: 'rgb(248 188 96)',
      danger: 'rgb(218 98 68)',
      positive: 'rgb(41 135 85)',
    },
    dark: {
      background: 'rgb(20 16 8)',
      surface: 'rgb(33 27 14)',
      surfaceStrong: 'rgb(54 39 17)',
      border: 'rgb(148 107 42)',
      foreground: 'rgb(249 239 219)',
      foregroundMuted: 'rgb(201 174 126)',
      accent: 'rgb(241 188 64)',
      accentStrong: 'rgb(255 213 102)',
      warning: 'rgb(252 201 112)',
      danger: 'rgb(234 122 90)',
      positive: 'rgb(80 178 122)',
    },
  },
  typography: {
    fontSans: 'var(--font-sans, "Manrope", system-ui, sans-serif)',
    fontMono: 'var(--font-mono, "Fira Code", ui-monospace, monospace)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '40px',
  },
  shadow: {
    floating: '0 18px 46px rgba(210, 182, 96, 0.16)',
    elevated: '0 28px 72px rgba(210, 182, 96, 0.18)',
  },
  layout: {
    container: 1200,
    sectionSpacing: 72,
  },
};

export type ThemeModeToken = keyof typeof designTokens.palette;
