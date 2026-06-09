'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import { useAppDispatch } from '@/processes/app/store/hooks';
import { authActions } from '@/processes/auth/model/auth-slice';
import { authClient, type UpdatePasswordInput } from '@/shared/api/auth-client';
import { sessionStorage } from '@/shared/lib/token-storage';

export const useUpdatePasswordMutation = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: UpdatePasswordInput) => authClient.updatePassword(input),
    onSuccess: () => {
      sessionStorage.clearSession();
      dispatch(authActions.loggedOut());
      router.push('/login?passwordReset=1');
    },
  });
};
