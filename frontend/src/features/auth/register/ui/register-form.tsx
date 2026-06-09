'use client';

import { useMemo } from 'react';
import { isAxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { InlineMessage } from '@/shared/ui/inline-message';
import { InputField } from '@/shared/ui/input-field';
import { Button } from '@/shared/ui/button';

import { registerSchema, type RegisterFormValues } from '../model/register-schema';
import { useRegisterMutation } from '../model/use-register';

export const RegisterForm = () => {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nickname: '',
      name: '',
      email: '',
      password: '',
    },
  });

  const registerMutation = useRegisterMutation();

  const errorMessage = useMemo(() => {
    if (!registerMutation.error) return null;
    if (isAxiosError(registerMutation.error)) {
      const message = registerMutation.error.response?.data?.message;
      if (typeof message === 'string') return message;
      if (Array.isArray(message)) return message[0];
    }
    if (registerMutation.error instanceof Error) {
      return registerMutation.error.message;
    }
    return 'Falha ao realizar cadastro. Tente novamente.';
  }, [registerMutation.error]);

  const onSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate(values);
  };

  return (
    <div className="flex flex-col gap-6 rounded-[2rem] border border-border/60 bg-background/80 px-6 py-8 shadow-[var(--shadow-elevated)] backdrop-blur-xl sm:px-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
          <UserPlus className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-foreground">Criar acesso administrativo</h1>
          <p className="text-sm text-muted">
            Cadastre-se para receber privilégios de administrador e controlar veículos, modelos e marcas
            em ambiente seguro.
          </p>
        </div>
      </div>
      <form className="grid grid-cols-1 gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <InputField
          label="Apelido"
          placeholder="fleetcore-admin"
          autoComplete="username"
          {...form.register('nickname')}
          error={form.formState.errors.nickname?.message ?? null}
        />
        <InputField
          label="Nome completo"
          placeholder="Taylor Fleet"
          autoComplete="name"
          {...form.register('name')}
          error={form.formState.errors.name?.message ?? null}
        />
        <InputField
          label="E-mail corporativo"
          placeholder="admin@fleetcore.io"
          autoComplete="email"
          {...form.register('email')}
          error={form.formState.errors.email?.message ?? null}
        />
        <InputField
          label="Senha forte"
          type="password"
          placeholder="Crie uma senha com 12 caracteres"
          autoComplete="new-password"
          {...form.register('password')}
          error={form.formState.errors.password?.message ?? null}
        />

        <div className="flex items-start gap-3 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-xs text-accent">
          <ShieldCheck className="mt-0.5 h-4 w-4" />
          <p>
            O primeiro acesso após o cadastro já garante privilégios administrativos. Proteja sua senha e
            atualize-a com frequência.
          </p>
        </div>

        {errorMessage ? (
          <InlineMessage className="text-sm" variant="error">
            {errorMessage}
          </InlineMessage>
        ) : null}

        <Button type="submit" loading={registerMutation.isPending}>
          Concluir cadastro
        </Button>
      </form>
    </div>
  );
};
