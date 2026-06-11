'use client';

import { ArrowRight, Sparkles } from 'lucide-react';

import { ROUTES } from '@/shared/constants/routes';
import { ActionLink } from '@/shared/ui/action-link';
import { PageSection, Surface, Stack } from '@/shared/ui/layout-primitives';

export const HomeHero = () => (
  <PageSection id="inicio" width="xl" layout="stack" align="center" className="gap-10">
    <Surface
      tone="base"
      elevation="floating"
      padding="lg"
      radius="xl"
      className="flex flex-col items-center gap-6 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left"
    >
      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-3xl bg-accent/15 text-accent">
        <Sparkles className="h-7 w-7" />
      </div>
      <Stack gap="lg" className="w-full max-w-3xl">
        <Stack gap="sm" className="items-center text-center lg:items-start lg:text-left">
          <span className="rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Fleetcore Enterprise Suite
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Operações de frota com orquestração de dados e auditoria contínua
          </h1>
          <p className="max-w-3xl text-base text-muted sm:text-lg">
            Conecte veículos, modelos e marcas em um ecossistema modular, preparado para integrações,
            mensageria em tempo real e governança de segurança.
          </p>
        </Stack>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-start">
          <ActionLink href={ROUTES.login} variant="primary" fullWidthOnMobile>
            Acessar painel
            <ArrowRight className="h-4 w-4" />
          </ActionLink>
          <ActionLink href={ROUTES.register} variant="secondary" fullWidthOnMobile>
            Criar conta admin
          </ActionLink>
        </div>
      </Stack>
    </Surface>
  </PageSection>
);
