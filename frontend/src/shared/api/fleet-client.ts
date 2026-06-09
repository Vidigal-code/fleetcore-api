import { z } from 'zod';

import {
  LICENSE_PLATE_REGEX,
  VEHICLE_YEAR_MAX,
  VEHICLE_YEAR_MIN,
  brandEntitySchema,
  createBrandSchema,
  createModelSchema,
  createVehicleSchema,
  modelEntitySchema,
  queryVehiclesSchema,
  updateBrandSchema,
  updateModelSchema,
  updateVehicleSchema,
  vehicleEntitySchema,
  vehicleListSchema,
} from '@/shared/schemas';
import { httpClient } from '@/shared/api/http-client';

const idParamSchema = z.object({ id: z.string().uuid() });
const brandListSchema = z.array(brandEntitySchema);
const modelListSchema = z.array(modelEntitySchema);
const modelFilterSchema = z.object({ brandId: z.string().uuid().optional() });

const enforceVehicleInput = (input: unknown) =>
  createVehicleSchema.extend({
    licensePlate: z
      .string()
      .regex(LICENSE_PLATE_REGEX)
      .transform((value) => value.toUpperCase()),
    year: z.coerce.number().int().min(VEHICLE_YEAR_MIN).max(VEHICLE_YEAR_MAX),
  }).parse(input);

export const fleetClient = {
  vehicles: {
    async list(filters: unknown) {
      const parsedFilters = queryVehiclesSchema.parse(filters);
      const { data } = await httpClient.get('/vehicles', { params: parsedFilters });
      return vehicleListSchema.parse(data);
    },
    async create(input: unknown) {
      const payload = enforceVehicleInput(input);
      const { data } = await httpClient.post('/vehicles', payload);
      return vehicleEntitySchema.parse(data);
    },
    async update(id: string, input: unknown) {
      idParamSchema.parse({ id });
      const payload = updateVehicleSchema.parse(input);
      const { data } = await httpClient.patch(`/vehicles/${id}`, payload);
      return vehicleEntitySchema.parse(data);
    },
    async remove(id: string) {
      idParamSchema.parse({ id });
      await httpClient.delete(`/vehicles/${id}`);
    },
  },
  brands: {
    async list() {
      const { data } = await httpClient.get('/brands');
      return brandListSchema.parse(data);
    },
    async create(input: unknown) {
      const payload = createBrandSchema.parse(input);
      const { data } = await httpClient.post('/brands', payload);
      return brandEntitySchema.parse(data);
    },
    async update(id: string, input: unknown) {
      idParamSchema.parse({ id });
      const payload = updateBrandSchema.parse(input);
      const { data } = await httpClient.patch(`/brands/${id}`, payload);
      return brandEntitySchema.parse(data);
    },
    async remove(id: string) {
      idParamSchema.parse({ id });
      await httpClient.delete(`/brands/${id}`);
    },
  },
  models: {
    async list(filters: unknown) {
      const parsedFilters = modelFilterSchema.partial().parse(filters ?? {});
      const { data } = await httpClient.get('/models', {
        params: parsedFilters,
      });
      return modelListSchema.parse(data);
    },
    async create(input: unknown) {
      const payload = createModelSchema.parse(input);
      const { data } = await httpClient.post('/models', payload);
      return modelEntitySchema.parse(data);
    },
    async update(id: string, input: unknown) {
      idParamSchema.parse({ id });
      const payload = updateModelSchema.parse(input);
      const { data } = await httpClient.patch(`/models/${id}`, payload);
      return modelEntitySchema.parse(data);
    },
    async remove(id: string) {
      idParamSchema.parse({ id });
      await httpClient.delete(`/models/${id}`);
    },
  },
};
