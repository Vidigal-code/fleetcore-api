'use client';

import { z } from 'zod';

export const recoverSchema = z.object({
  email: z
    .string()
    .min(1, 'Informe o e-mail corporativo')
    .email('Formato de e-mail inválido'),
});

export type RecoverFormValues = z.infer<typeof recoverSchema>;
