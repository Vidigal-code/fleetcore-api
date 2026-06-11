import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

export type CtaLinkSize = 'sm' | 'md';

const CTA_BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-full border border-accent/40 bg-accent font-semibold uppercase text-accent-foreground shadow-cta transition-all duration-base ease-subtle hover:-translate-y-0.5 hover:bg-accent-strong hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2';

const CTA_SIZE_CLASS_MAP: Record<CtaLinkSize, string> = {
  sm: 'px-4 py-2 text-[0.7rem] tracking-[0.24em]',
  md: 'px-6 py-3 text-xs tracking-[0.24em]',
};

export interface CtaLinkProps extends Omit<ComponentProps<typeof Link>, 'children'> {
  size?: CtaLinkSize;
  children: ReactNode;
}

export const CtaLink = ({ size = 'md', className, children, ...props }: CtaLinkProps) => (
  <Link className={cn(CTA_BASE_CLASSES, CTA_SIZE_CLASS_MAP[size], className)} {...props}>
    {children}
  </Link>
);
