import { z } from 'zod';

import { requiredString } from '@/shared/lib/zod-helpers';

export const loginSchema = z.object({
  identifier: requiredString('Informe seu usuário ou e-mail.', { trim: true }).min(
    3,
    'Informe um identificador válido.',
  ),
  password: requiredString('A senha é obrigatória.').min(
    6,
    'Sua senha precisa de pelo menos 6 caracteres.',
  ),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
