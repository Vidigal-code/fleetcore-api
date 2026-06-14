'use client';

import type { Vehicle } from '@/entities/vehicle/model/types';
import { VehicleTable } from '@/entities/vehicle/ui/vehicle-table';
import { VehicleFilterBar } from '@/features/vehicles/filter/ui/vehicle-filter-bar';
import { VehicleForm } from '@/features/vehicles/manage/ui/vehicle-form';
import { useConfirmation } from '@/shared/hooks/use-confirmation';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';
import { PageSection, Stack, Surface } from '@/shared/ui/layout-primitives';
import { Modal } from '@/shared/ui/modal';

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

  const deletion = useConfirmation<Vehicle>((vehicle) =>
    actions.deleteVehicle(vehicle.id),
  );

  const closeEdit = () => {
    actions.setEditingVehicle(null);
    actions.resetFeedback();
  };

  return (
    <>
      <PageSection width="xl" layout="stack" className="gap-6">
        <Surface
          tone="base"
          elevation="floating"
          padding="lg"
          radius="xl"
          className="mx-auto w-full max-w-5xl space-y-4 text-center lg:text-left"
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

      <PageSection id="vehicles" width="xl" layout="stack" className="gap-8">
        <Surface
          tone="base"
          radius="xl"
          align="center"
          className="mx-auto w-full max-w-3xl space-y-6"
        >
          <VehicleForm
            mode="create"
            brands={brands}
            models={models}
            submitting={isSubmitting}
            errorMessage={editingVehicle ? null : feedback.error}
            successMessage={editingVehicle ? null : feedback.success}
            onSubmit={actions.createVehicle}
          />
        </Surface>

        <Surface tone="base" elevation="low" padding="sm" radius="lg" className="mx-auto w-full max-w-5xl">
          <VehicleFilterBar
            brands={brands}
            models={models}
            filters={filters}
            loading={isLoading}
            onChange={actions.applyFilters}
          />
        </Surface>

        <Surface tone="base" radius="xl" className="mx-auto w-full max-w-5xl space-y-6">
          <div className="w-full overflow-x-auto">
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
              onDelete={deletion.request}
            />
          </div>
        </Surface>
      </PageSection>

      <Modal
        open={Boolean(editingVehicle)}
        onClose={closeEdit}
        size="lg"
        title="Atualizar veículo"
        description="Defina placa, identificadores e relacione o veículo ao modelo correspondente."
      >
        <VehicleForm
          mode="edit"
          brands={brands}
          models={models}
          initialVehicle={editingVehicle}
          submitting={isSubmitting}
          errorMessage={feedback.error}
          successMessage={feedback.success}
          onSubmit={actions.updateVehicle}
          onCancel={closeEdit}
          showHeader={false}
        />
      </Modal>

      <ConfirmDialog
        open={deletion.isOpen}
        onClose={deletion.cancel}
        onConfirm={deletion.confirm}
        loading={isSubmitting}
        title="Remover veículo"
        description={
          deletion.target
            ? `Remover definitivamente o veículo "${deletion.target.licensePlate}"? Essa ação não pode ser desfeita.`
            : undefined
        }
        confirmLabel="Remover"
      />
    </>
  );
};
