'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';

const baseInputClasses =
  'w-full rounded-[1.75rem] border border-border/50 bg-surface/80 px-5 py-3.5 text-sm text-foreground shadow-[0_14px_38px_rgba(15,23,42,0.12)] backdrop-blur focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-background placeholder:text-muted transition-all duration-base ease-subtle hover:border-accent/40 hover:shadow-[0_18px_46px_rgba(15,23,42,0.16)]';

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string | null;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <label
        className={cn('flex flex-col items-center gap-3 text-center sm:items-start sm:text-left', className)}
        htmlFor={inputId}
      >
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
