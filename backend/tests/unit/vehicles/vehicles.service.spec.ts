/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */

import { ConfigService } from '@nestjs/config';

import { AuditService } from '../../../src/modules/audit/audit.service';
import { VehiclesService } from '../../../src/modules/fleet/application/vehicles.service';
import { Model } from '../../../src/modules/fleet/domain/model.aggregate';
import type { ModelRepository } from '../../../src/modules/fleet/domain/model.repository';
import { Vehicle } from '../../../src/modules/fleet/domain/vehicle.aggregate';
import type {
  VehicleRepository,
  VehicleSearchResult,
} from '../../../src/modules/fleet/domain/vehicle.repository';
import { CreateVehicleDto } from '../../../src/modules/fleet/dto/create-vehicle.dto';
import { RepositoryCacheService } from '../../../src/shared/cache/repository-cache.service';
import { UnitOfWork } from '../../../src/shared/unit-of-work/unit-of-work';
import { VehicleTypeOrmRepository } from '../../../src/modules/fleet/infrastructure/repositories/vehicle.typeorm.repository';
import { EventBusService } from '../../../src/shared/domain/events';
import { FeatureToggleService } from '../../../src/shared/features';
import {
  VEHICLE_EVENT_CREATED,
  VEHICLE_CACHE_NAMESPACE,
} from '../../../src/modules/fleet/fleet.constants';

describe('VehiclesService', () => {
  let service: VehiclesService;
  let vehicleRepository: jest.Mocked<VehicleRepository>;
  let modelRepository: jest.Mocked<ModelRepository>;
  let unitOfWork: jest.Mocked<UnitOfWork>;
  let auditService: jest.Mocked<AuditService>;
  let repositoryCache: jest.Mocked<RepositoryCacheService>;
  let configService: jest.Mocked<ConfigService>;
  let eventBus: jest.Mocked<EventBusService>;
  let featureToggleService: jest.Mocked<FeatureToggleService>;

  beforeEach(() => {
    vehicleRepository = {
      findById: jest.fn(),
      findByLicensePlate: jest.fn(),
      findByChassis: jest.fn(),
      findByRenavam: jest.fn(),
      list: jest.fn(),
      listByModel: jest.fn(),
      search: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    modelRepository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      list: jest.fn(),
      listByBrand: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    unitOfWork = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<UnitOfWork>;

    auditService = {
      record: jest.fn(),
    } as unknown as jest.Mocked<AuditService>;

    repositoryCache = {
      fetch: jest.fn(),
      invalidate: jest.fn(),
    } as unknown as jest.Mocked<RepositoryCacheService>;

    configService = {
      get: jest.fn().mockReturnValue(120),
    } as unknown as jest.Mocked<ConfigService>;

    eventBus = {
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBusService>;

    featureToggleService = {
      isEnabled: jest.fn().mockReturnValue(true),
      runIfEnabled: jest.fn((_, task: () => unknown) => task()),
    } as unknown as jest.Mocked<FeatureToggleService>;

    service = new VehiclesService(
      vehicleRepository,
      modelRepository,
      unitOfWork,
      auditService,
      repositoryCache,
      eventBus,
      featureToggleService,
      configService,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('creates a vehicle, invalidates cache, and publishes events', async () => {
    const input: CreateVehicleDto = {
      licensePlate: 'ABC1D23',
      chassis: 'CHASSIS123',
      renavam: 'RENAVAM123',
      year: 2023,
      modelId: 'model-1',
    };

    modelRepository.findById.mockResolvedValue(
      Model.create({ name: 'Model X', brandId: null, createdBy: 'system' }),
    );
    vehicleRepository.findByLicensePlate.mockResolvedValue(null);
    vehicleRepository.findByChassis.mockResolvedValue(null);
    vehicleRepository.findByRenavam.mockResolvedValue(null);

    const savedVehicle = Vehicle.create({
      licensePlate: input.licensePlate,
      chassis: input.chassis,
      renavam: input.renavam,
      year: input.year,
      modelId: input.modelId,
      createdBy: 'tester',
    });

    const scopedRepository = {
      save: jest.fn().mockResolvedValue(savedVehicle),
      remove: jest.fn(),
    } as unknown as VehicleRepository;

    jest
      .spyOn(VehicleTypeOrmRepository, 'create')
      .mockReturnValue(scopedRepository);

    unitOfWork.execute.mockImplementation((work) => {
      const manager = {
        getRepository: jest.fn(),
      } as any;
      return work(manager);
    });

    const result = await service.create(input, 'tester');

    expect(modelRepository.findById).toHaveBeenCalledWith('model-1');
    expect(scopedRepository.save).toHaveBeenCalled();
    expect(repositoryCache.invalidate).toHaveBeenCalledWith(
      VEHICLE_CACHE_NAMESPACE,
    );
    expect(auditService.record).toHaveBeenCalledWith(
      expect.objectContaining({
        action: VEHICLE_EVENT_CREATED,
        entityId: result.id,
      }),
    );
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({ name: VEHICLE_EVENT_CREATED }),
    );
    expect(result.licensePlate).toBe('ABC1D23');
  });

  it('delegates search to repository cache when enabled', async () => {
    const vehicle = Vehicle.create({
      licensePlate: 'ABC1D23',
      chassis: 'CHASSIS',
      renavam: 'RENAVAM',
      year: 2024,
      modelId: 'model-2',
      createdBy: 'tester',
    });

    const searchResult: VehicleSearchResult = {
      items: [vehicle],
      total: 1,
      page: 1,
      limit: 20,
    };

    repositoryCache.fetch.mockImplementation(async (options) =>
      options.loader(),
    );
    vehicleRepository.search.mockResolvedValue(searchResult);

    const firstCall = await service.search({
      licensePlate: 'ABC1D23',
      page: 1,
      limit: 20,
    });

    expect(repositoryCache.fetch).toHaveBeenCalledTimes(1);
    expect(vehicleRepository.search).toHaveBeenCalledTimes(1);
    expect(firstCall.items[0].licensePlate).toBe('ABC1D23');
  });
});
