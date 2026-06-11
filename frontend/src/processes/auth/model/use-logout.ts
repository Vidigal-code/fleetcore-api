'use client';

import { useCallback } from 'react';

import { sessionStorage } from '@/shared/lib/token-storage';
import { useAppDispatch } from '@/processes/app/store/hooks';
import { authActions } from '@/processes/auth/model/auth-slice';
import { authClient } from '@/shared/api/auth-client';

export const useLogout = () => {
  const dispatch = useAppDispatch();

  return useCallback(async () => {
    try {
      await authClient.logout();
    } catch {
    } finally {
      sessionStorage.clearSession();
      dispatch(authActions.loggedOut());
    }
  }, [dispatch]);
};
