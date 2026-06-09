'use client';

import { useMutation } from '@tanstack/react-query';

import { useAppDispatch, useAppSelector } from '@/processes/app/store/hooks';
import { authActions } from '@/processes/auth/model/auth-slice';
import { authClient, type UpdateProfileInput } from '@/shared/api/auth-client';
import { sessionStorage } from '@/shared/lib/token-storage';

export const useUpdateProfileMutation = () => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => authClient.updateProfile(input),
    onSuccess: (user) => {
      if (accessToken) {
        sessionStorage.setSession(accessToken, user);
      }
      dispatch(authActions.profileUpdated(user));
    },
  });
};
