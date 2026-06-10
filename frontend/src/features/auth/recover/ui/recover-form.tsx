'use client';

import { CheckCircle2, Mail, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/shared/ui/button';
import { InlineMessage } from '@/shared/ui/inline-message';
import { InputField } from '@/shared/ui/input-field';

import { recoverSchema, type RecoverFormValues } from '../model/recover-schema';
import { useRecoverPasswordMutation } from '../model/use-recover';

export const RecoverForm = () => {
  const form = useForm<RecoverFormValues>({
    resolver: zodResolver(recoverSchema),
    defaultValues: { email: '' },
  });

  const mutation = useRecoverPasswordMutation();

  const onSubmit = (values: RecoverFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  const isSuccess = mutation.status === 'success';

  return (
    <div className="flex flex-col gap-6 rounded-[2rem] border border-border/50 bg-background/80 px-6 py-8 shadow-[var(--shadow-elevated)] backdrop-blur-xl sm:px-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
          <Mail className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-foreground">Recuperar acesso</h1>
          <p className="text-sm text-muted">
            Informe o e-mail corporativo para receber um link seguro de redefinição de senha.
          </p>
        </div>
      </div>
      <form className="grid grid-cols-1 gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        {isSuccess ? (
          <InlineMessage className="text-sm" variant="success" icon={<CheckCircle2 className="h-4 w-4" />}>
            Tudo certo! Enviamos instruções para redefinir a senha. Verifique sua caixa de entrada.
          </InlineMessage>
        ) : null}

        <InputField
          label="E-mail corporativo"
          placeholder="admin@fleetcore.com"
          type="email"
          autoComplete="email"
          {...form.register('email')}
          error={form.formState.errors.email?.message ?? null}
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={mutation.isPending}
          trailingIcon={<Send className="h-4 w-4" />}
          className="w-full"
        >
          Enviar instruções
        </Button>
      </form>
    </div>
  );
};
