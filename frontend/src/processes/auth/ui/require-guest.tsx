'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppSelector } from '@/processes/app/store/hooks';
import {
  selectAuthStatus,
  selectIsAuthenticated,
  selectIsHydrated,
} from '@/processes/auth/model/auth-selectors';
import { Spinner } from '@/shared/ui/spinner';

interface RequireGuestProps {
  children: ReactNode;
}

export const RequireGuest = ({ children }: RequireGuestProps) => {
  const router = useRouter();
  const isHydrated = useAppSelector(selectIsHydrated);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const status = useAppSelector(selectAuthStatus);

  useEffect(() => {
    if (!isHydrated) return;
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated || status === 'authenticating') {
    return (
      <div
        className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-sm text-muted"
        role="status"
        aria-live="polite"
      >
        <Spinner className="h-6 w-6" />
        <span>Validando sessão...</span>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
