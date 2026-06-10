'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import type { AuthUser } from '@/entities/user/model/types';
import { useAppDispatch } from '@/processes/app/store/hooks';
import { authActions } from '@/processes/auth/model/auth-slice';
import { httpClient } from '@/shared/api/http-client';
import { extractErrorMessage } from '@/shared/api/http-error';
import { ROUTES } from '@/shared/constants/routes';
import { sessionStorage } from '@/shared/lib/token-storage';

import type { LoginFormValues } from './login-schema';

interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
  user: AuthUser;
}

const loginRequest = async (payload: LoginFormValues): Promise<LoginResponse> => {
  try {
    const { data } = await httpClient.post<LoginResponse>('/auth/login', payload);
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const useLoginMutation = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: loginRequest,
    onMutate: () => {
      dispatch(authActions.loginRequested());
    },
    onSuccess: (response) => {
      sessionStorage.setSession(response.accessToken, response.user);
      dispatch(
        authActions.loginSucceeded({
          token: response.accessToken,
          user: response.user,
        }),
      );
      router.push(ROUTES.dashboard);
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : extractErrorMessage(error);
      dispatch(authActions.loginFailed(message));
    },
  });
};
