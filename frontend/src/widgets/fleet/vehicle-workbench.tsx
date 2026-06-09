'use client';

import { startTransition, useEffect, useState } from 'react';

import { useBrandsQuery } from '@/entities/brand/api/brand-api';
import { useModelsQuery } from '@/entities/model/api/model-api';
import {
  useCreateVehicleMutation,
  useDeleteVehicleMutation,
  useUpdateVehicleMutation,
  useVehiclesQuery,
} from '@/entities/vehicle/api/vehicle-api';
import type { Vehicle, VehicleFilters } from '@/entities/vehicle/model/types';
import { VehicleForm } from '@/features/vehicles/manage/ui/vehicle-form';
import { VehicleFilterBar } from '@/features/vehicles/filter/ui/vehicle-filter-bar';
import { VehicleTable } from '@/entities/vehicle/ui/vehicle-table';
import type { VehicleFormValues } from '@/features/vehicles/manage/model/vehicle-schema';

const DEFAULT_FILTERS: VehicleFilters = {
  page: 1,
  limit: 10,
};

export const VehicleWorkbench = () => {
  const [filters, setFilters] = useState<VehicleFilters>(DEFAULT_FILTERS);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const vehiclesQuery = useVehiclesQuery(filters);
  const brandsQuery = useBrandsQuery();
  const modelsQuery = useModelsQuery();

  const createVehicle = useCreateVehicleMutation();
  const updateVehicle = useUpdateVehicleMutation();
  const deleteVehicle = useDeleteVehicleMutation();

  useEffect(() => {
    startTransition(() => {
      setFormError(null);
      setFormSuccess(null);
    });
  }, [editingVehicle]);

  const handleCreate = async (payload: VehicleFormValues) => {
    try {
      setFormError(null);
      await createVehicle.mutateAsync(payload);
      setFormSuccess('Veículo registrado com sucesso.');
      setFilters((prev) => ({ ...prev, page: 1 }));
    } catch (error) {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : 'Falha ao registrar veículo.');
    }
  };

  const handleUpdate = async (payload: VehicleFormValues) => {
    if (!editingVehicle) return;
    try {
      setFormError(null);
      await updateVehicle.mutateAsync({ id: editingVehicle.id, input: payload });
      setFormSuccess('Veículo atualizado com sucesso.');
      setEditingVehicle(null);
    } catch (error) {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : 'Falha ao atualizar o veículo.');
    }
  };

  const handleDelete = async (vehicle: Vehicle) => {
    const confirmation = window.confirm(
      `Remover definitivamente o veículo ${vehicle.licensePlate}? Essa ação não pode ser desfeita.`,
    );
    if (!confirmation) return;
    try {
      setFormError(null);
      await deleteVehicle.mutateAsync(vehicle.id);
      setFormSuccess(`Veículo ${vehicle.licensePlate} removido.`);
      if (editingVehicle?.id === vehicle.id) {
        setEditingVehicle(null);
      }
    } catch (error) {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : 'Falha ao remover o veículo.');
    }
  };

  const handleFiltersChange = (patch: VehicleFilters) => {
    setFilters((prev) => ({
      ...prev,
      licensePlate: patch.licensePlate,
      brandId: patch.brandId,
      modelId: patch.modelId,
      page: patch.page ?? 1,
      limit: patch.limit ?? prev.limit ?? DEFAULT_FILTERS.limit,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleCancelEdit = () => {
    setEditingVehicle(null);
    setFormError(null);
    setFormSuccess(null);
  };

  const brands = brandsQuery.data ?? [];
  const models = modelsQuery.data ?? [];
  const vehicleList = vehiclesQuery.data ?? {
    items: [],
    total: 0,
    page: filters.page ?? 1,
    limit: filters.limit ?? DEFAULT_FILTERS.limit!,
  };

  const isLoading = vehiclesQuery.isLoading || vehiclesQuery.isFetching;
  const submitting =
    createVehicle.isPending || updateVehicle.isPending || deleteVehicle.isPending;

  return (
    <section id="veiculos" className="grid gap-6 xl:grid-cols-[1.12fr_1fr]">
      <VehicleForm
        className="rounded-3xl border border-border/50 bg-surface/70 px-6 py-6 shadow-[var(--shadow-elevated)] backdrop-blur-xl"
        mode={editingVehicle ? 'edit' : 'create'}
        brands={brands}
        models={models}
        initialVehicle={editingVehicle}
        submitting={submitting}
        errorMessage={formError}
        successMessage={formSuccess}
        onSubmit={editingVehicle ? handleUpdate : handleCreate}
        onCancel={editingVehicle ? handleCancelEdit : undefined}
      />
      <div className="flex flex-col gap-6">
        <VehicleFilterBar
          brands={brands}
          models={models}
          filters={filters}
          loading={isLoading}
          onChange={handleFiltersChange}
        />
        <VehicleTable
          vehicles={vehicleList.items}
          brands={brands}
          models={models}
          loading={isLoading}
          page={vehicleList.page}
          limit={vehicleList.limit}
          total={vehicleList.total}
          onPageChange={handlePageChange}
          onEdit={setEditingVehicle}
          onDelete={handleDelete}
        />
      </div>
    </section>
  );
};
