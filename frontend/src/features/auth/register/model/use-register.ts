'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import { authClient, type RegisterInput } from '@/shared/api/auth-client';

export const useRegisterMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (input: RegisterInput) => authClient.register(input),
    onSuccess: () => {
      router.push('/login?registered=1');
    },
  });
};
