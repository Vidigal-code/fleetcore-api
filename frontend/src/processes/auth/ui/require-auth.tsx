'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppSelector } from '@/processes/app/store/hooks';
import {
  selectIsAuthenticated,
  selectIsHydrated,
  selectAuthStatus,
} from '@/processes/auth/model/auth-selectors';
import { Spinner } from '@/shared/ui/spinner';

interface RequireAuthProps {
  children: ReactNode;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const router = useRouter();
  const isHydrated = useAppSelector(selectIsHydrated);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const status = useAppSelector(selectAuthStatus);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated || status === 'authenticating') {
    return (
      <div
        className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center text-sm text-muted"
        role="status"
        aria-live="polite"
      >
        <Spinner className="h-6 w-6" />
        <span>Carregando sessão...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
