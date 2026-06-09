'use client';

import { useMemo } from 'react';
import { CalendarCheck, Pencil, Trash2 } from 'lucide-react';

import type { Brand } from '@/entities/brand/model/types';
import type { Model } from '@/entities/model/model/types';
import type { Vehicle } from '@/entities/vehicle/model/types';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import { DataTable, type TableColumn } from '@/shared/ui/table';
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

  const columns: TableColumn<VehicleTableRow>[] = [
    {
      key: 'licensePlate',
      header: 'Placa',
      render: (row) => <Badge>{row.licensePlate}</Badge>,
    },
    {
      key: 'modelName',
      header: 'Modelo',
      render: (row) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-foreground">{row.modelName}</span>
          <span className="text-xs uppercase tracking-[0.16em] text-muted">{row.brandName}</span>
        </div>
      ),
    },
    {
      key: 'year',
      header: 'Ano',
      render: (row) => row.year,
      width: '90px',
    },
    {
      key: 'chassis',
      header: 'Chassis',
      render: (row) => <span className="font-mono text-xs text-muted">{row.chassis}</span>,
    },
    {
      key: 'renavam',
      header: 'Renavam',
      render: (row) => <span className="font-mono text-xs text-muted">{row.renavam}</span>,
    },
    {
      key: 'updatedAt',
      header: 'Atualizado',
      render: (row) => (
        <div className="flex flex-col gap-1 text-xs text-muted">
          <span>{row.updatedAt}</span>
          <span>por {row.createdBy}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (row) => (
        <div className="flex items-center justify-center gap-2 sm:justify-start">
          <Button type="button" size="sm" variant="ghost" onClick={() => onEdit(row.raw)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="danger"
            onClick={() => onDelete(row.raw)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      width: '120px',
    },
  ];

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
      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <DataTable
            data={tableData}
            columns={columns}
            loading={loading}
            emptyState="Nenhum veículo encontrado com estes filtros."
          />
        </div>
      </div>
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
