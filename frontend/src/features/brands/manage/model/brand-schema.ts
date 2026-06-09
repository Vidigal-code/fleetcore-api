import { z } from 'zod';

import { requiredString } from '@/shared/lib/zod-helpers';

export const brandSchema = z.object({
  name: requiredString('Informe o nome da marca.', { trim: true })
    .min(2, 'Nome muito curto.')
    .max(80, 'Nome muito longo.'),
});

export type BrandFormValues = z.infer<typeof brandSchema>;
