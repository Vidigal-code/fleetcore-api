import Link from 'next/link';
import type { Metadata } from 'next';

import { RecoverForm } from '@/features/auth/recover/ui/recover-form';
import { appConfig } from '@/shared/config/env';
import { ROUTES } from '@/shared/constants/routes';
import { RequireGuest } from '@/processes/auth/ui/require-guest';
import { AppShell } from '@/widgets/layout/app-shell';

export const metadata: Metadata = {
  title: `${appConfig.appName} · Recuperar senha`,
};

export default function RecoverPage() {
  return (
    <AppShell>
      <RequireGuest>
        <div className="flex w-full justify-center px-4 py-16 sm:px-6">
          <div className="grid w-full max-w-4xl gap-10 rounded-[2.5rem] border border-border/50 bg-surface/80 p-6 shadow-[var(--shadow-elevated)] backdrop-blur-xl md:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:p-12">
            <div className="flex flex-col gap-6 text-center md:text-left">
              <span className="mx-auto w-fit rounded-full border border-accent/40 bg-accent/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent md:mx-0">
                Fleetcore
              </span>
              <h1 className="text-3xl font-semibold leading-tight text-foreground md:text-4xl">
                Recuperação de credenciais administrativas
              </h1>
              <p className="text-sm text-muted md:text-base">
                Enviaremos um link seguro para redefinir a senha. O link expira em 30 minutos por questões de
                segurança.
              </p>
              <div className="mt-auto grid gap-3 text-xs uppercase tracking-[0.2em] text-muted">
                <span className="rounded-2xl border border-border/40 bg-background/70 px-4 py-3">
                  Proteção reforçada contra acesso indevido
                </span>
                <span className="rounded-2xl border border-border/40 bg-background/70 px-4 py-3">
                  Auditoria de todas as solicitações
                </span>
              </div>
              <div className="text-xs text-muted">
                Já lembrou a senha?{' '}
                <Link href={ROUTES.login} className="text-accent hover:text-accent-strong">
                  Voltar para login
                </Link>
              </div>
            </div>
            <RecoverForm />
          </div>
        </div>
      </RequireGuest>
    </AppShell>
  );
}
