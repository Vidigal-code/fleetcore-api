'use client';

import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import type { Brand } from '@/entities/brand/model/types';
import type { Model } from '@/entities/model/model/types';
import type { VehicleFilters } from '@/entities/vehicle/model/types';
import { formatLicensePlate } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { InputField } from '@/shared/ui/input-field';
import { SelectField } from '@/shared/ui/select-field';

interface VehicleFilterFormValues {
  licensePlate: string;
  brandId: string;
  modelId: string;
}

export interface VehicleFilterBarProps {
  brands: Brand[];
  models: Model[];
  filters: VehicleFilters;
  loading?: boolean;
  onChange: (filters: VehicleFilters) => void;
}

const emptyFilterValues: VehicleFilterFormValues = {
  licensePlate: '',
  brandId: '',
  modelId: '',
};

export const VehicleFilterBar = ({
  brands,
  models,
  filters,
  loading = false,
  onChange,
}: VehicleFilterBarProps) => {
  const form = useForm<VehicleFilterFormValues>({
    defaultValues: emptyFilterValues,
  });

  useEffect(() => {
    form.reset({
      licensePlate: filters.licensePlate ?? '',
      brandId: filters.brandId ?? '',
      modelId: filters.modelId ?? '',
    });
  }, [filters, form]);

  const brandId = useWatch({ control: form.control, name: 'brandId' });

  const filteredModels = useMemo(() => {
    if (!brandId) return models;
    return models.filter((model) => model.brandId === brandId);
  }, [brandId, models]);

  const handleSubmit = form.handleSubmit((values) => {
    onChange({
      licensePlate: values.licensePlate
        ? formatLicensePlate(values.licensePlate)
        : undefined,
      brandId: values.brandId || undefined,
      modelId: values.modelId || undefined,
      page: 1,
    });
  });

  const handleReset = () => {
    form.reset(emptyFilterValues);
    onChange({ page: 1, limit: filters.limit });
  };

  useEffect(() => {
    const currentModel = form.getValues('modelId');
    if (!currentModel) return;
    const stillValid = filteredModels.some((model) => model.id === currentModel);
    if (!stillValid) {
      form.setValue('modelId', '');
    }
  }, [filteredModels, form]);

  const brandOptions = useMemo(
    () => [
      { value: '', label: 'Todas as marcas' },
      ...brands.map((brand) => ({ value: brand.id, label: brand.name })),
    ],
    [brands],
  );

  const modelOptions = useMemo(
    () => filteredModels.map((model) => ({ value: model.id, label: model.name })),
    [filteredModels],
  );

  return (
    <form
      className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-4 rounded-3xl border border-border/40 bg-surface/50 px-6 py-5 text-center shadow-sm backdrop-blur-xl lg:grid-cols-[repeat(3,minmax(0,1fr))_auto] lg:text-left"
      onSubmit={handleSubmit}
    >
      <InputField
        label="Placa"
        placeholder="AAA1B23"
        autoCapitalize="characters"
        {...form.register('licensePlate')}
      />
      <SelectField
        label="Marca"
        options={brandOptions}
        {...form.register('brandId')}
      />
      <SelectField
        label="Modelo"
        placeholder={brandId ? 'Selecione o modelo' : 'Todas as marcas'}
        options={modelOptions}
        {...form.register('modelId')}
      />
      <div className="flex flex-col items-center justify-center gap-3 lg:flex-row lg:justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={handleReset} disabled={loading}>
          Limpar
        </Button>
        <Button type="submit" variant="secondary" size="sm" disabled={loading}>
          Aplicar filtros
        </Button>
      </div>
    </form>
  );
};
