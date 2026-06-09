'use client';

import { useState } from 'react';
import { PenLine, Trash2 } from 'lucide-react';

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
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { BrandForm } from '@/features/brands/manage/ui/brand-form';
import { ModelForm } from '@/features/models/manage/ui/model-form';

export const ReferenceDataBoard = () => {
  const brandsQuery = useBrandsQuery();
  const modelsQuery = useModelsQuery();

  const createBrand = useCreateBrandMutation();
  const updateBrand = useUpdateBrandMutation();
  const deleteBrand = useDeleteBrandMutation();

  const createModel = useCreateModelMutation();
  const updateModel = useUpdateModelMutation();
  const deleteModel = useDeleteModelMutation();

  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandError, setBrandError] = useState<string | null>(null);
  const [brandSuccess, setBrandSuccess] = useState<string | null>(null);

  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [modelError, setModelError] = useState<string | null>(null);
  const [modelSuccess, setModelSuccess] = useState<string | null>(null);

  const brands = brandsQuery.data ?? [];
  const models = modelsQuery.data ?? [];

  const handleBrandCreate = async (values: { name: string }) => {
    try {
      setBrandError(null);
      await createBrand.mutateAsync(values);
      setBrandSuccess('Marca cadastrada com sucesso.');
    } catch (error) {
      setBrandSuccess(null);
      setBrandError(error instanceof Error ? error.message : 'Erro ao cadastrar marca.');
    }
  };

  const handleBrandUpdate = async (values: { name: string }) => {
    if (!editingBrand) return;
    try {
      setBrandError(null);
      await updateBrand.mutateAsync({ id: editingBrand.id, input: values });
      setBrandSuccess('Marca atualizada com sucesso.');
      setEditingBrand(null);
    } catch (error) {
      setBrandSuccess(null);
      setBrandError(error instanceof Error ? error.message : 'Erro ao atualizar marca.');
    }
  };

  const handleBrandDelete = async (brand: Brand) => {
    const confirmation = window.confirm(`Remover a marca ${brand.name}?`);
    if (!confirmation) return;
    try {
      setBrandError(null);
      await deleteBrand.mutateAsync(brand.id);
      setBrandSuccess(`Marca ${brand.name} removida.`);
      if (editingBrand?.id === brand.id) {
        setEditingBrand(null);
      }
    } catch (error) {
      setBrandSuccess(null);
      setBrandError(error instanceof Error ? error.message : 'Erro ao remover marca.');
    }
  };

  const handleModelCreate = async (values: { name: string; brandId?: string }) => {
    try {
      setModelError(null);
      await createModel.mutateAsync(values);
      setModelSuccess('Modelo cadastrado com sucesso.');
    } catch (error) {
      setModelSuccess(null);
      setModelError(error instanceof Error ? error.message : 'Erro ao cadastrar modelo.');
    }
  };

  const handleModelUpdate = async (values: { name: string; brandId?: string }) => {
    if (!editingModel) return;
    try {
      setModelError(null);
      await updateModel.mutateAsync({ id: editingModel.id, input: values });
      setModelSuccess('Modelo atualizado com sucesso.');
      setEditingModel(null);
    } catch (error) {
      setModelSuccess(null);
      setModelError(error instanceof Error ? error.message : 'Erro ao atualizar modelo.');
    }
  };

  const handleModelDelete = async (model: Model) => {
    const confirmation = window.confirm(`Remover o modelo ${model.name}?`);
    if (!confirmation) return;
    try {
      setModelError(null);
      await deleteModel.mutateAsync(model.id);
      setModelSuccess(`Modelo ${model.name} removido.`);
      if (editingModel?.id === model.id) {
        setEditingModel(null);
      }
    } catch (error) {
      setModelSuccess(null);
      setModelError(error instanceof Error ? error.message : 'Erro ao remover modelo.');
    }
  };

  const submittingBrand =
    createBrand.isPending || updateBrand.isPending || deleteBrand.isPending;
  const submittingModel =
    createModel.isPending || updateModel.isPending || deleteModel.isPending;

  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <Card
        className="p-0"
        header={
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-foreground" id="marcas">
              Marcas
            </h3>
            <p className="text-xs text-muted">
              Cadastre fabricantes e mantenha a referência auditável para toda a frota.
            </p>
          </div>
        }
        footer={
          <span className="text-xs text-muted">
            {brandsQuery.isLoading ? 'Carregando...' : `${brands.length} marca(s)`}
          </span>
        }
      >
        <div className="flex flex-col gap-6">
          <BrandForm
            mode={editingBrand ? 'edit' : 'create'}
            initialBrand={editingBrand}
            submitting={submittingBrand}
            errorMessage={brandError}
            successMessage={brandSuccess}
            onSubmit={editingBrand ? handleBrandUpdate : handleBrandCreate}
            onCancel={() => {
              setEditingBrand(null);
              setBrandError(null);
              setBrandSuccess(null);
            }}
          />
          <div className="space-y-3">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="flex items-start justify-between gap-3 rounded-2xl border border-border/40 bg-surface/70 px-4 py-4 shadow-sm"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">{brand.name}</p>
                  <p className="text-xs text-muted">
                    criado por {brand.createdBy} ·{' '}
                    {new Date(brand.updatedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingBrand(brand);
                      setBrandError(null);
                      setBrandSuccess(null);
                    }}
                  >
                    <PenLine className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleBrandDelete(brand)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card
        className="p-0"
        header={
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-foreground" id="modelos">
              Modelos
            </h3>
            <p className="text-xs text-muted">
              Relacione modelos às marcas garantindo consistência nos cadastros de veículos.
            </p>
          </div>
        }
        footer={
          <span className="text-xs text-muted">
            {modelsQuery.isLoading ? 'Carregando...' : `${models.length} modelo(s)`}
          </span>
        }
      >
        <div className="flex flex-col gap-6">
          <ModelForm
            mode={editingModel ? 'edit' : 'create'}
            brands={brands}
            initialModel={editingModel}
            submitting={submittingModel}
            errorMessage={modelError}
            successMessage={modelSuccess}
            onSubmit={editingModel ? handleModelUpdate : handleModelCreate}
            onCancel={() => {
              setEditingModel(null);
              setModelError(null);
              setModelSuccess(null);
            }}
          />
          <div className="space-y-3">
            {models.map((model) => {
              const brand = model.brandId
                ? brands.find((item) => item.id === model.brandId)
                : undefined;
              return (
                <div
                  key={model.id}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-border/40 bg-surface/70 px-4 py-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{model.name}</p>
                    <p className="text-xs text-muted">
                      {brand ? `Marca · ${brand.name}` : 'Sem marca associada'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingModel(model);
                        setModelError(null);
                        setModelSuccess(null);
                      }}
                    >
                      <PenLine className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => handleModelDelete(model)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </section>
  );
};
