'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';
import {
  FIELD_BASE_CLASSES,
  FIELD_ERROR_CLASSES,
  FIELD_LABEL_TEXT_CLASSES,
  FIELD_LABEL_WRAPPER_CLASSES,
} from '@/shared/ui/field-styles';

const baseInputClasses = cn(FIELD_BASE_CLASSES, 'placeholder:text-muted');

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string | null;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <label className={cn(FIELD_LABEL_WRAPPER_CLASSES, className)} htmlFor={inputId}>
        {label ? <span className={FIELD_LABEL_TEXT_CLASSES}>{label}</span> : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(baseInputClasses, error && FIELD_ERROR_CLASSES)}
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
