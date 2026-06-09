'use client';

import type { HTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';

type BadgeVariant = 'accent' | 'muted';
type BadgeSize = 'xs' | 'sm';

const baseClasses =
  'inline-flex items-center justify-center rounded-full border font-semibold uppercase tracking-[0.24em]';

const variantClassMap: Record<BadgeVariant, string> = {
  accent: 'border-accent/40 bg-accent/15 text-accent-strong',
  muted: 'border-border/50 bg-surface/60 text-muted',
};

const sizeClassMap: Record<BadgeSize, string> = {
  xs: 'px-3 py-1 text-[0.6rem]',
  sm: 'px-3.5 py-1.5 text-[0.7rem]',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

export const Badge = ({ className, variant = 'accent', size = 'sm', ...props }: BadgeProps) => (
  <span
    className={cn(baseClasses, variantClassMap[variant], sizeClassMap[size], className)}
    {...props}
  />
);
