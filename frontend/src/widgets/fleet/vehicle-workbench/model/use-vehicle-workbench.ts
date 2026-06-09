'use client';

import { startTransition, useCallback, useEffect, useMemo, useState } from 'react';

import { useBrandsQuery } from '@/entities/brand/api/brand-api';
import type { Brand } from '@/entities/brand/model/types';
import { useModelsQuery } from '@/entities/model/api/model-api';
import type { Model } from '@/entities/model/model/types';
import {
  useCreateVehicleMutation,
  useDeleteVehicleMutation,
  useUpdateVehicleMutation,
  useVehiclesQuery,
} from '@/entities/vehicle/api/vehicle-api';
import type { Vehicle, VehicleFilters } from '@/entities/vehicle/model/types';
import type { VehicleFormValues } from '@/features/vehicles/manage/model/vehicle-schema';

const DEFAULT_LIMIT = 10;

const initialFilters: VehicleFilters = {
  page: 1,
  limit: DEFAULT_LIMIT,
};

interface VehicleWorkbenchFeedback {
  error: string | null;
  success: string | null;
}

interface VehicleCollection {
  items: Vehicle[];
  total: number;
  page: number;
  limit: number;
}

export interface VehicleWorkbenchState {
  filters: VehicleFilters;
  editingVehicle: Vehicle | null;
  brands: Brand[];
  models: Model[];
  collection: VehicleCollection;
  isLoading: boolean;
  isSubmitting: boolean;
  feedback: VehicleWorkbenchFeedback;
}

export interface VehicleWorkbenchActions {
  setEditingVehicle: (vehicle: Vehicle | null) => void;
  createVehicle: (payload: VehicleFormValues) => Promise<void>;
  updateVehicle: (payload: VehicleFormValues) => Promise<void>;
  deleteVehicle: (vehicleId: string) => Promise<void>;
  applyFilters: (patch: VehicleFilters) => void;
  changePage: (page: number) => void;
  resetFeedback: () => void;
}

export const useVehicleWorkbench = (): [VehicleWorkbenchState, VehicleWorkbenchActions] => {
  const [filters, setFilters] = useState<VehicleFilters>(initialFilters);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [feedback, setFeedback] = useState<VehicleWorkbenchFeedback>({ error: null, success: null });

  const vehiclesQuery = useVehiclesQuery(filters);
  const brandsQuery = useBrandsQuery();
  const modelsQuery = useModelsQuery();

  const createVehicleMutation = useCreateVehicleMutation();
  const updateVehicleMutation = useUpdateVehicleMutation();
  const deleteVehicleMutation = useDeleteVehicleMutation();

  useEffect(() => {
    startTransition(() => {
      setFeedback({ error: null, success: null });
    });
  }, [editingVehicle?.id]);

  const brands = brandsQuery.data ?? [];
  const models = modelsQuery.data ?? [];

  const collection: VehicleCollection = useMemo(
    () => ({
      items: vehiclesQuery.data?.items ?? [],
      total: vehiclesQuery.data?.total ?? 0,
      page: vehiclesQuery.data?.page ?? filters.page ?? 1,
      limit: vehiclesQuery.data?.limit ?? filters.limit ?? DEFAULT_LIMIT,
    }),
    [vehiclesQuery.data, filters.page, filters.limit],
  );

  const isLoading = vehiclesQuery.isLoading || vehiclesQuery.isFetching;
  const isSubmitting =
    createVehicleMutation.isPending ||
    updateVehicleMutation.isPending ||
    deleteVehicleMutation.isPending;

  const createVehicle = useCallback(
    async (payload: VehicleFormValues) => {
      try {
        setFeedback({ error: null, success: null });
        await createVehicleMutation.mutateAsync(payload);
        setFeedback({ error: null, success: 'Veículo registrado com sucesso.' });
        setFilters((prev) => ({ ...prev, page: 1 }));
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Falha ao registrar veículo.';
        setFeedback({ error: message, success: null });
      }
    },
    [createVehicleMutation],
  );

  const updateVehicle = useCallback(
    async (payload: VehicleFormValues) => {
      if (!editingVehicle) return;
      try {
        setFeedback({ error: null, success: null });
        await updateVehicleMutation.mutateAsync({ id: editingVehicle.id, input: payload });
        setFeedback({ error: null, success: 'Veículo atualizado com sucesso.' });
        setEditingVehicle(null);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Falha ao atualizar o veículo.';
        setFeedback({ error: message, success: null });
      }
    },
    [editingVehicle, updateVehicleMutation],
  );

  const deleteVehicle = useCallback(
    async (vehicleId: string) => {
      try {
        setFeedback({ error: null, success: null });
        await deleteVehicleMutation.mutateAsync(vehicleId);
        setFeedback({ error: null, success: 'Veículo removido com sucesso.' });
        if (editingVehicle?.id === vehicleId) {
          setEditingVehicle(null);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Falha ao remover o veículo.';
        setFeedback({ error: message, success: null });
      }
    },
    [deleteVehicleMutation, editingVehicle],
  );

  const applyFilters = useCallback((patch: VehicleFilters) => {
    setFilters((prev) => ({
      ...prev,
      licensePlate: patch.licensePlate,
      brandId: patch.brandId,
      modelId: patch.modelId,
      page: patch.page ?? 1,
      limit: patch.limit ?? prev.limit ?? DEFAULT_LIMIT,
    }));
  }, []);

  const changePage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const resetFeedback = useCallback(() => {
    setFeedback({ error: null, success: null });
  }, []);

  return [
    {
      filters,
      editingVehicle,
      brands,
      models,
      collection,
      isLoading,
      isSubmitting,
      feedback,
    },
    {
      setEditingVehicle,
      createVehicle,
      updateVehicle,
      deleteVehicle,
      applyFilters,
      changePage,
      resetFeedback,
    },
  ];
};
