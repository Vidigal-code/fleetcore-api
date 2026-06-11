'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { PenLine, Trash2 } from 'lucide-react';

import type { Brand } from '@/entities/brand/model/types';
import type { Model } from '@/entities/model/model/types';
import { BrandForm } from '@/features/brands/manage/ui/brand-form';
import { ModelForm } from '@/features/models/manage/ui/model-form';
import { Button } from '@/shared/ui/button';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';
import { PageSection, ResponsiveGrid, Stack, Surface } from '@/shared/ui/layout-primitives';
import { Modal } from '@/shared/ui/modal';
import { Pagination } from '@/shared/ui/pagination';

import {
  useReferenceDataBoard,
  type ReferenceDataBoardActions,
  type ReferenceDataBoardState,
} from '@/widgets/fleet/reference-data-board/model/use-reference-data-board';

interface ReferencePanelProps {
  id: string;
  title: string;
  description: string;
  countLabel: string;
  loading: boolean;
  form: ReactNode;
  children: ReactNode;
}

const ReferencePanel = ({
  id,
  title,
  description,
  countLabel,
  loading,
  form,
  children,
}: ReferencePanelProps) => (
  <Surface tone="base" radius="xl" align="center" className="w-full space-y-6">
    <Stack gap="sm" className="items-center text-center sm:items-start sm:text-left">
      <h3 className="text-lg font-semibold text-foreground sm:text-xl" id={id}>
        {title}
      </h3>
      <p className="text-xs text-muted sm:text-sm">{description}</p>
    </Stack>
    {form}
    <div className="flex w-full flex-col gap-3">{children}</div>
    <p className="text-xs text-muted sm:text-[0.75rem]">
      {loading ? 'Carregando...' : countLabel}
    </p>
  </Surface>
);

interface ReferenceListItemProps {
  title: string;
  subtitle: string;
  onEdit: () => void;
  onDelete: () => void;
}

const ReferenceListItem = ({ title, subtitle, onEdit, onDelete }: ReferenceListItemProps) => (
  <Surface
    tone="strong"
    elevation="low"
    padding="sm"
    radius="lg"
    align="center"
    className="w-full text-center sm:text-left"
  >
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="max-w-full space-y-1 text-center sm:text-left">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted sm:text-[0.75rem]">{subtitle}</p>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
          <PenLine className="h-4 w-4" />
        </Button>
        <Button type="button" variant="danger" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </Surface>
);

interface SectionProps {
  state: ReferenceDataBoardState;
  actions: ReferenceDataBoardActions;
}

const BrandSection = ({ state, actions }: SectionProps) => {
  const { brands, editingBrand, brandFeedback, brandSubmitting, isLoadingBrands } = state;
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<Brand | null>(null);
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.max(1, Math.ceil(brands.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);

  const paginatedBrands = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return brands.slice(start, start + ITEMS_PER_PAGE);
  }, [brands, safePage]);

  const closeEdit = () => {
    actions.selectBrand(null);
    actions.resetBrandFeedback();
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await actions.deleteBrand(pendingDelete.id);
    setPendingDelete(null);
  };

  return (
    <ReferencePanel
      id="marcas"
      title="Marcas"
      description="Cadastre fabricantes e mantenha a referência auditável para toda a frota."
      countLabel={`${brands.length} marca(s)`}
      loading={isLoadingBrands}
      form={
        <BrandForm
          mode="create"
          submitting={brandSubmitting}
          errorMessage={editingBrand ? null : brandFeedback.error}
          successMessage={editingBrand ? null : brandFeedback.success}
          onSubmit={actions.createBrand}
        />
      }
    >
      {paginatedBrands.map((brand) => (
        <ReferenceListItem
          key={brand.id}
          title={brand.name}
          subtitle={`criado por ${brand.createdBy} · ${new Date(brand.updatedAt).toLocaleDateString('pt-BR')}`}
          onEdit={() => {
            actions.selectBrand(brand);
            actions.resetBrandFeedback();
          }}
          onDelete={() => setPendingDelete(brand)}
        />
      ))}
      <Pagination
        page={safePage}
        limit={ITEMS_PER_PAGE}
        total={brands.length}
        onPageChange={setPage}
        className="mt-4"
      />

      <Modal
        open={Boolean(editingBrand)}
        onClose={closeEdit}
        title="Editar marca"
        description="Atualize os dados da marca selecionada."
      >
        <BrandForm
          mode="edit"
          initialBrand={editingBrand}
          submitting={brandSubmitting}
          errorMessage={brandFeedback.error}
          successMessage={brandFeedback.success}
          onSubmit={actions.updateBrand}
          onCancel={closeEdit}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        loading={brandSubmitting}
        title="Remover marca"
        description={
          pendingDelete
            ? `Remover a marca "${pendingDelete.name}"? Esta ação não pode ser desfeita.`
            : undefined
        }
        confirmLabel="Remover"
      />
    </ReferencePanel>
  );
};

const ModelSection = ({ state, actions }: SectionProps) => {
  const {
    models,
    brands,
    editingModel,
    modelFeedback,
    modelSubmitting,
    isLoadingModels,
  } = state;
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.max(1, Math.ceil(models.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);

  const [pendingDelete, setPendingDelete] = useState<Model | null>(null);

  const brandMap = useMemo(() => new Map(brands.map((brand) => [brand.id, brand])), [brands]);

  const paginatedModels = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return models.slice(start, start + ITEMS_PER_PAGE);
  }, [models, safePage]);

  const closeEdit = () => {
    actions.selectModel(null);
    actions.resetModelFeedback();
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await actions.deleteModel(pendingDelete.id);
    setPendingDelete(null);
  };

  return (
    <ReferencePanel
      id="modelos"
      title="Modelos"
      description="Relacione modelos às marcas garantindo consistência nos cadastros de veículos."
      countLabel={`${models.length} modelo(s)`}
      loading={isLoadingModels}
      form={
        <ModelForm
          mode="create"
          brands={brands}
          submitting={modelSubmitting}
          errorMessage={editingModel ? null : modelFeedback.error}
          successMessage={editingModel ? null : modelFeedback.success}
          onSubmit={actions.createModel}
        />
      }
    >
      {paginatedModels.map((model) => {
        const brand = model.brandId ? brandMap.get(model.brandId) : undefined;
        return (
          <ReferenceListItem
            key={model.id}
            title={model.name}
            subtitle={brand ? `Marca · ${brand.name}` : 'Sem marca associada'}
            onEdit={() => {
              actions.selectModel(model);
              actions.resetModelFeedback();
            }}
            onDelete={() => setPendingDelete(model)}
          />
        );
      })}
      <Pagination
        page={safePage}
        limit={ITEMS_PER_PAGE}
        total={models.length}
        onPageChange={setPage}
        className="mt-4"
      />

      <Modal
        open={Boolean(editingModel)}
        onClose={closeEdit}
        title="Editar modelo"
        description="Atualize o modelo e a marca associada."
      >
        <ModelForm
          mode="edit"
          brands={brands}
          initialModel={editingModel}
          submitting={modelSubmitting}
          errorMessage={modelFeedback.error}
          successMessage={modelFeedback.success}
          onSubmit={actions.updateModel}
          onCancel={closeEdit}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        loading={modelSubmitting}
        title="Remover modelo"
        description={
          pendingDelete
            ? `Remover o modelo "${pendingDelete.name}"? Esta ação não pode ser desfeita.`
            : undefined
        }
        confirmLabel="Remover"
      />
    </ReferencePanel>
  );
};

export const BrandManagementBoard = () => {
  const [state, actions] = useReferenceDataBoard();
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
              Catálogo de fabricantes
            </span>
            <h1 className="text-3xl font-semibold text-foreground">Gestão de marcas homologadas</h1>
            <p className="max-w-3xl text-sm text-muted">
              Mantenha o registro de fornecedores atualizado, controle contratos e preserve a auditoria de
              cada alteração realizada pela equipe.
            </p>
          </Stack>
        </Surface>
      </PageSection>

      <PageSection width="xl" layout="stack">
        <BrandSection state={state} actions={actions} />
      </PageSection>
    </>
  );
};

export const ModelManagementBoard = () => {
  const [state, actions] = useReferenceDataBoard();
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
              Biblioteca de modelos
            </span>
            <h1 className="text-3xl font-semibold text-foreground">Configuração de modelos e famílias</h1>
            <p className="max-w-3xl text-sm text-muted">
              Relacione modelos às suas marcas, defina atributos e mantenha o catálogo sincronizado com as
              integrações externas.
            </p>
          </Stack>
        </Surface>
      </PageSection>

      <PageSection width="xl" layout="stack">
        <ModelSection state={state} actions={actions} />
      </PageSection>
    </>
  );
};

export const ReferenceDataBoard = () => {
  const [state, actions] = useReferenceDataBoard();

  return (
    <PageSection id="referencias" width="xl" layout="stack" className="gap-10">
      <ResponsiveGrid columns="even" className="w-full">
        <BrandSection state={state} actions={actions} />
        <ModelSection state={state} actions={actions} />
      </ResponsiveGrid>
    </PageSection>
  );
};
