import type {
  CreateVehicleInput as SharedCreateVehicleInput,
  QueryVehiclesInput,
  UpdateVehicleInput as SharedUpdateVehicleInput,
  Vehicle as SharedVehicle,
  VehicleListResponse as SharedVehicleListResponse,
} from '@/shared/schemas';

export type VehicleFilters = Partial<QueryVehiclesInput>;
export type CreateVehicleInput = SharedCreateVehicleInput;
export type UpdateVehicleInput = SharedUpdateVehicleInput;
export type Vehicle = SharedVehicle;
export type VehicleListResponse = SharedVehicleListResponse;
