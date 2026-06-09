'use client';

import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { Stack, Surface } from '@/shared/ui/layout-primitives';

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
  <Surface
    align="center"
    elevation="low"
    padding="md"
    glass="base"
    radius="lg"
    width="full"
    className={cn(
      'flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between',
      className,
    )}
    {...props}
  >
    <Stack gap="sm" className="max-w-3xl">
      <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
      {subtitle ? <p className="text-sm text-muted">{subtitle}</p> : null}
    </Stack>
    {actions ? (
      <div className="flex flex-wrap items-center justify-center gap-3 md:justify-end">
        {actions}
      </div>
    ) : null}
  </Surface>
);
