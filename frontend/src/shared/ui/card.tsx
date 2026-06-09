'use client';

import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  footer?: ReactNode;
}

export const Card = ({ className, header, footer, children, ...props }: CardProps) => (
  <div
    className={cn(
      'surface-glass rounded-3xl border border-border/50 shadow-[var(--shadow-elevated)] transition-all duration-base ease-subtle hover:border-accent/40 hover:shadow-xl',
      className,
    )}
    {...props}
  >
    {header ? (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-surface-strong/80 px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.18em] text-muted sm:flex-row sm:justify-between sm:text-left">
        {header}
      </div>
    ) : null}
    <div className={cn('flex flex-col gap-6', header ? 'px-6 pt-6 pb-6' : 'p-6')}>{children}</div>
    {footer ? (
      <div className="mt-4 flex flex-col items-center justify-center gap-3 px-6 pb-6 text-center text-xs uppercase tracking-[0.18em] text-muted sm:flex-row sm:justify-between sm:text-left">
        {footer}
      </div>
    ) : null}
  </div>
);
