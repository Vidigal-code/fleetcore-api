'use client';

import type { HTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';

type MessageVariant = 'success' | 'error' | 'info';

const baseClasses = 'rounded-2xl border px-4 py-3 text-sm font-medium shadow-sm backdrop-blur-xl';

const variantClassMap: Record<MessageVariant, string> = {
  success: 'border-emerald-400/50 bg-emerald-400/15 text-emerald-100',
  error: 'border-danger/40 bg-danger/20 text-danger',
  info: 'border-accent/40 bg-accent/15 text-accent-strong',
};

export interface InlineMessageProps extends HTMLAttributes<HTMLDivElement> {
  variant?: MessageVariant;
}

export const InlineMessage = ({ className, variant = 'info', ...props }: InlineMessageProps) => (
  <div className={cn(baseClasses, variantClassMap[variant], className)} {...props} />
);
