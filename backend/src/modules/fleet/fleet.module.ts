import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuditModule } from '../audit/audit.module';
import { MessagingModule } from '../messaging/messaging.module';
import { BrandsService } from './application/brands.service';
import { ModelsService } from './application/models.service';
import { VehiclesService } from './application/vehicles.service';
import { FleetSeederService } from './application/fleet-seeder.service';
import {
  BRAND_REPOSITORY,
  MODEL_REPOSITORY,
  VEHICLE_REPOSITORY,
} from './fleet.constants';
import { BrandRepository } from './domain/brand.repository';
import { ModelRepository } from './domain/model.repository';
import { VehicleRepository } from './domain/vehicle.repository';
import { BrandTypeOrmRepository } from './infrastructure/repositories/brand.typeorm.repository';
import { ModelTypeOrmRepository } from './infrastructure/repositories/model.typeorm.repository';
import { VehicleTypeOrmRepository } from './infrastructure/repositories/vehicle.typeorm.repository';
import { BrandOrmEntity } from './infrastructure/entities/brand.orm-entity';
import { ModelOrmEntity } from './infrastructure/entities/model.orm-entity';
import { VehicleOrmEntity } from './infrastructure/entities/vehicle.orm-entity';
import { BrandsController } from './interfaces/http/brands.controller';
import { ModelsController } from './interfaces/http/models.controller';
import { VehiclesController } from './interfaces/http/vehicles.controller';
import { FleetDomainEventListener } from './application/listeners/fleet-domain-event.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BrandOrmEntity,
      ModelOrmEntity,
      VehicleOrmEntity,
    ]),
    AuditModule,
    MessagingModule,
  ],
  controllers: [BrandsController, ModelsController, VehiclesController],
  providers: [
    BrandsService,
    ModelsService,
    VehiclesService,
    FleetSeederService,
    FleetDomainEventListener,
    {
      provide: BRAND_REPOSITORY,
      useFactory: (repository: Repository<BrandOrmEntity>): BrandRepository =>
        BrandTypeOrmRepository.create(repository),
      inject: [getRepositoryToken(BrandOrmEntity)],
    },
    {
      provide: MODEL_REPOSITORY,
      useFactory: (repository: Repository<ModelOrmEntity>): ModelRepository =>
        ModelTypeOrmRepository.create(repository),
      inject: [getRepositoryToken(ModelOrmEntity)],
    },
    {
      provide: VEHICLE_REPOSITORY,
      useFactory: (
        repository: Repository<VehicleOrmEntity>,
      ): VehicleRepository => VehicleTypeOrmRepository.create(repository),
      inject: [getRepositoryToken(VehicleOrmEntity)],
    },
  ],
  exports: [BrandsService, ModelsService, VehiclesService, FleetSeederService],
})
export class FleetModule {}
