import { Vehicle } from './vehicle.aggregate';

export interface VehicleSearchFilters {
  licensePlate?: string;
  modelId?: string;
  brandId?: string;
  page: number;
  limit: number;
}

export interface VehicleSearchResult {
  items: Vehicle[];
  total: number;
  page: number;
  limit: number;
}

export interface VehicleRepository {
  findById(id: string): Promise<Vehicle | null>;
  findByLicensePlate(licensePlate: string): Promise<Vehicle | null>;
  findByChassis(chassis: string): Promise<Vehicle | null>;
  findByRenavam(renavam: string): Promise<Vehicle | null>;
  list(): Promise<Vehicle[]>;
  listByModel(modelId: string): Promise<Vehicle[]>;
  search(filters: VehicleSearchFilters): Promise<VehicleSearchResult>;
  save(vehicle: Vehicle): Promise<Vehicle>;
  remove(vehicle: Vehicle): Promise<void>;
}
