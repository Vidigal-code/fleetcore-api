'use client';

import { useEffect } from 'react';

import { sessionStorage } from '@/shared/lib/token-storage';
import { useAppDispatch } from '@/processes/app/store/hooks';
import { authActions } from '@/processes/auth/model/auth-slice';

export const useAuthEvents = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleLogout = () => {
      sessionStorage.clearSession();
      dispatch(authActions.loggedOut());
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [dispatch]);
};
