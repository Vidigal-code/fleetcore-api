/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { ConflictException, NotFoundException } from '@nestjs/common';

import { AuditService } from '../../../src/modules/audit/audit.service';
import { BrandsService } from '../../../src/modules/fleet/application/brands.service';
import { Brand } from '../../../src/modules/fleet/domain/brand.aggregate';
import type { BrandRepository } from '../../../src/modules/fleet/domain/brand.repository';
import { UnitOfWork } from '../../../src/shared/unit-of-work/unit-of-work';
import { BrandTypeOrmRepository } from '../../../src/modules/fleet/infrastructure/repositories/brand.typeorm.repository';
import { EventBusService } from '../../../src/shared/domain/events/event-bus.service';
import { FeatureToggleService } from '../../../src/shared/features/feature-toggle.service';
import {
  BRAND_EVENT_REMOVED,
  AUDIT_ENTITY_BRAND,
} from '../../../src/modules/fleet/fleet.constants';

describe('BrandsService', () => {
  let service: BrandsService;
  let repository: jest.Mocked<BrandRepository>;
  let unitOfWork: jest.Mocked<UnitOfWork>;
  let auditService: jest.Mocked<AuditService>;
  let eventBus: jest.Mocked<EventBusService>;
  let featureToggleService: jest.Mocked<FeatureToggleService>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      list: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    unitOfWork = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<UnitOfWork>;

    auditService = {
      record: jest.fn(),
    } as unknown as jest.Mocked<AuditService>;

    eventBus = {
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBusService>;

    featureToggleService = {
      runIfEnabled: jest.fn((_, task: () => unknown) => task()),
    } as unknown as jest.Mocked<FeatureToggleService>;

    service = new BrandsService(
      repository,
      unitOfWork,
      auditService,
      eventBus,
      featureToggleService,
    );
  });

  afterEach(() => jest.restoreAllMocks());

  it('throws on duplicated brand name', async () => {
    repository.findByName.mockResolvedValue(
      Brand.create({ name: 'Ford', createdBy: 'tester' }),
    );

    await expect(
      service.create({ name: 'Ford' }, 'tester'),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('removes brand and writes audit trail', async () => {
    const brand = Brand.create({ name: 'Ford', createdBy: 'tester' });
    repository.findById.mockResolvedValue(brand);

    const scopedRepository = {
      save: jest.fn(),
      remove: jest.fn().mockResolvedValue(undefined),
    } as unknown as BrandRepository;

    jest
      .spyOn(BrandTypeOrmRepository, 'create')
      .mockReturnValue(scopedRepository);
    unitOfWork.execute.mockImplementation(async (work) => {
      const manager = { getRepository: jest.fn() } as any;
      return work(manager);
    });

    await service.remove(brand.id, 'tester');

    expect(scopedRepository.remove).toHaveBeenCalledWith(brand);
    expect(auditService.record).toHaveBeenCalledWith(
      expect.objectContaining({
        action: BRAND_EVENT_REMOVED,
        entity: AUDIT_ENTITY_BRAND,
        entityId: brand.id,
      }),
    );
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({ name: BRAND_EVENT_REMOVED }),
    );
  });

  it('throws when updating a missing brand', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      service.update('missing', { name: 'New' }, 'tester'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
