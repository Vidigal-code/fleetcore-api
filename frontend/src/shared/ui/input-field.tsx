'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';

const baseInputClasses =
  'w-full rounded-2xl border border-border/60 bg-surface/70 px-4 py-3 text-sm text-foreground placeholder:text-muted transition duration-base ease-subtle focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/40';

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string | null;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <label className={cn('flex flex-col gap-2', className)} htmlFor={inputId}>
        {label ? (
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
            {label}
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(baseInputClasses, error && 'border-danger/60 focus:border-danger/70 focus:ring-danger/30')}
          {...props}
        />
        {error ? (
          <span className="text-xs font-semibold text-danger" role="alert">
            {error}
          </span>
        ) : hint ? (
          <span className="text-xs text-muted">{hint}</span>
        ) : null}
      </label>
    );
  },
);

InputField.displayName = 'InputField';
