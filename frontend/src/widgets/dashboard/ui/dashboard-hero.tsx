'use client';

import { Badge } from '@/shared/ui/badge';
import { PageSection, Stack, Surface } from '@/shared/ui/layout-primitives';
import { SectionHeader } from '@/shared/ui/section-header';

export const DashboardHero = () => (
  <PageSection id="dashboard" width="xl" layout="grid" align="center">
    <SectionHeader
      className="col-span-full lg:col-span-1"
      title="Comando operacional da frota"
      subtitle="Monitore veículos, mantenha modelos atualizados e sincronize cadastros com total rastreabilidade."
      actions={<Badge variant="accent">Atualização em cache inteligente</Badge>}
    />
    <Surface
      width="full"
      radius="xl"
      className="col-span-full text-center lg:col-span-1 lg:text-left"
    >
      <Stack gap="sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
          Boas práticas
        </p>
        <h2 className="text-2xl font-semibold text-foreground">
          Arquitetura FSD com React Query, Redux Toolkit e Axios prontos para escala.
        </h2>
        <p className="text-sm text-muted">
          Utilize a camada de entidades para acesso aos dados, componha features reutilizáveis e
          orquestre widgets responsivos com adaptação automática para o menu mobile.
        </p>
      </Stack>
    </Surface>
  </PageSection>
);
