'use client';

import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

export interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
}

export const SectionHeader = ({
  title,
  subtitle,
  actions,
  className,
  ...props
}: SectionHeaderProps) => (
  <div
    className={cn(
      'flex w-full max-w-5xl flex-col items-center gap-4 rounded-3xl bg-surface/60 px-6 py-5 text-center shadow-sm ring-1 ring-border/50 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:text-left',
      className,
    )}
    {...props}
  >
    <div className="max-w-3xl">
      <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
      {subtitle ? <p className="mt-2 text-sm text-muted">{subtitle}</p> : null}
    </div>
    {actions ? (
      <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
        {actions}
      </div>
    ) : null}
  </div>
);
