'use client';

import { useMutation } from '@tanstack/react-query';

import type { RecoverFormValues } from './recover-schema';

const simulateRecoverRequest = async ({ email }: RecoverFormValues) => {
  await new Promise((resolve) => {
    setTimeout(resolve, 700);
  });

  return {
    email,
    requestedAt: new Date().toISOString(),
  } as const;
};

export const useRecoverPasswordMutation = () =>
  useMutation({
    mutationFn: simulateRecoverRequest,
  });
