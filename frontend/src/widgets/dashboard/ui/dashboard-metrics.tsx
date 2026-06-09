'use client';

import { useMemo, type ReactNode } from 'react';
import { TrendingUp, Truck, Warehouse } from 'lucide-react';

import { useBrandsQuery } from '@/entities/brand/api/brand-api';
import { useModelsQuery } from '@/entities/model/api/model-api';
import { useVehiclesQuery } from '@/entities/vehicle/api/vehicle-api';
import { PageSection, Surface } from '@/shared/ui/layout-primitives';

interface MetricCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  description: string;
}

const MetricCard = ({ label, value, icon, description }: MetricCardProps) => (
  <Surface
    tone="base"
    elevation="floating"
    padding="md"
    radius="xl"
    glass="base"
    className="flex flex-col gap-4 text-center md:text-left"
  >
    <div className="flex items-center justify-center gap-3 text-accent md:justify-start">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15">
        {icon}
      </span>
      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
        {label}
      </span>
    </div>
    <div className="space-y-2">
      <span className="text-3xl font-semibold text-foreground">{value}</span>
      <p className="text-sm text-muted">{description}</p>
    </div>
  </Surface>
);

export const DashboardMetrics = () => {
  const vehiclesQuery = useVehiclesQuery({ page: 1, limit: 1 });
  const brandsQuery = useBrandsQuery();
  const modelsQuery = useModelsQuery();

  const metrics = useMemo(() => {
    const vehiclesTotal = vehiclesQuery.data?.total ?? 0;
    const brandsTotal = brandsQuery.data?.length ?? 0;
    const modelsTotal = modelsQuery.data?.length ?? 0;

    return [
      {
        label: 'Veículos',
        value: vehiclesTotal.toString().padStart(2, '0'),
        icon: <Truck className="h-5 w-5" />, 
        description: 'Itens cadastrados com telemetria unificada.',
      },
      {
        label: 'Modelos',
        value: modelsTotal.toString().padStart(2, '0'),
        icon: <TrendingUp className="h-5 w-5" />,
        description: 'Categorias homologadas e versionadas.',
      },
      {
        label: 'Marcas',
        value: brandsTotal.toString().padStart(2, '0'),
        icon: <Warehouse className="h-5 w-5" />,
        description: 'Fornecedores com contratos ativos.',
      },
    ];
  }, [vehiclesQuery.data?.total, brandsQuery.data, modelsQuery.data]);

  return (
    <PageSection width="xl" layout="grid" split="even">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} {...metric} />
      ))}
    </PageSection>
  );
};
