'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import type { Brand } from '@/entities/brand/model/types';
import { Button } from '@/shared/ui/button';
import { InputField } from '@/shared/ui/input-field';
import { InlineMessage } from '@/shared/ui/inline-message';

import { brandSchema, type BrandFormValues } from '../model/brand-schema';

export interface BrandFormProps {
  mode: 'create' | 'edit';
  initialBrand?: Brand | null;
  submitting?: boolean;
  errorMessage?: string | null;
  successMessage?: string | null;
  onSubmit: (values: BrandFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

export const BrandForm = ({
  mode,
  initialBrand,
  submitting = false,
  errorMessage,
  successMessage,
  onSubmit,
  onCancel,
}: BrandFormProps) => {
  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (initialBrand && mode === 'edit') {
      form.reset({ name: initialBrand.name });
    } else {
      form.reset({ name: '' });
    }
  }, [initialBrand, mode, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    if (mode === 'create') {
      form.reset({ name: '' });
    }
  });

  return (
    <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
      <InputField
        label="Marca"
        placeholder="Ex.: Volare"
        {...form.register('name')}
        error={form.formState.errors.name?.message ?? null}
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
      <div className="mt-2 flex flex-wrap items-center justify-end gap-3">
        {mode === 'edit' ? (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={submitting}>
            Cancelar
          </Button>
        ) : null}
        <Button type="submit" size="sm" loading={submitting} variant="secondary">
          {mode === 'create' ? 'Cadastrar marca' : 'Salvar marca'}
        </Button>
      </div>
    </form>
  );
};
