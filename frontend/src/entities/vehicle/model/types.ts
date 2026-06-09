import type {
  CreateVehicleInput as SharedCreateVehicleInput,
  QueryVehiclesInput,
  UpdateVehicleInput as SharedUpdateVehicleInput,
  Vehicle,
  VehicleListResponse,
} from '@/shared/schemas';

export type VehicleFilters = Partial<QueryVehiclesInput>;
export type CreateVehicleInput = SharedCreateVehicleInput;
export type UpdateVehicleInput = SharedUpdateVehicleInput;
