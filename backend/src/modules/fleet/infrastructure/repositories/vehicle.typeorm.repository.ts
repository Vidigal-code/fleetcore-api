import { Repository } from 'typeorm';

import { Vehicle } from '../../domain/vehicle.aggregate';
import {
  VehicleRepository,
  VehicleSearchFilters,
  VehicleSearchResult,
} from '../../domain/vehicle.repository';
import { VehicleOrmEntity } from '../entities/vehicle.orm-entity';
import { VehicleMapper } from '../mappers/vehicle.mapper';

export class VehicleTypeOrmRepository implements VehicleRepository {
  constructor(private readonly repository: Repository<VehicleOrmEntity>) {}

  static create(repository: Repository<VehicleOrmEntity>): VehicleRepository {
    return new VehicleTypeOrmRepository(repository);
  }

  async findById(id: string): Promise<Vehicle | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? VehicleMapper.toDomain(entity) : null;
  }

  async findByLicensePlate(licensePlate: string): Promise<Vehicle | null> {
    const entity = await this.repository.findOne({ where: { licensePlate } });
    return entity ? VehicleMapper.toDomain(entity) : null;
  }

  async findByChassis(chassis: string): Promise<Vehicle | null> {
    const entity = await this.repository.findOne({ where: { chassis } });
    return entity ? VehicleMapper.toDomain(entity) : null;
  }

  async findByRenavam(renavam: string): Promise<Vehicle | null> {
    const entity = await this.repository.findOne({ where: { renavam } });
    return entity ? VehicleMapper.toDomain(entity) : null;
  }

  async list(): Promise<Vehicle[]> {
    const entities = await this.repository.find({
      order: { licensePlate: 'ASC' },
    });
    return entities.map((entity) => VehicleMapper.toDomain(entity));
  }

  async listByModel(modelId: string): Promise<Vehicle[]> {
    const entities = await this.repository.find({
      where: { modelId },
      order: { licensePlate: 'ASC' },
    });
    return entities.map((entity) => VehicleMapper.toDomain(entity));
  }

  async search(filters: VehicleSearchFilters): Promise<VehicleSearchResult> {
    const qb = this.repository
      .createQueryBuilder('vehicle')
      .leftJoin('vehicle.model', 'model')
      .orderBy('vehicle.license_plate', 'ASC');

    if (filters.licensePlate) {
      qb.andWhere('vehicle.license_plate LIKE :license', {
        license: `%${filters.licensePlate}%`,
      });
    }

    if (filters.modelId) {
      qb.andWhere('vehicle.model_id = :modelId', {
        modelId: filters.modelId,
      });
    }

    if (filters.brandId) {
      qb.andWhere('model.brand_id = :brandId', {
        brandId: filters.brandId,
      });
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;

    qb.skip((page - 1) * limit).take(limit);

    const [entities, total] = await qb.getManyAndCount();

    return {
      items: entities.map((entity) => VehicleMapper.toDomain(entity)),
      total,
      page,
      limit,
    };
  }

  async save(vehicle: Vehicle): Promise<Vehicle> {
    const saved = await this.repository.save(VehicleMapper.toOrm(vehicle));
    return VehicleMapper.toDomain(saved);
  }

  async remove(vehicle: Vehicle): Promise<void> {
    await this.repository.delete(vehicle.id);
  }
}
