'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

import {
  type ButtonSize,
  type ButtonVariant,
  getButtonClassName,
} from '@/shared/ui/button-styles';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
  loading?: boolean;
}

export const Button = ({
  className,
  children,
  variant = 'primary',
  size = 'md',
  icon,
  trailingIcon,
  loading = false,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={getButtonClassName({ variant, size, className })}
      disabled={disabled || loading}
      {...props}
    >
      {icon ? <span className="flex items-center justify-center">{icon}</span> : null}
      <span className="leading-none">{loading ? 'Processando...' : children}</span>
      {trailingIcon ? <span className="flex items-center justify-center">{trailingIcon}</span> : null}
    </button>
  );
};
