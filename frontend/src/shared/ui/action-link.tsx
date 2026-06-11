import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

import {
  type ButtonSize,
  type ButtonVariant,
  getButtonClassName,
} from '@/shared/ui/button-styles';

export interface ActionLinkProps extends Omit<ComponentProps<typeof Link>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidthOnMobile?: boolean;
  children: ReactNode;
}


export const ActionLink = ({
  variant = 'primary',
  size = 'md',
  fullWidthOnMobile = false,
  className,
  children,
  ...props
}: ActionLinkProps) => (
  <Link
    className={getButtonClassName({
      variant,
      size,
      className: fullWidthOnMobile ? `w-full sm:w-auto ${className ?? ''}` : className,
    })}
    {...props}
  >
    {children}
  </Link>
);
