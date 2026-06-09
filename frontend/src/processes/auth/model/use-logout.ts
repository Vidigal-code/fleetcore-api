'use client';

import { useCallback } from 'react';

import { sessionStorage } from '@/shared/lib/token-storage';
import { useAppDispatch } from '@/processes/app/store/hooks';
import { authActions } from '@/processes/auth/model/auth-slice';

export const useLogout = () => {
  const dispatch = useAppDispatch();

  return useCallback(() => {
    sessionStorage.clearSession();
    dispatch(authActions.loggedOut());
  }, [dispatch]);
};
