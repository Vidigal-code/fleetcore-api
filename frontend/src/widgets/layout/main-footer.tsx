'use client';

import Link from 'next/link';

import { footerGroups } from '@/entities/navigation/model/navigation';
import { appConfig } from '@/shared/config/env';

export const MainFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-surface/70 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-6xl grid gap-12 px-4 py-12 text-center sm:px-6 md:grid-cols-[1.2fr_1fr] md:text-left lg:px-8 xl:px-12">
        <div className="mx-auto max-w-xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            {appConfig.appName}
          </p>
          <h2 className="text-2xl font-semibold text-foreground">
            Operação inteligente para frotas com auditoria, mensageria e dashboards em tempo real.
          </h2>
          <p className="text-sm text-muted">
            Cache distribuído, monitoramento ativo e auditoria persistente garantem rastreabilidade e
            confiabilidade ponta a ponta.
          </p>
        </div>

        <div className="grid gap-8 place-items-center sm:grid-cols-2">
          {footerGroups.map((group) => (
            <div key={group.id} className="w-full max-w-xs space-y-3 text-center sm:text-left">
              <h3 className="text-xs font-bold uppercase tracking-[0.32em] text-muted">
                {group.label}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noreferrer' : undefined}
                      className="inline-flex w-full items-center justify-center rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent sm:justify-start"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border/40 bg-background/70">
        <div className="mx-auto w-full max-w-6xl flex flex-col items-center gap-2 px-4 py-6 text-center text-xs uppercase tracking-[0.24em] text-muted sm:flex-row sm:items-center sm:justify-between sm:text-left sm:px-6 lg:px-8 xl:px-12">
          <span className="whitespace-pre-line">
            © {currentYear} {appConfig.appName}. Todos os direitos reservados.
          </span>
          <span className="text-[0.65rem]">Versão frontend · Next.js · React Query · Redux Toolkit</span>
        </div>
      </div>
    </footer>
  );
};
