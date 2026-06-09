'use client';

import { forwardRef, SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

export interface SelectOption<TValue extends string | number = string> {
  value: TValue;
  label: string;
}

const baseSelectClasses =
  'w-full appearance-none rounded-[1.75rem] border border-border/50 bg-surface/80 px-5 py-3.5 text-sm text-foreground shadow-[0_14px_38px_rgba(15,23,42,0.12)] backdrop-blur focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-background transition-all duration-base ease-subtle hover:border-accent/40 hover:shadow-[0_18px_46px_rgba(15,23,42,0.16)]';

export interface SelectFieldProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  options: SelectOption[];
  error?: string | null;
  hint?: string;
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ className, label, options, error, hint, placeholder, id, ...props }, ref) => {
    const selectId = id ?? props.name;
    return (
      <label
        className={cn('flex flex-col items-center gap-3 text-center sm:items-start sm:text-left', className)}
        htmlFor={selectId}
      >
        {label ? (
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
            {label}
          </span>
        ) : null}
        <div className="relative w-full">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              baseSelectClasses,
              'pr-12',
              error && 'border-danger/60 focus:border-danger/70 focus:ring-danger/30',
            )}
            {...props}
          >
            {placeholder ? (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            ) : null}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        </div>
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

SelectField.displayName = 'SelectField';
