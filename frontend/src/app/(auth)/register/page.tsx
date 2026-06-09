import type { Metadata } from 'next';

import { RegisterForm } from '@/features/auth/register/ui/register-form';
import { RequireGuest } from '@/processes/auth/ui/require-guest';
import { appConfig } from '@/shared/config/env';

export const metadata: Metadata = {
  title: `${appConfig.appName} · Criar conta`,
};

export default function RegisterPage() {
  return (
    <RequireGuest>
      <div className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
        <div className="grid w-full max-w-5xl gap-10 rounded-[2.75rem] border border-border/50 bg-surface/85 p-8 shadow-[var(--shadow-elevated)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:p-12">
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <span className="mx-auto w-fit rounded-full border border-accent/40 bg-accent/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent lg:mx-0">
              Fleetcore Platform
            </span>
            <h1 className="text-3xl font-semibold leading-tight text-foreground lg:text-4xl">
              Eleve o controle da frota com governança centralizada
            </h1>
            <p className="text-sm text-muted lg:text-base">
              Monte cadastros consistentes, defina hierarquias e acompanhe auditorias com uma camada de
              segurança pensada para operações corporativas.
            </p>
            <div className="mt-auto grid gap-3 text-xs uppercase tracking-[0.2em] text-muted sm:grid-cols-2">
              <span className="rounded-2xl border border-border/40 bg-background/70 px-4 py-3">
                Privilégios administrativos automáticos
              </span>
              <span className="rounded-2xl border border-border/40 bg-background/70 px-4 py-3">
                Audit trail e mensageria integrada
              </span>
            </div>
          </div>
          <RegisterForm />
        </div>
      </div>
    </RequireGuest>
  );
}
