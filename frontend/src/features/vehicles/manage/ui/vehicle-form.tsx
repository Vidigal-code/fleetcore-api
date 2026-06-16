'use client';

import { startTransition, useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Wrench } from 'lucide-react';

import type { Brand } from '@/entities/brand/model/types';
import type { Model } from '@/entities/model/model/types';
import type { Vehicle } from '@/entities/vehicle/model/types';
import { cn, formatLicensePlate } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { InlineMessage } from '@/shared/ui/inline-message';
import { InputField } from '@/shared/ui/input-field';
import { SelectField } from '@/shared/ui/select-field';
import { Stack, Surface } from '@/shared/ui/layout-primitives';

import {
  vehicleSchema,
  type VehicleFormValues,
} from '@/features/vehicles/manage/model/vehicle-schema';

export interface VehicleFormProps {
  mode: 'create' | 'edit';
  brands: Brand[];
  models: Model[];
  initialVehicle?: Vehicle | null;
  submitting?: boolean;
  errorMessage?: string | null;
  successMessage?: string | null;
  onSubmit: (payload: VehicleFormValues) => Promise<void> | void;
  onCancel?: () => void;
  className?: string;
  showHeader?: boolean;
}

const emptyValues: VehicleFormValues = {
  licensePlate: '',
  chassis: '',
  renavam: '',
  year: new Date().getFullYear(),
  modelId: '',
};

export const VehicleForm = ({
  mode,
  brands,
  models,
  initialVehicle,
  submitting = false,
  errorMessage,
  successMessage,
  onSubmit,
  onCancel,
  className,
  showHeader = true,
}: VehicleFormProps) => {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: emptyValues,
  });

  const [brandFilter, setBrandFilter] = useState<string>('');

  useEffect(() => {
    if (initialVehicle && mode === 'edit') {
      const relatedModel = models.find((model) => model.id === initialVehicle.modelId);
      startTransition(() => {
        setBrandFilter(relatedModel?.brandId ?? '');
      });
      form.reset({
        licensePlate: initialVehicle.licensePlate,
        chassis: initialVehicle.chassis,
        renavam: initialVehicle.renavam,
        year: initialVehicle.year,
        modelId: initialVehicle.modelId,
      });
    } else {
      startTransition(() => {
        setBrandFilter('');
      });
      form.reset(emptyValues);
    }
  }, [initialVehicle, mode, models, form]);

  const filteredModels = useMemo(() => {
    if (!brandFilter) return models;
    return models.filter((model) => model.brandId === brandFilter);
  }, [brandFilter, models]);

  useEffect(() => {
    const currentModelId = form.getValues('modelId');
    if (!currentModelId) return;
    const stillValid = filteredModels.some((model) => model.id === currentModelId);
    if (!stillValid) {
      form.resetField('modelId');
    }
  }, [brandFilter, filteredModels, form]);

  const handleBrandChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBrandFilter(event.target.value);
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    const payload: VehicleFormValues = {
      ...values,
      licensePlate: formatLicensePlate(values.licensePlate),
    };
    await onSubmit(payload);
    if (mode === 'create') {
      form.reset(emptyValues);
      setBrandFilter('');
    }
  });

  const brandOptions = useMemo(
    () => [
      { value: '', label: 'Todas as marcas' },
      ...brands.map((brand) => ({ value: brand.id, label: brand.name })),
    ],
    [brands],
  );

  const modelOptions = useMemo(
    () =>
      filteredModels.map((model) => ({
        value: model.id,
        label: model.name,
      })),
    [filteredModels],
  );

  return (
    <Stack gap="lg" className={cn('w-full', className)}>
      {showHeader ? (
        <Surface
          tone="strong"
          elevation="low"
          padding="sm"
          radius="lg"
          align="center"
          glass="base"
          className="flex flex-col items-center gap-4 text-center"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
            <Wrench className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              {mode === 'create' ? 'Registrar novo veículo' : 'Atualizar veículo'}
            </h2>
            <p className="text-sm text-muted">
              Defina placa, identificadores e relacione o veículo ao modelo correspondente.
            </p>
          </div>
        </Surface>
      ) : null}
      <form
        className="mx-auto grid w-full max-w-md grid-cols-1 gap-4 lg:max-w-none lg:grid-cols-2"
        onSubmit={handleSubmit}
      >
        <InputField
          label="Placa Mercosul"
          placeholder="AAA1B23"
          autoCapitalize="characters"
          {...form.register('licensePlate')}
          error={form.formState.errors.licensePlate?.message ?? null}
        />
        <InputField
          label="Renavam"
          placeholder="00000000000"
          {...form.register('renavam')}
          error={form.formState.errors.renavam?.message ?? null}
        />
        <InputField
          label="Chassis"
          placeholder="9BG116GW04C400001"
          {...form.register('chassis')}
          error={form.formState.errors.chassis?.message ?? null}
        />
        <InputField
          label="Ano"
          type="number"
          min={1980}
          max={new Date().getFullYear() + 1}
          {...form.register('year', { valueAsNumber: true })}
          error={form.formState.errors.year?.message ?? null}
        />
        <SelectField
          label="Marca"
          value={brandFilter}
          onChange={handleBrandChange}
          options={brandOptions}
        />
        <SelectField
          label="Modelo"
          placeholder="Selecione um modelo"
          options={modelOptions}
          {...form.register('modelId')}
          error={form.formState.errors.modelId?.message ?? null}
        />

        {errorMessage ? (
          <InlineMessage className="lg:col-span-2" variant="error">
            {errorMessage}
          </InlineMessage>
        ) : null}
        {successMessage ? (
          <InlineMessage className="lg:col-span-2" variant="success">
            {successMessage}
          </InlineMessage>
        ) : null}

        <div className="mt-1 flex flex-wrap items-center justify-center gap-3 lg:col-span-2 lg:justify-end">
          {mode === 'edit' ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancelar
            </Button>
          ) : null}
          <Button type="submit" loading={submitting} variant="primary">
            {mode === 'create' ? 'Registrar veículo' : 'Salvar alterações'}
          </Button>
        </div>
      </form>
    </Stack>
  );
};
