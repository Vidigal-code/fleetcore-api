import type { Config } from 'tailwindcss';

const withOpacity = (variable: string) => ({
  opacityValue,
}: {
  opacityValue?: string;
}) => {
  if (opacityValue === undefined) {
    return `rgb(var(${variable}))`;
  }
  return `rgb(var(${variable}) / ${opacityValue})`;
};

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
        background: withOpacity('--color-background'),
        surface: withOpacity('--color-surface'),
        'surface-strong': withOpacity('--color-surface-strong'),
        border: withOpacity('--color-border'),
        foreground: withOpacity('--color-foreground'),
        muted: withOpacity('--color-foreground-muted'),
        accent: withOpacity('--color-accent'),
        'accent-strong': withOpacity('--color-accent-strong'),
        warning: withOpacity('--color-warning'),
        danger: withOpacity('--color-danger'),
      },
      boxShadow: {
        elevated: '0 25px 80px rgba(15, 23, 42, 0.2)',
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
