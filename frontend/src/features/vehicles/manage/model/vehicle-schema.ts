import { z } from 'zod';

import { requiredNumber, requiredString, requiredUuid } from '@/shared/lib/zod-helpers';

const currentYear = new Date().getFullYear();

export const vehicleSchema = z.object({
  licensePlate: requiredString('Informe a placa.', { trim: true }).regex(
    /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/i,
    'Placa no padrão Mercosul (AAA1B23).',
  ),
  chassis: requiredString('Informe o chassis.', { trim: true }).min(5, 'Chassis inválido.'),
  renavam: requiredString('Informe o Renavam.', { trim: true }).min(5, 'Renavam inválido.'),
  year: requiredNumber('Informe o ano.')
    .refine(Number.isInteger, { message: 'Ano inválido.' })
    .min(1980, { message: 'Ano mínimo: 1980.' })
    .max(currentYear + 1, { message: `Ano máximo: ${currentYear + 1}.` }),
  modelId: requiredUuid('Selecione um modelo.', 'Modelo inválido.'),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
