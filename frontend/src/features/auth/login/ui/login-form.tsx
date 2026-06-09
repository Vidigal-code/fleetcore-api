'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { useAppSelector } from '@/processes/app/store/hooks';
import { selectAuthError, selectAuthStatus } from '@/processes/auth/model/auth-selectors';
import { Button } from '@/shared/ui/button';
import { InlineMessage } from '@/shared/ui/inline-message';
import { InputField } from '@/shared/ui/input-field';

import { loginSchema, type LoginFormValues } from '../model/login-schema';
import { useLoginMutation } from '../model/use-login';

export interface LoginFormProps {
  successMessage?: string | null;
}

export const LoginForm = ({ successMessage }: LoginFormProps) => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const loginMutation = useLoginMutation();
  const status = useAppSelector(selectAuthStatus);
  const errorMessage = useAppSelector(selectAuthError);

  useEffect(() => {
    if (status === 'authenticated') {
      form.reset();
    }
  }, [status, form]);

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="flex flex-col gap-6 rounded-[2rem] border border-border/50 bg-background/80 px-6 py-8 shadow-[var(--shadow-elevated)] backdrop-blur-xl sm:px-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-foreground">Acesso à Gestão de Frota</h1>
          <p className="text-sm text-muted">
            Use as credenciais do usuário administrador para gerenciar veículos, marcas e modelos.
          </p>
        </div>
      </div>
      <form className="grid grid-cols-1 gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        {successMessage ? (
          <InlineMessage className="text-sm" variant="success">
            {successMessage}
          </InlineMessage>
        ) : null}

        <InputField
          label="Usuário ou e-mail"
          placeholder="aivacol"
          autoComplete="username"
          {...form.register('identifier')}
          error={form.formState.errors.identifier?.message ?? null}
        />
        <InputField
          label="Senha"
          type="password"
          placeholder="********"
          autoComplete="current-password"
          {...form.register('password')}
          error={form.formState.errors.password?.message ?? null}
        />

        {errorMessage ? (
          <InlineMessage className="text-sm" variant="error">
            {errorMessage}
          </InlineMessage>
        ) : null}

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loginMutation.isPending}
          trailingIcon={<ArrowRight className="h-4 w-4" />}
          className="w-full"
        >
          Entrar
        </Button>
      </form>
    </div>
  );
};
