import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { VehiclesService } from '../../src/modules/fleet/application/vehicles.service';
import { UnitOfWork } from '../../src/shared/unit-of-work/unit-of-work';
import { VehicleOrmEntity } from '../../src/modules/fleet/infrastructure/entities/vehicle.orm-entity';
import { ModelOrmEntity } from '../../src/modules/fleet/infrastructure/entities/model.orm-entity';
import { BrandOrmEntity } from '../../src/modules/fleet/infrastructure/entities/brand.orm-entity';
import {
  VEHICLE_REPOSITORY,
  MODEL_REPOSITORY,
  BRAND_REPOSITORY,
} from '../../src/modules/fleet/fleet.constants';
import { VehicleTypeOrmRepository } from '../../src/modules/fleet/infrastructure/repositories/vehicle.typeorm.repository';
import { ModelTypeOrmRepository } from '../../src/modules/fleet/infrastructure/repositories/model.typeorm.repository';
import { BrandTypeOrmRepository } from '../../src/modules/fleet/infrastructure/repositories/brand.typeorm.repository';
import { AuditService } from '../../src/modules/audit/audit.service';
import { MessagingService } from '../../src/modules/messaging/messaging.service';
import { RedisService } from '../../src/shared/cache/redis.service';

describe('VehiclesService (integration)', () => {
  let dataSource: DataSource;
  let vehiclesService: VehiclesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [VehicleOrmEntity, ModelOrmEntity, BrandOrmEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([
          VehicleOrmEntity,
          ModelOrmEntity,
          BrandOrmEntity,
        ]),
      ],
      providers: [
        VehiclesService,
        UnitOfWork,
        {
          provide: VEHICLE_REPOSITORY,
          useFactory: (ds: DataSource) =>
            VehicleTypeOrmRepository.create(ds.getRepository(VehicleOrmEntity)),
          inject: [DataSource],
        },
        {
          provide: MODEL_REPOSITORY,
          useFactory: (ds: DataSource) =>
            ModelTypeOrmRepository.create(ds.getRepository(ModelOrmEntity)),
          inject: [DataSource],
        },
        {
          provide: BRAND_REPOSITORY,
          useFactory: (ds: DataSource) =>
            BrandTypeOrmRepository.create(ds.getRepository(BrandOrmEntity)),
          inject: [DataSource],
        },
        { provide: AuditService, useValue: { record: jest.fn() } },
        { provide: MessagingService, useValue: { publish: jest.fn() } },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn(),
            deleteByPattern: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue(60) },
        },
      ],
    }).compile();

    dataSource = moduleRef.get(DataSource);
    vehiclesService = moduleRef.get(VehiclesService);
  });

  it('persists vehicles via TypeORM repositories', async () => {
    const modelRepo = dataSource.getRepository(ModelOrmEntity);
    const model = await modelRepo.save({
      id: 'model-1',
      name: 'Model S',
      brandId: null,
      createdBy: 'tester',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const vehicle = await vehiclesService.create(
      {
        licensePlate: 'ABC1D23',
        chassis: 'CHASSIS123',
        renavam: 'RENAVAM123',
        year: 2024,
        modelId: model.id,
      },
      'tester',
    );

    const vehicleRecord = await dataSource
      .getRepository(VehicleOrmEntity)
      .findOne({ where: { id: vehicle.id } });

    expect(vehicleRecord).toBeTruthy();
    expect(vehicleRecord?.licensePlate).toBe('ABC1D23');
  });
});
