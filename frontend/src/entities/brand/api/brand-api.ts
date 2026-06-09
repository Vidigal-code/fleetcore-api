'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fleetClient } from '@/shared/api/fleet-client';

import type {
  Brand,
  CreateBrandInput,
  UpdateBrandInput,
} from '@/entities/brand/model/types';

export const brandKeys = {
  all: ['brands'] as const,
  list: ['brands', 'list'] as const,
  detail: (id: string) => ['brands', 'detail', id] as const,
};

const fetchBrands = async (): Promise<Brand[]> => fleetClient.brands.list();

export const useBrandsQuery = () =>
  useQuery({
    queryKey: brandKeys.list,
    queryFn: fetchBrands,
  });

const createBrand = async (input: CreateBrandInput): Promise<Brand> =>
  fleetClient.brands.create(input);

const updateBrand = async ({
  id,
  input,
}: {
  id: string;
  input: UpdateBrandInput;
}): Promise<Brand> => fleetClient.brands.update(id, input);

const deleteBrand = async (id: string) => fleetClient.brands.remove(id);

export const useCreateBrandMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
    },
  });
};

export const useUpdateBrandMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBrand,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
      queryClient.invalidateQueries({ queryKey: brandKeys.detail(variables.id) });
    },
  });
};

export const useDeleteBrandMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
    },
  });
};
