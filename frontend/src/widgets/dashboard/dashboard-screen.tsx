'use client';

import { VehicleWorkbench } from '@/widgets/fleet/vehicle-workbench';
import { ReferenceDataBoard } from '@/widgets/fleet/reference-data-board';
import { AppShell } from '@/widgets/layout/app-shell';
import { SectionHeader } from '@/shared/ui/section-header';
import { Badge } from '@/shared/ui/badge';

export const DashboardScreen = () => (
  <AppShell>
    <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]" id="dashboard">
      <SectionHeader
        className="col-span-full lg:col-span-1"
        title="Comando operacional da frota"
        subtitle={
          <span>
            Monitore veículos, mantenha modelos atualizados e sincronize cadastros com total
            rastreabilidade.
          </span>
        }
        actions={<Badge variant="accent">Atualização em cache inteligente</Badge>}
      />
      <div className="flex flex-col gap-4 rounded-3xl border border-border/50 bg-surface/70 px-6 py-6 shadow-[var(--shadow-elevated)] backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
          Boas práticas
        </p>
        <h2 className="text-2xl font-semibold text-foreground">
          Arquitetura FSD com React Query, Redux Toolkit e Axios prontos para escala.
        </h2>
        <p className="text-sm text-muted">
          Utilize a camada de entidades para acesso aos dados, componha features reutilizáveis e
          orquestre widgets responsivos com adaptação automática para o menu mobile.
        </p>
      </div>
    </section>

    <VehicleWorkbench />
    <ReferenceDataBoard />
  </AppShell>
);
