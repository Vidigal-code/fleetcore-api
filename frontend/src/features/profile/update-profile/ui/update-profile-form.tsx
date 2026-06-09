'use client';

import { useEffect, useMemo } from 'react';
import { isAxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useAppSelector } from '@/processes/app/store/hooks';
import { selectCurrentUser } from '@/processes/auth/model/auth-selectors';
import { InlineMessage } from '@/shared/ui/inline-message';
import { InputField } from '@/shared/ui/input-field';
import { Button } from '@/shared/ui/button';

import { updateProfileSchema, type UpdateProfileFormValues } from '../model/update-profile-schema';
import { useUpdateProfileMutation } from '../model/use-update-profile';

export const UpdateProfileForm = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const updateProfile = useUpdateProfileMutation();

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: currentUser?.name ?? '',
      nickname: currentUser?.nickname ?? '',
      email: currentUser?.email ?? '',
    },
  });

  useEffect(() => {
    if (!currentUser) return;
    form.reset({
      name: currentUser.name,
      nickname: currentUser.nickname,
      email: currentUser.email,
    });
  }, [currentUser, form]);

  const errorMessage = useMemo(() => {
    if (!updateProfile.error) return null;
    if (isAxiosError(updateProfile.error)) {
      const message = updateProfile.error.response?.data?.message;
      if (typeof message === 'string') return message;
      if (Array.isArray(message)) return message[0];
    }
    if (updateProfile.error instanceof Error) {
      return updateProfile.error.message;
    }
    return 'Não foi possível atualizar o perfil.';
  }, [updateProfile.error]);

  const onSubmit = (values: UpdateProfileFormValues) => {
    updateProfile.mutate({
      name: values.name,
      nickname: values.nickname,
      email: values.email || undefined,
    });
  };

  return (
    <form className="grid grid-cols-1 gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <InputField
        label="Nome completo"
        placeholder="Taylor Fleet"
        autoComplete="name"
        {...form.register('name')}
        error={form.formState.errors.name?.message ?? null}
      />
      <InputField
        label="Apelido"
        placeholder="fleet-admin"
        autoComplete="username"
        {...form.register('nickname')}
        error={form.formState.errors.nickname?.message ?? null}
      />
      <InputField
        label="E-mail (opcional)"
        placeholder="admin@fleetcore.io"
        autoComplete="email"
        {...form.register('email')}
        error={form.formState.errors.email?.message ?? null}
        hint="Usado para notificações e recuperação."
      />

      {updateProfile.isSuccess ? (
        <InlineMessage className="text-sm" variant="success">
          Perfil atualizado com sucesso.
        </InlineMessage>
      ) : null}
      {errorMessage ? (
        <InlineMessage className="text-sm" variant="error">
          {errorMessage}
        </InlineMessage>
      ) : null}

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-end">
        <Button type="submit" loading={updateProfile.isPending}>
          Salvar alterações
        </Button>
      </div>
    </form>
  );
};
