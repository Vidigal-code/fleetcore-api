import { z } from 'zod';

export const VEHICLE_YEAR_MIN = 1900;
export const VEHICLE_YEAR_MAX = 2100;
export const LICENSE_PLATE_REGEX = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/i;
export const BRAND_NAME_MIN_LENGTH = 1;
export const BRAND_NAME_MAX_LENGTH = 120;
export const MODEL_NAME_MIN_LENGTH = 1;
export const MODEL_NAME_MAX_LENGTH = 120;

export const createVehicleSchema = z.object({
  licensePlate: z
    .string()
    .min(1)
    .regex(LICENSE_PLATE_REGEX, 'licensePlate must follow Mercosul pattern')
    .transform((value) => value.toUpperCase()),
  chassis: z.string().min(1),
  renavam: z.string().min(1),
  year: z.coerce.number().int().min(VEHICLE_YEAR_MIN).max(VEHICLE_YEAR_MAX),
  modelId: z.string().uuid(),
});

export const updateVehicleSchema = createVehicleSchema.partial();

export const vehicleEntitySchema = createVehicleSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
  createdBy: z.string(),
});

export const vehicleListSchema = z.object({
  items: z.array(vehicleEntitySchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
});

export const queryVehiclesSchema = z.object({
  licensePlate: z.string().optional(),
  modelId: z.string().uuid().optional(),
  brandId: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const createBrandSchema = z.object({
  name: z.string().min(BRAND_NAME_MIN_LENGTH).max(BRAND_NAME_MAX_LENGTH),
});

export const updateBrandSchema = createBrandSchema.partial();

export const brandEntitySchema = createBrandSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
  createdBy: z.string(),
});

export const createModelSchema = z.object({
  name: z.string().min(MODEL_NAME_MIN_LENGTH).max(MODEL_NAME_MAX_LENGTH),
  brandId: z.string().uuid().optional(),
});

export const updateModelSchema = createModelSchema.partial();

export const modelEntitySchema = createModelSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
  createdBy: z.string(),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type Vehicle = z.infer<typeof vehicleEntitySchema>;
export type VehicleListResponse = z.infer<typeof vehicleListSchema>;
export type QueryVehiclesInput = z.infer<typeof queryVehiclesSchema>;
export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
export type CreateModelInput = z.infer<typeof createModelSchema>;
export type UpdateModelInput = z.infer<typeof updateModelSchema>;
export type Brand = z.infer<typeof brandEntitySchema>;
export type Model = z.infer<typeof modelEntitySchema>;
