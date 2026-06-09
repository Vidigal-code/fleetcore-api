import Link from 'next/link';
import type { Metadata } from 'next';

import { LoginForm } from '@/features/auth/login/ui/login-form';
import { appConfig } from '@/shared/config/env';
import { RequireGuest } from '@/processes/auth/ui/require-guest';
import { AppShell } from '@/widgets/layout/app-shell';

export const metadata: Metadata = {
  title: `${appConfig.appName} · Entrar`,
};

interface LoginPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const resolveParam = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const registered = resolveParam(searchParams?.registered);
  const passwordReset = resolveParam(searchParams?.passwordReset);

  const successMessage = passwordReset === '1'
    ? 'Senha atualizada com sucesso. Entre novamente para continuar.'
    : registered === '1'
      ? 'Cadastro realizado com sucesso. Entre com suas credenciais administrativas.'
      : null;

  return (
    <AppShell>
      <RequireGuest>
        <div className="flex w-full justify-center px-4 py-16 sm:px-6">
          <div className="grid w-full max-w-5xl gap-10 rounded-[2.5rem] border border-border/50 bg-surface/80 p-6 shadow-[var(--shadow-elevated)] backdrop-blur-xl md:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:p-12">
            <div className="flex flex-col gap-6 text-center md:text-left">
              <span className="mx-auto w-fit rounded-full border border-accent/40 bg-accent/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent md:mx-0">
                Fleetcore
              </span>
              <h1 className="text-3xl font-semibold leading-tight text-foreground md:text-4xl">
                Gestão de Frota com inteligência operacional
              </h1>
              <p className="text-sm text-muted md:text-base">
                Administre veículos, modelos e marcas com cache em tempo real, auditoria centralizada e
                mensageria integrada.
              </p>
              <div className="mt-auto grid gap-3 text-xs uppercase tracking-[0.2em] text-muted sm:grid-cols-2">
                <span className="rounded-2xl border border-border/40 bg-background/70 px-4 py-3">
                  FSD modularizado
                </span>
                <span className="rounded-2xl border border-border/40 bg-background/70 px-4 py-3">
                  React Query + Redux Toolkit
                </span>
              </div>
              <div className="text-xs text-muted">
                Ainda não possui credenciais?{' '}
                <Link href="/register" className="text-accent hover:text-accent-strong">
                  Criar conta agora
                </Link>
              </div>
            </div>
            <LoginForm successMessage={successMessage} />
          </div>
        </div>
      </RequireGuest>
    </AppShell>
  );
}
