'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fleetClient } from '@/shared/api/fleet-client';

import type {
  CreateModelInput,
  Model,
  UpdateModelInput,
} from '@/entities/model/model/types';

export interface ModelFilters {
  brandId?: string;
}

export const modelKeys = {
  all: ['models'] as const,
  list: (filters?: ModelFilters) => ['models', 'list', filters ?? {}] as const,
  detail: (id: string) => ['models', 'detail', id] as const,
};

const fetchModels = async (filters?: ModelFilters): Promise<Model[]> =>
  fleetClient.models.list(filters ?? {});

export const useModelsQuery = (filters?: ModelFilters) =>
  useQuery({
    queryKey: modelKeys.list(filters),
    queryFn: () => fetchModels(filters),
  });

const createModel = async (input: CreateModelInput): Promise<Model> =>
  fleetClient.models.create(input);

const updateModel = async ({
  id,
  input,
}: {
  id: string;
  input: UpdateModelInput;
}): Promise<Model> => fleetClient.models.update(id, input);

const deleteModel = async (id: string) => fleetClient.models.remove(id);

export const useCreateModelMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createModel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: modelKeys.all });
    },
  });
};

export const useUpdateModelMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateModel,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: modelKeys.all });
      queryClient.invalidateQueries({ queryKey: modelKeys.detail(variables.id) });
    },
  });
};

export const useDeleteModelMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteModel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: modelKeys.all });
    },
  });
};
