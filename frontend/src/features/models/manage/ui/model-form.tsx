'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import type { Brand } from '@/entities/brand/model/types';
import type { Model } from '@/entities/model/model/types';
import { Button } from '@/shared/ui/button';
import { InlineMessage } from '@/shared/ui/inline-message';
import { InputField } from '@/shared/ui/input-field';
import { SelectField } from '@/shared/ui/select-field';

import { modelSchema, type ModelFormValues } from '../model/model-schema';

export interface ModelFormProps {
  mode: 'create' | 'edit';
  brands: Brand[];
  initialModel?: Model | null;
  submitting?: boolean;
  errorMessage?: string | null;
  successMessage?: string | null;
  onSubmit: (values: ModelFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

export const ModelForm = ({
  mode,
  brands,
  initialModel,
  submitting = false,
  errorMessage,
  successMessage,
  onSubmit,
  onCancel,
}: ModelFormProps) => {
  const form = useForm<ModelFormValues>({
    resolver: zodResolver(modelSchema),
    defaultValues: { name: '', brandId: '' },
  });

  useEffect(() => {
    if (initialModel && mode === 'edit') {
      form.reset({
        name: initialModel.name,
        brandId: initialModel.brandId ?? '',
      });
    } else {
      form.reset({ name: '', brandId: '' });
    }
  }, [initialModel, mode, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit({ ...values, brandId: values.brandId || undefined });
    if (mode === 'create') {
      form.reset({ name: '', brandId: '' });
    }
  });

  const brandOptions = [{ value: '', label: 'Sem marca' }, ...brands.map((brand) => ({ value: brand.id, label: brand.name }))];

  return (
    <form className="grid w-full grid-cols-1 gap-4 text-center" onSubmit={handleSubmit}>
      <InputField
        label="Modelo"
        placeholder="Ex.: V8 Fly"
        {...form.register('name')}
        error={form.formState.errors.name?.message ?? null}
      />
      <SelectField
        label="Marca"
        options={brandOptions}
        {...form.register('brandId')}
        hint="Opcional"
      />
      {errorMessage ? (
        <InlineMessage className="text-sm" variant="error">
          {errorMessage}
        </InlineMessage>
      ) : null}
      {successMessage ? (
        <InlineMessage className="text-sm" variant="success">
          {successMessage}
        </InlineMessage>
      ) : null}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3 sm:justify-end">
        {mode === 'edit' ? (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={submitting}>
            Cancelar
          </Button>
        ) : null}
        <Button type="submit" size="sm" loading={submitting} variant="secondary">
          {mode === 'create' ? 'Cadastrar modelo' : 'Salvar modelo'}
        </Button>
      </div>
    </form>
  );
};
