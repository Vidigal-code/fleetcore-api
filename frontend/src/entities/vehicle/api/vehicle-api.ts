'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fleetClient } from '@/shared/api/fleet-client';

import type {
  CreateVehicleInput,
  UpdateVehicleInput,
  Vehicle,
  VehicleFilters,
  VehicleListResponse,
} from '@/entities/vehicle/model/types';

export const vehicleKeys = {
  all: ['vehicles'] as const,
  list: (filters?: VehicleFilters) => ['vehicles', 'list', filters ?? {}] as const,
  detail: (id: string) => ['vehicles', 'detail', id] as const,
};

const fetchVehicles = async (filters?: VehicleFilters): Promise<VehicleListResponse> =>
  fleetClient.vehicles.list(filters ?? {});

export const useVehiclesQuery = (filters?: VehicleFilters) =>
  useQuery({
    queryKey: vehicleKeys.list(filters),
    queryFn: () => fetchVehicles(filters),
    placeholderData: keepPreviousData,
  });

const createVehicle = async (input: CreateVehicleInput): Promise<Vehicle> =>
  fleetClient.vehicles.create(input);

const updateVehicle = async ({
  id,
  input,
}: {
  id: string;
  input: UpdateVehicleInput;
}): Promise<Vehicle> => fleetClient.vehicles.update(id, input);

const deleteVehicle = async (id: string) => fleetClient.vehicles.remove(id);

export const useCreateVehicleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
    },
  });
};

export const useUpdateVehicleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateVehicle,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
      queryClient.invalidateQueries({ queryKey: vehicleKeys.detail(variables.id) });
    },
  });
};

export const useDeleteVehicleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
    },
  });
};
