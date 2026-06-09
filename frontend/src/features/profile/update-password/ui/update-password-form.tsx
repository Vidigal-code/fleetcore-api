'use client';

import { useMemo } from 'react';
import { isAxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { InlineMessage } from '@/shared/ui/inline-message';
import { InputField } from '@/shared/ui/input-field';
import { Button } from '@/shared/ui/button';

import {
  updatePasswordSchema,
  type UpdatePasswordFormValues,
} from '../model/update-password-schema';
import { useUpdatePasswordMutation } from '../model/use-update-password';

export const UpdatePasswordForm = () => {
  const updatePassword = useUpdatePasswordMutation();

  const form = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const errorMessage = useMemo(() => {
    if (!updatePassword.error) return null;
    if (isAxiosError(updatePassword.error)) {
      const message = updatePassword.error.response?.data?.message;
      if (typeof message === 'string') return message;
      if (Array.isArray(message)) return message[0];
    }
    if (updatePassword.error instanceof Error) {
      return updatePassword.error.message;
    }
    return 'Não foi possível atualizar a senha.';
  }, [updatePassword.error]);

  const onSubmit = (values: UpdatePasswordFormValues) => {
    updatePassword.mutate({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    });
  };

  return (
    <form className="grid grid-cols-1 gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <InputField
        label="Senha atual"
        type="password"
        autoComplete="current-password"
        placeholder="Digite sua senha atual"
        {...form.register('oldPassword')}
        error={form.formState.errors.oldPassword?.message ?? null}
      />
      <InputField
        label="Nova senha"
        type="password"
        autoComplete="new-password"
        placeholder="Crie uma nova senha forte"
        {...form.register('newPassword')}
        error={form.formState.errors.newPassword?.message ?? null}
      />
      <InputField
        label="Confirmar nova senha"
        type="password"
        autoComplete="new-password"
        placeholder="Repita a nova senha"
        {...form.register('confirmPassword')}
        error={form.formState.errors.confirmPassword?.message ?? null}
      />

      {errorMessage ? (
        <InlineMessage className="text-sm" variant="error">
          {errorMessage}
        </InlineMessage>
      ) : null}

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-end">
        <Button type="submit" loading={updatePassword.isPending} variant="danger">
          Atualizar senha
        </Button>
      </div>
    </form>
  );
};
