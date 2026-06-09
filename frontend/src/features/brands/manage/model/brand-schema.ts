import { z } from 'zod';

import { requiredString } from '@/shared/lib/zod-helpers';
import { BRAND_NAME_MIN_LENGTH, BRAND_NAME_MAX_LENGTH } from '@/shared/schemas';

export const brandSchema = z.object({
  name: requiredString('Informe o nome da marca.', { trim: true })
    .min(BRAND_NAME_MIN_LENGTH, 'Nome muito curto.')
    .max(BRAND_NAME_MAX_LENGTH, 'Nome muito longo.'),
});

export type BrandFormValues = z.infer<typeof brandSchema>;
