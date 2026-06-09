import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(3, 'Informe pelo menos 3 caracteres')
    .max(120, 'Máximo de 120 caracteres'),
  nickname: z
    .string()
    .min(3, 'Informe pelo menos 3 caracteres')
    .max(50, 'Máximo de 50 caracteres'),
  email: z
    .string()
    .email('Informe um e-mail válido')
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
