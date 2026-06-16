import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EntityManager } from 'typeorm';

import { AuditService } from '../../audit/audit.service';
import { RepositoryCacheService } from '../../../shared/cache/repository-cache.service';
import { UnitOfWork } from '../../../shared/unit-of-work/unit-of-work';
import {
  MODEL_REPOSITORY,
  VEHICLE_REPOSITORY,
  VEHICLE_EVENT_CREATED,
  VEHICLE_EVENT_UPDATED,
  VEHICLE_EVENT_REMOVED,
  AUDIT_ENTITY_VEHICLE,
  VEHICLE_CACHE_NAMESPACE,
  VEHICLE_DETAIL_CACHE_NAMESPACE,
} from '../fleet.constants';
import type { ModelRepository } from '../domain/model.repository';
import { Vehicle } from '../domain/vehicle.aggregate';
import type {
  VehicleRepository,
  VehicleSearchFilters,
  VehicleSearchResult,
} from '../domain/vehicle.repository';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { QueryVehiclesDto } from '../dto/query-vehicles.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { VehicleOrmEntity } from '../infrastructure/entities/vehicle.orm-entity';
import { VehicleTypeOrmRepository } from '../infrastructure/repositories/vehicle.typeorm.repository';
import { EventBusService } from '../../../shared/domain/events';
import {
  VehicleCreatedEvent,
  VehicleDeletedEvent,
  VehicleUpdatedEvent,
} from '../domain/events';
import { FeatureToggleService } from '../../../shared/features';

interface SerializedVehicle {
  id: string;
  licensePlate: string;
  chassis: string;
  renavam: string;
  year: number;
  modelId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface SerializedVehicleSearchResult extends Omit<
  VehicleSearchResult,
  'items'
> {
  items: SerializedVehicle[];
}

@Injectable()
export class VehiclesService {
  private readonly cacheTtl: number;

  constructor(
    @Inject(VEHICLE_REPOSITORY) private readonly repository: VehicleRepository,
    @Inject(MODEL_REPOSITORY) private readonly modelRepository: ModelRepository,
    private readonly unitOfWork: UnitOfWork,
    private readonly auditService: AuditService,
    private readonly repositoryCache: RepositoryCacheService,
    private readonly eventBus: EventBusService,
    private readonly featureToggleService: FeatureToggleService,
    configService: ConfigService,
  ) {
    this.cacheTtl = configService.get<number>('redis.ttlSeconds', 60);
  }

  async search(query: QueryVehiclesDto): Promise<VehicleSearchResult> {
    const filters: VehicleSearchFilters = {
      licensePlate: query.licensePlate?.toUpperCase(),
      modelId: query.modelId,
      brandId: query.brandId,
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    };

    if (this.featureToggleService.isEnabled('repositoryCache', true)) {
      return this.repositoryCache.fetch({
        namespace: VEHICLE_CACHE_NAMESPACE,
        key: filters,
        ttlSeconds: this.cacheTtl,
        loader: () => this.repository.search(filters),
        serializer: (value) =>
          JSON.stringify(this.serializeSearchResult(value)),
        deserializer: (raw) => this.deserializeSearchResult(raw),
      });
    }

    return this.repository.search(filters);
  }

  async findById(id: string): Promise<Vehicle> {
    if (!this.featureToggleService.isEnabled('repositoryCache', true)) {
      return this.loadVehicleOrThrow(id);
    }

    return this.repositoryCache.fetch({
      namespace: VEHICLE_DETAIL_CACHE_NAMESPACE,
      key: id,
      ttlSeconds: this.cacheTtl,
      loader: () => this.loadVehicleOrThrow(id),
      serializer: (vehicle) => JSON.stringify(this.serializeVehicle(vehicle)),
      deserializer: (raw) => this.deserializeVehicle(raw),
    });
  }

  private async loadVehicleOrThrow(id: string): Promise<Vehicle> {
    const vehicle = await this.repository.findById(id);
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    return vehicle;
  }

  async create(input: CreateVehicleDto, actor: string) {
    await this.ensureModelExists(input.modelId);

    await this.ensureUniqueness(input);

    const vehicle = Vehicle.create({
      licensePlate: input.licensePlate.toUpperCase(),
      chassis: input.chassis,
      renavam: input.renavam,
      year: input.year,
      modelId: input.modelId,
      createdBy: actor,
    });

    const created = await this.unitOfWork.execute((manager) =>
      this.scopedRepository(manager).save(vehicle),
    );

    await this.invalidateCache(created.id);
    await this.auditService.record({
      action: VEHICLE_EVENT_CREATED,
      entity: AUDIT_ENTITY_VEHICLE,
      entityId: created.id,
      actor,
      payload: {
        licensePlate: created.licensePlate,
        modelId: created.modelId,
      },
    });

    await this.featureToggleService.runIfEnabled('domainEvents', () =>
      this.eventBus.publish(
        new VehicleCreatedEvent({
          vehicleId: created.id,
          actor,
          snapshot: created,
        }),
      ),
    );

    return created;
  }

  async update(id: string, input: UpdateVehicleDto, actor: string) {
    const vehicle = await this.repository.findById(id);
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (input.modelId && input.modelId !== vehicle.modelId) {
      await this.ensureModelExists(input.modelId);
      vehicle.changeModel(input.modelId);
    }

    if (
      input.licensePlate &&
      input.licensePlate.toUpperCase() !== vehicle.licensePlate
    ) {
      const existing = await this.repository.findByLicensePlate(
        input.licensePlate.toUpperCase(),
      );
      if (existing && existing.id !== id) {
        throw new ConflictException('License plate already in use');
      }
      vehicle.update({ licensePlate: input.licensePlate.toUpperCase() });
    }

    if (input.chassis && input.chassis !== vehicle.chassis) {
      const existing = await this.repository.findByChassis(input.chassis);
      if (existing && existing.id !== id) {
        throw new ConflictException('Chassis already in use');
      }
      vehicle.update({ chassis: input.chassis });
    }

    if (input.renavam && input.renavam !== vehicle.renavam) {
      const existing = await this.repository.findByRenavam(input.renavam);
      if (existing && existing.id !== id) {
        throw new ConflictException('Renavam already in use');
      }
      vehicle.update({ renavam: input.renavam });
    }

    if (input.year && input.year !== vehicle.year) {
      vehicle.update({ year: input.year });
    }

    const updated = await this.unitOfWork.execute((manager) =>
      this.scopedRepository(manager).save(vehicle),
    );

    await this.invalidateCache(updated.id);
    await this.auditService.record({
      action: VEHICLE_EVENT_UPDATED,
      entity: AUDIT_ENTITY_VEHICLE,
      entityId: updated.id,
      actor,
      payload: {
        licensePlate: updated.licensePlate,
        modelId: updated.modelId,
      },
    });

    await this.featureToggleService.runIfEnabled('domainEvents', () =>
      this.eventBus.publish(
        new VehicleUpdatedEvent({
          vehicleId: updated.id,
          actor,
          snapshot: updated,
        }),
      ),
    );

    return updated;
  }

  async remove(id: string, actor: string) {
    const vehicle = await this.repository.findById(id);
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    await this.unitOfWork.execute(async (manager) => {
      await this.scopedRepository(manager).remove(vehicle);
    });

    await this.invalidateCache(vehicle.id);
    await this.auditService.record({
      action: VEHICLE_EVENT_REMOVED,
      entity: AUDIT_ENTITY_VEHICLE,
      entityId: vehicle.id,
      actor,
      payload: {
        licensePlate: vehicle.licensePlate,
      },
    });

    await this.featureToggleService.runIfEnabled('domainEvents', () =>
      this.eventBus.publish(
        new VehicleDeletedEvent({
          vehicleId: vehicle.id,
          actor,
          snapshot: vehicle,
        }),
      ),
    );
  }

  private async ensureModelExists(modelId: string) {
    const model = await this.modelRepository.findById(modelId);
    if (!model) {
      throw new NotFoundException('Model not found');
    }
  }

  private async ensureUniqueness(input: CreateVehicleDto) {
    const [licensePlate, chassis, renavam] = await Promise.all([
      this.repository.findByLicensePlate(input.licensePlate.toUpperCase()),
      this.repository.findByChassis(input.chassis),
      this.repository.findByRenavam(input.renavam),
    ]);

    if (licensePlate) {
      throw new ConflictException('License plate already in use');
    }

    if (chassis) {
      throw new ConflictException('Chassis already in use');
    }

    if (renavam) {
      throw new ConflictException('Renavam already in use');
    }
  }

  private scopedRepository(manager: EntityManager): VehicleRepository {
    return VehicleTypeOrmRepository.create(
      manager.getRepository(VehicleOrmEntity),
    );
  }

  private async invalidateCache(vehicleId: string) {
    if (!this.featureToggleService.isEnabled('repositoryCache', true)) {
      return;
    }

    // Any mutation can change which vehicles a paginated/filtered search
    // returns, so the whole search namespace is invalidated. The detail cache
    // is keyed by id, so only the affected vehicle's entry is dropped.
    await Promise.all([
      this.repositoryCache.invalidate(VEHICLE_CACHE_NAMESPACE),
      this.repositoryCache.invalidateKey(
        VEHICLE_DETAIL_CACHE_NAMESPACE,
        vehicleId,
      ),
    ]);
  }

  private serializeVehicle(vehicle: Vehicle): SerializedVehicle {
    return {
      id: vehicle.id,
      licensePlate: vehicle.licensePlate,
      chassis: vehicle.chassis,
      renavam: vehicle.renavam,
      year: vehicle.year,
      modelId: vehicle.modelId,
      createdAt: vehicle.createdAt.toISOString(),
      updatedAt: vehicle.updatedAt.toISOString(),
      createdBy: vehicle.createdBy,
    };
  }

  private deserializeVehicle(serialized: string): Vehicle {
    return this.restoreVehicle(JSON.parse(serialized) as SerializedVehicle);
  }

  private restoreVehicle(item: SerializedVehicle): Vehicle {
    return Vehicle.restore({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    });
  }

  private serializeSearchResult(
    result: VehicleSearchResult,
  ): SerializedVehicleSearchResult {
    return {
      ...result,
      items: result.items.map((vehicle) => this.serializeVehicle(vehicle)),
    };
  }

  private deserializeSearchResult(serialized: string): VehicleSearchResult {
    const parsed = JSON.parse(serialized) as SerializedVehicleSearchResult;

    return {
      ...parsed,
      items: parsed.items.map((item) => this.restoreVehicle(item)),
    };
  }
}
