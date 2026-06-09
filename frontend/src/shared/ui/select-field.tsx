'use client';

import { forwardRef, SelectHTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';

export interface SelectOption<TValue extends string | number = string> {
  value: TValue;
  label: string;
}

const baseSelectClasses =
  'w-full appearance-none rounded-2xl border border-border/60 bg-surface/70 px-4 py-3 text-sm text-foreground transition duration-base ease-subtle focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/40';

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
      <label className={cn('flex flex-col gap-2', className)} htmlFor={selectId}>
        {label ? (
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
            {label}
          </span>
        ) : null}
        <select
          ref={ref}
          id={selectId}
          className={cn(baseSelectClasses, error && 'border-danger/60 focus:border-danger/70 focus:ring-danger/30')}
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
