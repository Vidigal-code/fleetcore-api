'use client';

import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

type MessageVariant = 'success' | 'error' | 'info' | 'warning';

const baseClasses = 'rounded-2xl border px-4 py-3 text-sm font-medium shadow-sm backdrop-blur-xl';

const variantClassMap: Record<MessageVariant, string> = {
  success: 'border-emerald-400/50 bg-emerald-400/15 text-emerald-100',
  error: 'border-danger/40 bg-danger/20 text-danger',
  info: 'border-accent/40 bg-accent/15 text-accent-strong',
  warning: 'border-warning/40 bg-warning/15 text-warning-foreground',
};

export interface InlineMessageProps extends HTMLAttributes<HTMLDivElement> {
  variant?: MessageVariant;
  icon?: ReactNode;
}

export const InlineMessage = ({ className, variant = 'info', icon, children, ...props }: InlineMessageProps) => (
  <div className={cn(baseClasses, variantClassMap[variant], className)} {...props}>
    <div className="flex items-start gap-3">
      {icon ? <span className="flex h-5 w-5 items-center justify-center text-current">{icon}</span> : null}
      <span className="flex-1 leading-relaxed">{children}</span>
    </div>
  </div>
);
