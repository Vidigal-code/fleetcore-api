/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { VehiclesController } from '../../src/modules/fleet/interfaces/http/vehicles.controller';
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

describe('VehiclesController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
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
      controllers: [VehiclesController],
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
            delete: jest.fn(),
            deleteByPattern: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest
              .fn()
              .mockImplementation((key: string) =>
                key === 'redis.ttlSeconds' ? 60 : undefined,
              ),
          },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();

    dataSource = moduleRef.get(DataSource);
    await dataSource.getRepository(ModelOrmEntity).save({
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Integration Model',
      brandId: null,
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  afterAll(async () => {
    await app?.close();
  });

  it('creates and lists vehicles', async () => {
    const creation = await request(app.getHttpServer()).post('/vehicles').send({
      licensePlate: 'ABC1D23',
      chassis: 'CHASSISXYZ',
      renavam: 'RENAVAMXYZ',
      year: 2024,
      modelId: '11111111-1111-4111-8111-111111111111',
    });

    expect({ status: creation.status, body: creation.body }).toEqual(
      expect.objectContaining({ status: 201 }),
    );
  });
});
