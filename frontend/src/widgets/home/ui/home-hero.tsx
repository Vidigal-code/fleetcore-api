'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

import { PageSection, Surface, Stack } from '@/shared/ui/layout-primitives';

const primaryActionClasses =
  'inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-transparent bg-accent px-6 text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-background shadow-lg shadow-accent/25 transition-all duration-base ease-subtle hover:bg-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 sm:w-auto';

const secondaryActionClasses =
  'inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border/60 bg-surface/90 px-6 text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-foreground transition-all duration-base ease-subtle hover:border-accent/50 hover:bg-accent/15 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 sm:w-auto';

export const HomeHero = () => (
  <PageSection width="xl" layout="stack" align="center" className="gap-10">
    <Surface
      tone="base"
      elevation="floating"
      padding="lg"
      radius="xl"
      className="flex flex-col items-center gap-6 text-center lg:flex-row lg:items-start lg:text-left"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
        <Sparkles className="h-5 w-5" />
      </div>
      <Stack gap="lg" className="w-full">
        <Stack gap="sm" className="items-center text-center lg:items-start lg:text-left">
          <span className="rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Fleetcore Enterprise Suite
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Operações de frota com orquestração de dados e auditoria contínua
          </h1>
          <p className="max-w-2xl text-base text-muted sm:text-lg">
            Conecte veículos, modelos e marcas em um ecossistema modular, preparado para integrações,
            mensageria em tempo real e governança de segurança.
          </p>
        </Stack>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-start">
          <Link href="/login" className={primaryActionClasses}>
            Acessar painel
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/register" className={secondaryActionClasses}>
            Criar conta admin
          </Link>
        </div>
      </Stack>
    </Surface>
  </PageSection>
);
