import { z } from 'zod';

import { requiredString } from '@/shared/lib/zod-helpers';
import { MODEL_NAME_MIN_LENGTH, MODEL_NAME_MAX_LENGTH } from '@/shared/schemas';

export const modelSchema = z.object({
  name: requiredString('Informe o nome do modelo.', { trim: true })
    .min(MODEL_NAME_MIN_LENGTH, 'Nome muito curto.')
    .max(MODEL_NAME_MAX_LENGTH, 'Nome muito longo.'),
  brandId: z.string().optional(),
});

export type ModelFormValues = z.infer<typeof modelSchema>;
