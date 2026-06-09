'use client';

import type { HTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';

export const Spinner = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'inline-flex h-5 w-5 animate-spin rounded-full border-2 border-border/40 border-t-accent',
      className,
    )}
    {...props}
  />
);
