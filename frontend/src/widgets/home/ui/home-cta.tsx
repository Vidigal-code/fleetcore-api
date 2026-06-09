'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { PageSection, Surface, Stack } from '@/shared/ui/layout-primitives';

const primaryActionClasses =
  'inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-transparent bg-accent px-6 text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-background shadow-lg shadow-accent/25 transition-all duration-base ease-subtle hover:bg-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 sm:w-auto';

const ghostActionClasses =
  'inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border/40 bg-transparent px-6 text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-muted transition-all duration-base ease-subtle hover:border-accent/60 hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 sm:w-auto';

export const HomeCta = () => (
  <PageSection width="xl" layout="stack" className="gap-8">
    <Surface
      tone="strong"
      elevation="floating"
      padding="lg"
      radius="xl"
      className="flex flex-col items-center gap-6 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left"
    >
      <Stack gap="sm" className="items-center text-center lg:items-start lg:text-left">
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
          Pronto para acelerar sua operação
        </span>
        <h2 className="text-2xl font-semibold text-foreground lg:text-3xl">
          Centralize cadastros, auditorias e indicadores em uma única camada
        </h2>
        <p className="max-w-2xl text-sm text-muted">
          Monte fluxos de aprovação, conecte APIs REST e acompanhe cada alteração com logs assinados
          digitalmente.
        </p>
      </Stack>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Link href="/register" className={primaryActionClasses}>
          Criar conta agora
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="https://vidigal-code.github.io/fleetcore-api/docs/"
          target="_blank"
          rel="noreferrer"
          className={ghostActionClasses}
        >
          Ver documentação
        </Link>
      </div>
    </Surface>
  </PageSection>
);
