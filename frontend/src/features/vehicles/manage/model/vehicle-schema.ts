import { z } from 'zod';

import { requiredNumber, requiredString, requiredUuid } from '@/shared/lib/zod-helpers';
import {
  LICENSE_PLATE_REGEX,
  VEHICLE_YEAR_MIN,
  VEHICLE_YEAR_MAX,
} from '@/shared/schemas';

export const vehicleSchema = z.object({
  licensePlate: requiredString('Informe a placa.', { trim: true }).regex(
    LICENSE_PLATE_REGEX,
    'Placa no padrão Mercosul (AAA1B23).',
  ),
  chassis: requiredString('Informe o chassis.', { trim: true }).min(5, 'Chassis inválido.'),
  renavam: requiredString('Informe o Renavam.', { trim: true }).min(5, 'Renavam inválido.'),
  year: requiredNumber('Informe o ano.')
    .refine(Number.isInteger, { message: 'Ano inválido.' })
    .min(VEHICLE_YEAR_MIN, { message: `Ano mínimo: ${VEHICLE_YEAR_MIN}.` })
    .max(VEHICLE_YEAR_MAX, { message: `Ano máximo: ${VEHICLE_YEAR_MAX}.` }),
  modelId: requiredUuid('Selecione um modelo.', 'Modelo inválido.'),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
