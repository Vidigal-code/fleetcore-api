import { Vehicle } from '../../../domain/vehicle.aggregate';

export interface VehicleResponse {
  id: string;
  licensePlate: string;
  chassis: string;
  renavam: string;
  year: number;
  modelId: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export const toVehicleResponse = (vehicle: Vehicle): VehicleResponse => ({
  id: vehicle.id,
  licensePlate: vehicle.licensePlate,
  chassis: vehicle.chassis,
  renavam: vehicle.renavam,
  year: vehicle.year,
  modelId: vehicle.modelId,
  createdAt: vehicle.createdAt,
  updatedAt: vehicle.updatedAt,
  createdBy: vehicle.createdBy,
});
