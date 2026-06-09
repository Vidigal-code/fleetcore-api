'use client';

import { startTransition, useCallback, useEffect, useMemo, useState } from 'react';

import {
  useBrandsQuery,
  useCreateBrandMutation,
  useDeleteBrandMutation,
  useUpdateBrandMutation,
} from '@/entities/brand/api/brand-api';
import type { Brand } from '@/entities/brand/model/types';
import {
  useCreateModelMutation,
  useDeleteModelMutation,
  useModelsQuery,
  useUpdateModelMutation,
} from '@/entities/model/api/model-api';
import type { Model } from '@/entities/model/model/types';

interface FeedbackState {
  error: string | null;
  success: string | null;
}

interface BrandPayload {
  name: string;
}

interface ModelPayload {
  name: string;
  brandId?: string;
}

export interface ReferenceDataBoardState {
  brands: Brand[];
  models: Model[];
  editingBrand: Brand | null;
  editingModel: Model | null;
  brandFeedback: FeedbackState;
  modelFeedback: FeedbackState;
  brandSubmitting: boolean;
  modelSubmitting: boolean;
  isLoadingBrands: boolean;
  isLoadingModels: boolean;
}

export interface ReferenceDataBoardActions {
  selectBrand: (brand: Brand | null) => void;
  selectModel: (model: Model | null) => void;
  createBrand: (payload: BrandPayload) => Promise<void>;
  updateBrand: (payload: BrandPayload) => Promise<void>;
  deleteBrand: (brandId: string) => Promise<void>;
  createModel: (payload: ModelPayload) => Promise<void>;
  updateModel: (payload: ModelPayload) => Promise<void>;
  deleteModel: (modelId: string) => Promise<void>;
  resetBrandFeedback: () => void;
  resetModelFeedback: () => void;
}

const emptyFeedback: FeedbackState = { error: null, success: null };

export const useReferenceDataBoard = (): [ReferenceDataBoardState, ReferenceDataBoardActions] => {
  const brandsQuery = useBrandsQuery();
  const modelsQuery = useModelsQuery();

  const createBrandMutation = useCreateBrandMutation();
  const updateBrandMutation = useUpdateBrandMutation();
  const deleteBrandMutation = useDeleteBrandMutation();

  const createModelMutation = useCreateModelMutation();
  const updateModelMutation = useUpdateModelMutation();
  const deleteModelMutation = useDeleteModelMutation();

  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [brandFeedback, setBrandFeedback] = useState<FeedbackState>(emptyFeedback);
  const [modelFeedback, setModelFeedback] = useState<FeedbackState>(emptyFeedback);

  useEffect(() => {
    startTransition(() => {
      setBrandFeedback(emptyFeedback);
    });
  }, [editingBrand?.id]);

  useEffect(() => {
    startTransition(() => {
      setModelFeedback(emptyFeedback);
    });
  }, [editingModel?.id]);

  const brands = useMemo(() => brandsQuery.data ?? [], [brandsQuery.data]);
  const models = useMemo(() => modelsQuery.data ?? [], [modelsQuery.data]);

  const brandSubmitting =
    createBrandMutation.isPending ||
    updateBrandMutation.isPending ||
    deleteBrandMutation.isPending;

  const modelSubmitting =
    createModelMutation.isPending ||
    updateModelMutation.isPending ||
    deleteModelMutation.isPending;

  const createBrand = useCallback(
    async (payload: BrandPayload) => {
      try {
        setBrandFeedback(emptyFeedback);
        await createBrandMutation.mutateAsync(payload);
        setBrandFeedback({ error: null, success: 'Marca cadastrada com sucesso.' });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao cadastrar marca.';
        setBrandFeedback({ error: message, success: null });
      }
    },
    [createBrandMutation],
  );

  const updateBrand = useCallback(
    async (payload: BrandPayload) => {
      if (!editingBrand) return;
      try {
        setBrandFeedback(emptyFeedback);
        await updateBrandMutation.mutateAsync({ id: editingBrand.id, input: payload });
        setBrandFeedback({ error: null, success: 'Marca atualizada com sucesso.' });
        setEditingBrand(null);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao atualizar marca.';
        setBrandFeedback({ error: message, success: null });
      }
    },
    [editingBrand, updateBrandMutation],
  );

  const deleteBrand = useCallback(
    async (brandId: string) => {
      try {
        setBrandFeedback(emptyFeedback);
        await deleteBrandMutation.mutateAsync(brandId);
        setBrandFeedback({ error: null, success: 'Marca removida com sucesso.' });
        if (editingBrand?.id === brandId) {
          setEditingBrand(null);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao remover marca.';
        setBrandFeedback({ error: message, success: null });
      }
    },
    [deleteBrandMutation, editingBrand],
  );

  const createModel = useCallback(
    async (payload: ModelPayload) => {
      try {
        setModelFeedback(emptyFeedback);
        await createModelMutation.mutateAsync(payload);
        setModelFeedback({ error: null, success: 'Modelo cadastrado com sucesso.' });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao cadastrar modelo.';
        setModelFeedback({ error: message, success: null });
      }
    },
    [createModelMutation],
  );

  const updateModel = useCallback(
    async (payload: ModelPayload) => {
      if (!editingModel) return;
      try {
        setModelFeedback(emptyFeedback);
        await updateModelMutation.mutateAsync({ id: editingModel.id, input: payload });
        setModelFeedback({ error: null, success: 'Modelo atualizado com sucesso.' });
        setEditingModel(null);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao atualizar modelo.';
        setModelFeedback({ error: message, success: null });
      }
    },
    [editingModel, updateModelMutation],
  );

  const deleteModel = useCallback(
    async (modelId: string) => {
      try {
        setModelFeedback(emptyFeedback);
        await deleteModelMutation.mutateAsync(modelId);
        setModelFeedback({ error: null, success: 'Modelo removido com sucesso.' });
        if (editingModel?.id === modelId) {
          setEditingModel(null);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao remover modelo.';
        setModelFeedback({ error: message, success: null });
      }
    },
    [deleteModelMutation, editingModel],
  );

  const resetBrandFeedback = useCallback(() => {
    setBrandFeedback(emptyFeedback);
  }, []);

  const resetModelFeedback = useCallback(() => {
    setModelFeedback(emptyFeedback);
  }, []);

  return [
    {
      brands,
      models,
      editingBrand,
      editingModel,
      brandFeedback,
      modelFeedback,
      brandSubmitting,
      modelSubmitting,
      isLoadingBrands: brandsQuery.isLoading,
      isLoadingModels: modelsQuery.isLoading,
    },
    {
      selectBrand: setEditingBrand,
      selectModel: setEditingModel,
      createBrand,
      updateBrand,
      deleteBrand,
      createModel,
      updateModel,
      deleteModel,
      resetBrandFeedback,
      resetModelFeedback,
    },
  ];
};
