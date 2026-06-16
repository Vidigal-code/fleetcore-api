'use client';

import { useMemo, type ReactNode } from 'react';
import { CalendarCheck, Pencil, Trash2 } from 'lucide-react';

import type { Brand } from '@/entities/brand/model/types';
import type { Model } from '@/entities/model/model/types';
import type { Vehicle } from '@/entities/vehicle/model/types';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import { Surface } from '@/shared/ui/layout-primitives';
import { Pagination } from '@/shared/ui/pagination';

interface VehicleTableRow {
  id: string;
  licensePlate: string;
  chassis: string;
  renavam: string;
  year: number;
  modelName: string;
  brandName: string;
  updatedAt: string;
  createdBy: string;
  raw: Vehicle;
}

export interface VehicleTableProps {
  vehicles: Vehicle[];
  brands: Brand[];
  models: Model[];
  loading?: boolean;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  className?: string;
}

const formatTimestamp = (value: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));

interface RowActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}

const RowActions = ({ onEdit, onDelete, className }: RowActionsProps) => (
  <div className={cn('flex items-center justify-center gap-2 sm:justify-start', className)}>
    <Button type="button" size="sm" variant="ghost" aria-label="Editar veículo" onClick={onEdit}>
      <Pencil className="h-4 w-4" />
    </Button>
    <Button type="button" size="sm" variant="danger" aria-label="Remover veículo" onClick={onDelete}>
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);

const CardField = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="min-w-0 space-y-1">
    <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted">{label}</dt>
    <dd className="text-sm text-foreground break-words">{children}</dd>
  </div>
);

interface VehicleCardProps {
  row: VehicleTableRow;
  onEdit: () => void;
  onDelete: () => void;
}

const VehicleCard = ({ row, onEdit, onDelete }: VehicleCardProps) => (
  <Surface
    tone="strong"
    elevation="low"
    padding="sm"
    radius="lg"
    glass="base"
    className="w-full space-y-4 overflow-hidden text-left"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 space-y-1">
        <Badge>{row.licensePlate}</Badge>
        <p className="text-base font-semibold text-foreground break-words">{row.modelName}</p>
        <p className="text-xs uppercase tracking-[0.16em] text-muted break-words">{row.brandName}</p>
      </div>
      <RowActions className="shrink-0 sm:justify-end" onEdit={onEdit} onDelete={onDelete} />
    </div>
    <dl className="grid grid-cols-2 gap-3">
      <CardField label="Ano">{row.year}</CardField>
      <CardField label="Atualizado">
        <span className="block">{row.updatedAt}</span>
        <span className="block text-xs text-muted">por {row.createdBy}</span>
      </CardField>
      <div className="col-span-2">
        <CardField label="Chassis">
          <span className="font-mono text-xs text-muted break-all">{row.chassis}</span>
        </CardField>
      </div>
      <div className="col-span-2">
        <CardField label="Renavam">
          <span className="font-mono text-xs text-muted break-all">{row.renavam}</span>
        </CardField>
      </div>
    </dl>
  </Surface>
);

export const VehicleTable = ({
  vehicles,
  brands,
  models,
  loading = false,
  page,
  limit,
  total,
  onPageChange,
  onEdit,
  onDelete,
  className,
}: VehicleTableProps) => {
  const brandMap = useMemo(() => new Map(brands.map((brand) => [brand.id, brand])), [brands]);
  const modelMap = useMemo(() => new Map(models.map((model) => [model.id, model])), [models]);

  const tableData = useMemo<VehicleTableRow[]>(
    () =>
      vehicles.map((vehicle) => {
        const model = modelMap.get(vehicle.modelId);
        const brand = model?.brandId ? brandMap.get(model.brandId) : undefined;
        return {
          id: vehicle.id,
          licensePlate: vehicle.licensePlate,
          chassis: vehicle.chassis,
          renavam: vehicle.renavam,
          year: vehicle.year,
          modelName: model?.name ?? '—',
          brandName: brand?.name ?? '—',
          updatedAt: formatTimestamp(vehicle.updatedAt),
          createdBy: vehicle.createdBy,
          raw: vehicle,
        };
      }),
    [vehicles, modelMap, brandMap],
  );

  return (
    <div className={cn('w-full space-y-6 text-center sm:text-left', className)}>
      <div className="flex flex-col gap-4 border-b border-border/30 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">Veículos cadastrados</h2>
          <p className="text-sm text-muted sm:text-base">
            Monitoramento em tempo real da frota com cache em Redis.
          </p>
        </div>
        <div className="mx-auto flex items-center gap-2 rounded-full border border-border/40 bg-background/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted sm:mx-0">
          <CalendarCheck className="h-4 w-4" />
          {total} registro(s)
        </div>
      </div>
      {/* Cartões empilhados, centralizados e 100% responsivos em qualquer tela. */}
      {loading ? (
        <div className="mx-auto w-full max-w-xl rounded-3xl border border-border/50 bg-surface/60 px-6 py-10 text-center text-sm text-muted backdrop-blur-xl">
          Carregando...
        </div>
      ) : tableData.length === 0 ? (
        <div className="mx-auto w-full max-w-xl rounded-3xl border border-border/50 bg-surface/60 px-6 py-10 text-center text-sm text-muted backdrop-blur-xl">
          Nenhum veículo encontrado com estes filtros.
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
          {tableData.map((row) => (
            <VehicleCard
              key={row.id}
              row={row}
              onEdit={() => onEdit(row.raw)}
              onDelete={() => onDelete(row.raw)}
            />
          ))}
        </div>
      )}

      <Pagination
        className="mx-auto max-w-md"
        page={page}
        total={total}
        limit={limit}
        onPageChange={onPageChange}
      />
    </div>
  );
};
