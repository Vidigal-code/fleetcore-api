import { readFile } from 'node:fs/promises';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { UnitOfWork } from '../../../shared/unit-of-work/unit-of-work';
import {
  BRAND_REPOSITORY,
  MODEL_REPOSITORY,
  VEHICLE_REPOSITORY,
} from '../fleet.constants';
import { Brand } from '../domain/brand.aggregate';
import { Model } from '../domain/model.aggregate';
import { Vehicle } from '../domain/vehicle.aggregate';
import type { BrandRepository } from '../domain/brand.repository';
import type { ModelRepository } from '../domain/model.repository';
import type { VehicleRepository } from '../domain/vehicle.repository';
import { BrandOrmEntity } from '../infrastructure/entities/brand.orm-entity';
import { ModelOrmEntity } from '../infrastructure/entities/model.orm-entity';
import { VehicleOrmEntity } from '../infrastructure/entities/vehicle.orm-entity';
import { BrandTypeOrmRepository } from '../infrastructure/repositories/brand.typeorm.repository';
import { ModelTypeOrmRepository } from '../infrastructure/repositories/model.typeorm.repository';
import { VehicleTypeOrmRepository } from '../infrastructure/repositories/vehicle.typeorm.repository';

export interface VehicleSeedEntry {
  licensePlate: string;
  chassis: string;
  renavam: string;
  year: number;
  modelName: string;
  brandName: string;
}

export interface FleetSeedSummary {
  brandsCreated: number;
  modelsCreated: number;
  vehiclesCreated: number;
  vehiclesSkipped: number;
}

const DEFAULT_ACTOR = 'system';

/**
 * Idempotent loader for the `seed_vehicles.json` mock dataset.
 *
 * Reuses the domain aggregates and repositories so the seed honors the same
 * invariants as the regular flow, while remaining safe to run multiple times:
 * existing brands, models and vehicles are reused instead of duplicated.
 */
@Injectable()
export class FleetSeederService {
  private readonly logger = new Logger(FleetSeederService.name);

  constructor(
    @Inject(BRAND_REPOSITORY) private readonly brandRepository: BrandRepository,
    @Inject(MODEL_REPOSITORY) private readonly modelRepository: ModelRepository,
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicleRepository: VehicleRepository,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async seedFromFile(
    filePath: string,
    actor: string = DEFAULT_ACTOR,
  ): Promise<FleetSeedSummary> {
    const raw = await readFile(filePath, 'utf-8');
    const entries = JSON.parse(raw) as VehicleSeedEntry[];
    return this.seed(entries, actor);
  }

  async seed(
    entries: VehicleSeedEntry[],
    actor: string = DEFAULT_ACTOR,
  ): Promise<FleetSeedSummary> {
    const summary: FleetSeedSummary = {
      brandsCreated: 0,
      modelsCreated: 0,
      vehiclesCreated: 0,
      vehiclesSkipped: 0,
    };

    for (const entry of entries) {
      const brand = await this.ensureBrand(entry.brandName, actor, summary);
      const model = await this.ensureModel(
        entry.modelName,
        brand.id,
        actor,
        summary,
      );
      await this.ensureVehicle(entry, model.id, actor, summary);
    }

    this.logger.log(`Fleet seed finished: ${JSON.stringify(summary)}`);
    return summary;
  }

  private async ensureBrand(
    name: string,
    actor: string,
    summary: FleetSeedSummary,
  ): Promise<Brand> {
    const existing = await this.brandRepository.findByName(name);
    if (existing) {
      return existing;
    }

    const created = await this.unitOfWork.execute((manager) =>
      this.scopedBrandRepository(manager).save(
        Brand.create({ name, createdBy: actor }),
      ),
    );
    summary.brandsCreated += 1;
    return created;
  }

  private async ensureModel(
    name: string,
    brandId: string,
    actor: string,
    summary: FleetSeedSummary,
  ): Promise<Model> {
    const existing = await this.modelRepository.findByName(name);
    if (existing) {
      return existing;
    }

    const created = await this.unitOfWork.execute((manager) =>
      this.scopedModelRepository(manager).save(
        Model.create({ name, brandId, createdBy: actor }),
      ),
    );
    summary.modelsCreated += 1;
    return created;
  }

  private async ensureVehicle(
    entry: VehicleSeedEntry,
    modelId: string,
    actor: string,
    summary: FleetSeedSummary,
  ): Promise<void> {
    const licensePlate = entry.licensePlate.toUpperCase();
    const existing =
      await this.vehicleRepository.findByLicensePlate(licensePlate);
    if (existing) {
      summary.vehiclesSkipped += 1;
      return;
    }

    await this.unitOfWork.execute((manager) =>
      this.scopedVehicleRepository(manager).save(
        Vehicle.create({
          licensePlate,
          chassis: entry.chassis,
          renavam: entry.renavam,
          year: entry.year,
          modelId,
          createdBy: actor,
        }),
      ),
    );
    summary.vehiclesCreated += 1;
  }

  private scopedBrandRepository(manager: EntityManager): BrandRepository {
    return BrandTypeOrmRepository.create(manager.getRepository(BrandOrmEntity));
  }

  private scopedModelRepository(manager: EntityManager): ModelRepository {
    return ModelTypeOrmRepository.create(manager.getRepository(ModelOrmEntity));
  }

  private scopedVehicleRepository(manager: EntityManager): VehicleRepository {
    return VehicleTypeOrmRepository.create(
      manager.getRepository(VehicleOrmEntity),
    );
  }
}
