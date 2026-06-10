'use client';

import type { HTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';

export interface RoleBadgesProps extends HTMLAttributes<HTMLDivElement> {
  roles: string[];
}

export const RoleBadges = ({ roles, className, ...props }: RoleBadgesProps) => {
  if (roles.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)} {...props}>
      {roles.map((role) => (
        <Badge key={role} variant="accent" size="xs">
          {role}
        </Badge>
      ))}
    </div>
  );
};
