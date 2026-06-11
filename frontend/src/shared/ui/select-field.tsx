'use client';

import { forwardRef, SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import {
  FIELD_BASE_CLASSES,
  FIELD_ERROR_CLASSES,
  FIELD_LABEL_TEXT_CLASSES,
  FIELD_LABEL_WRAPPER_CLASSES,
} from '@/shared/ui/field-styles';

export interface SelectOption<TValue extends string | number = string> {
  value: TValue;
  label: string;
}

const baseSelectClasses = cn(FIELD_BASE_CLASSES, 'appearance-none');

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
      <label className={cn(FIELD_LABEL_WRAPPER_CLASSES, className)} htmlFor={selectId}>
        {label ? <span className={FIELD_LABEL_TEXT_CLASSES}>{label}</span> : null}
        <div className="relative w-full">
          <select
            ref={ref}
            id={selectId}
            className={cn(baseSelectClasses, 'pr-12', error && FIELD_ERROR_CLASSES)}
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
