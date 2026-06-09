import { z } from 'zod';

import { requiredString } from '@/shared/lib/zod-helpers';

export const modelSchema = z.object({
  name: requiredString('Informe o nome do modelo.', { trim: true })
    .min(2, 'Nome muito curto.')
    .max(120, 'Nome muito longo.'),
  brandId: z.string().optional(),
});

export type ModelFormValues = z.infer<typeof modelSchema>;
