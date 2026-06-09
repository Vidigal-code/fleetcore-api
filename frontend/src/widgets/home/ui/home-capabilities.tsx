'use client';

import { Activity, Database, ShieldCheck } from 'lucide-react';

import { PageSection, Surface, Stack } from '@/shared/ui/layout-primitives';

const capabilities = [
  {
    id: 'governanca',
    title: 'Governança operacional',
    description:
      'Políticas de acesso baseadas em papéis, auditoria de alterações e rastreabilidade ponta a ponta.',
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    id: 'dados',
    title: 'Dados em tempo real',
    description:
      'Cache inteligente com invalidação automática e consultas paginadas para grandes volumes.',
    icon: <Database className="h-5 w-5" />,
  },
  {
    id: 'observabilidade',
    title: 'Observabilidade ampliada',
    description:
      'Integrações com mensageria e métricas para detectar anomalias rapidamente em toda a frota.',
    icon: <Activity className="h-5 w-5" />,
  },
];

export const HomeCapabilities = () => (
  <PageSection width="xl" layout="stack" className="gap-8">
    <Stack gap="sm" className="items-center text-center lg:items-start lg:text-left">
      <h2 className="text-2xl font-semibold text-foreground">Uma plataforma orquestrada para frota</h2>
      <p className="max-w-3xl text-sm text-muted">
        Combine compliance, produtividade e inteligência operacional com componentes reutilizáveis em FSD
        e integrações simplificadas via API.
      </p>
    </Stack>
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {capabilities.map((capability) => (
        <Surface
          key={capability.id}
          tone="base"
          elevation="low"
          padding="md"
          radius="xl"
          className="flex h-full flex-col gap-4 text-center sm:text-left"
        >
          <div className="flex items-center justify-center gap-3 text-accent sm:justify-start">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/15">
              {capability.icon}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
              {capability.id}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">{capability.title}</h3>
          <p className="text-sm text-muted">{capability.description}</p>
        </Surface>
      ))}
    </div>
  </PageSection>
);
