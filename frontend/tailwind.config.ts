import type { Config } from 'tailwindcss';

const withAlpha = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: '1.25rem',
          sm: '1.5rem',
          lg: '2rem',
          xl: '2.5rem',
        },
        screens: {
          '2xl': '1200px',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Manrope', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'Fira Code', 'monospace'],
      },
      colors: {
        background: withAlpha('--color-background'),
        surface: withAlpha('--color-surface'),
        'surface-strong': withAlpha('--color-surface-strong'),
        border: withAlpha('--color-border'),
        foreground: withAlpha('--color-foreground'),
        muted: withAlpha('--color-foreground-muted'),
        accent: withAlpha('--color-accent'),
        'accent-strong': withAlpha('--color-accent-strong'),
        'accent-soft': withAlpha('--color-accent-soft'),
        'accent-foreground': withAlpha('--color-accent-foreground'),
        contrast: withAlpha('--color-contrast'),
        'contrast-foreground': withAlpha('--color-contrast-foreground'),
        warning: withAlpha('--color-warning'),
        danger: withAlpha('--color-danger'),
        positive: withAlpha('--color-positive'),
      },
      boxShadow: {
        elevated: 'var(--shadow-elevated)',
        floating: 'var(--shadow-floating)',
        cta: 'var(--shadow-cta)',
        input: 'var(--shadow-input)',
        'input-hover': 'var(--shadow-input-hover)',
      },
      borderRadius: {
        xl: '1.5rem',
        lg: '1rem',
        md: '0.875rem',
        sm: '0.625rem',
      },
      transitionTimingFunction: {
        subtle: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      },
      transitionDuration: {
        base: '200ms',
      },
    },
  },
  plugins: [],
};

export default config;
