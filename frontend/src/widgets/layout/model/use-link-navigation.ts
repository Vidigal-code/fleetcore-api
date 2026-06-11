'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import type { NavigationLink } from '@/entities/navigation/model/navigation';

export type NavigateLinkHandler = (link: NavigationLink) => void;

export const useLinkNavigation = (onAfterNavigate?: () => void): NavigateLinkHandler => {
  const router = useRouter();

  return useCallback(
    (link: NavigationLink) => {
      if (link.external) {
        window.open(link.href, '_blank', 'noopener,noreferrer');
      } else {
        router.push(link.href);
      }
      onAfterNavigate?.();
    },
    [router, onAfterNavigate],
  );
};
