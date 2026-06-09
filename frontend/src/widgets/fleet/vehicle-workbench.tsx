'use client';

import type { Vehicle } from '@/entities/vehicle/model/types';
import { VehicleTable } from '@/entities/vehicle/ui/vehicle-table';
import { VehicleFilterBar } from '@/features/vehicles/filter/ui/vehicle-filter-bar';
import { VehicleForm } from '@/features/vehicles/manage/ui/vehicle-form';
import { PageSection, Stack, Surface } from '@/shared/ui/layout-primitives';

import { useVehicleWorkbench } from '@/widgets/fleet/vehicle-workbench/model/use-vehicle-workbench';

export const VehicleWorkbench = () => {
  const [state, actions] = useVehicleWorkbench();
  const {
    filters,
    editingVehicle,
    brands,
    models,
    collection,
    isLoading,
    isSubmitting,
    feedback,
  } = state;

  const handleDelete = (vehicle: Vehicle) => {
    const confirmation = window.confirm(
      `Remover definitivamente o veículo ${vehicle.licensePlate}? Essa ação não pode ser desfeita.`,
    );
    if (!confirmation) return;
    void actions.deleteVehicle(vehicle.id);
  };

  return (
    <>
      <PageSection width="xl" layout="stack" className="gap-8">
        <Surface
          tone="base"
          elevation="floating"
          padding="lg"
          radius="xl"
          className="space-y-4 text-center lg:text-left"
        >
          <Stack gap="sm" className="items-center text-center lg:items-start lg:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
              Operação da frota
            </span>
            <h1 className="text-3xl font-semibold text-foreground">Cadastro e gestão de veículos</h1>
            <p className="max-w-3xl text-sm text-muted">
              Registre novos veículos, sincronize atributos de modelos e mantenha auditoria completa de
              quem alterou cada informação.
            </p>
          </Stack>
        </Surface>
      </PageSection>

      <PageSection id="vehicles" width="xl" layout="grid" split="wide-left">
        <Surface
          tone="base"
          radius="xl"
          align="center"
          className="col-span-full space-y-6 lg:col-span-1"
      >
        <VehicleForm
          mode={editingVehicle ? 'edit' : 'create'}
          brands={brands}
          models={models}
          initialVehicle={editingVehicle}
          submitting={isSubmitting}
          errorMessage={feedback.error}
          successMessage={feedback.success}
          onSubmit={editingVehicle ? actions.updateVehicle : actions.createVehicle}
          onCancel={
            editingVehicle
              ? () => {
                  actions.setEditingVehicle(null);
                  actions.resetFeedback();
                }
              : undefined
          }
        />
      </Surface>
      <Stack gap="lg" className="col-span-full lg:col-span-1">
        <Surface tone="base" elevation="low" padding="sm" radius="lg">
          <VehicleFilterBar
            brands={brands}
            models={models}
            filters={filters}
            loading={isLoading}
            onChange={actions.applyFilters}
          />
        </Surface>
        <Surface tone="base" radius="xl" className="space-y-6">
          <VehicleTable
            vehicles={collection.items}
            brands={brands}
            models={models}
            loading={isLoading}
            page={collection.page}
            limit={collection.limit}
            total={collection.total}
            onPageChange={actions.changePage}
            onEdit={actions.setEditingVehicle}
            onDelete={handleDelete}
          />
        </Surface>
      </Stack>
      </PageSection>
    </>
  );
};
