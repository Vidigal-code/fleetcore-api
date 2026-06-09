import { Vehicle } from '../../domain/vehicle.aggregate';
import { VehicleOrmEntity } from '../entities/vehicle.orm-entity';
import { ModelOrmEntity } from '../entities/model.orm-entity';

export const VehicleMapper = {
  toDomain(entity: VehicleOrmEntity): Vehicle {
    return Vehicle.restore({
      id: entity.id,
      licensePlate: entity.licensePlate,
      chassis: entity.chassis,
      renavam: entity.renavam,
      year: entity.year,
      modelId: entity.modelId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdBy: entity.createdBy,
    });
  },
  toOrm(vehicle: Vehicle): VehicleOrmEntity {
    const entity = new VehicleOrmEntity();
    entity.id = vehicle.id;
    entity.licensePlate = vehicle.licensePlate;
    entity.chassis = vehicle.chassis;
    entity.renavam = vehicle.renavam;
    entity.year = vehicle.year;
    entity.model = { id: vehicle.modelId } as ModelOrmEntity;
    entity.modelId = vehicle.modelId;
    entity.createdAt = vehicle.createdAt;
    entity.updatedAt = vehicle.updatedAt;
    entity.createdBy = vehicle.createdBy;
    return entity;
  },
};
