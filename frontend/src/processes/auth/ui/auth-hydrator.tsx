'use client';

import { useEffect } from 'react';

import { sessionStorage } from '@/shared/lib/token-storage';
import { useAppDispatch } from '@/processes/app/store/hooks';
import { authActions } from '@/processes/auth/model/auth-slice';
import { useAuthEvents } from '@/processes/auth/model/use-auth-events';

export const AuthHydrator = () => {
  const dispatch = useAppDispatch();

  useAuthEvents();

  useEffect(() => {
    const token = sessionStorage.getToken();
    const user = sessionStorage.getUser();
    dispatch(authActions.hydrate({ token, user }));
  }, [dispatch]);

  return null;
};
