'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'md' | 'sm';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
  loading?: boolean;
}

const baseButtonClasses =
  'inline-flex items-center justify-center gap-2 rounded-full border font-semibold transition-all duration-base ease-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60';

const variantClassMap: Record<ButtonVariant, string> = {
  primary:
    'border-transparent bg-accent text-background shadow-lg shadow-accent/25 hover:bg-accent-strong',
  secondary:
    'border-border/60 bg-surface/90 text-foreground hover:border-accent/50 hover:bg-accent/15 hover:text-accent',
  ghost:
    'border-border/40 bg-transparent text-muted hover:border-accent/60 hover:bg-accent/10 hover:text-accent',
  danger: 'border-danger/60 bg-danger/10 text-danger hover:bg-danger/15',
};

const sizeClassMap: Record<ButtonSize, string> = {
  md: 'h-11 px-6 text-[0.8rem] uppercase tracking-[0.18em] md:text-sm',
  sm: 'h-9 px-4 text-[0.7rem] uppercase tracking-[0.18em] md:text-xs',
};

export const Button = ({
  className,
  children,
  variant = 'primary',
  size = 'md',
  icon,
  trailingIcon,
  loading = false,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(baseButtonClasses, variantClassMap[variant], sizeClassMap[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {icon ? <span className="flex items-center justify-center">{icon}</span> : null}
      <span className="leading-none">{loading ? 'Processando...' : children}</span>
      {trailingIcon ? <span className="flex items-center justify-center">{trailingIcon}</span> : null}
    </button>
  );
};
