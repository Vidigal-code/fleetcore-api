'use client';

import { ArrowRight } from 'lucide-react';

import { ROUTES } from '@/shared/constants/routes';
import { ActionLink } from '@/shared/ui/action-link';
import { PageSection, Surface, Stack } from '@/shared/ui/layout-primitives';

export const HomeCta = () => (
  <PageSection id="planos" width="xl" layout="stack" className="gap-8">
    <Surface
      tone="strong"
      elevation="floating"
      padding="lg"
      radius="xl"
      className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left lg:flex-row lg:items-center lg:justify-between"
    >
      <Stack gap="sm" className="items-center text-center sm:items-start sm:text-left">
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
          Pronto para acelerar sua operação
        </span>
        <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
          Centralize cadastros, auditorias e indicadores em uma única camada
        </h2>
        <p className="max-w-2xl text-sm text-muted sm:text-base">
          Monte fluxos de aprovação, conecte APIs REST e acompanhe cada alteração com logs assinados
          digitalmente.
        </p>
      </Stack>
      <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-end">
        <ActionLink href={ROUTES.register} variant="primary" fullWidthOnMobile>
          Criar conta agora
          <ArrowRight className="h-4 w-4" />
        </ActionLink>
        <ActionLink
          href={ROUTES.documentation}
          target="_blank"
          rel="noreferrer"
          variant="ghost"
          fullWidthOnMobile
        >
          Ver documentação
        </ActionLink>
      </div>
    </Surface>
  </PageSection>
);
