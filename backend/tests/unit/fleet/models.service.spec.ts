/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */

import { ConflictException, NotFoundException } from '@nestjs/common';

import { AuditService } from '../../../src/modules/audit/audit.service';
import { ModelsService } from '../../../src/modules/fleet/application/models.service';
import { Brand } from '../../../src/modules/fleet/domain/brand.aggregate';
import { Model } from '../../../src/modules/fleet/domain/model.aggregate';
import type { ModelRepository } from '../../../src/modules/fleet/domain/model.repository';
import type { BrandRepository } from '../../../src/modules/fleet/domain/brand.repository';
import { UnitOfWork } from '../../../src/shared/unit-of-work/unit-of-work';
import { ModelTypeOrmRepository } from '../../../src/modules/fleet/infrastructure/repositories/model.typeorm.repository';
import { EventBusService } from '../../../src/shared/domain/events/event-bus.service';
import { FeatureToggleService } from '../../../src/shared/features/feature-toggle.service';
import {
  AUDIT_ENTITY_MODEL,
  MODEL_EVENT_CREATED,
} from '../../../src/modules/fleet/fleet.constants';

describe('ModelsService', () => {
  let service: ModelsService;
  let modelRepository: jest.Mocked<ModelRepository>;
  let brandRepository: jest.Mocked<BrandRepository>;
  let unitOfWork: jest.Mocked<UnitOfWork>;
  let auditService: jest.Mocked<AuditService>;
  let eventBus: jest.Mocked<EventBusService>;
  let featureToggleService: jest.Mocked<FeatureToggleService>;

  beforeEach(() => {
    modelRepository = {
      list: jest.fn(),
      listByBrand: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    brandRepository = {
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

    service = new ModelsService(
      modelRepository,
      brandRepository,
      unitOfWork,
      auditService,
      eventBus,
      featureToggleService,
    );
  });

  afterEach(() => jest.restoreAllMocks());

  it('validates brand existence when associating a model', async () => {
    brandRepository.findById.mockResolvedValue(null);

    await expect(
      service.create({ name: 'Bronco', brandId: 'missing' } as any, 'tester'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws conflict when model name already exists', async () => {
    modelRepository.findByName.mockResolvedValue(
      Model.create({ name: 'Unique', brandId: null, createdBy: 'system' }),
    );

    await expect(
      service.create({ name: 'Unique' } as any, 'tester'),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('persists model inside a transactional boundary', async () => {
    modelRepository.findByName.mockResolvedValue(null);
    brandRepository.findById.mockResolvedValue(
      Brand.create({ name: 'Ford', createdBy: 'system' }),
    );

    const scopedRepository = {
      save: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
      remove: jest.fn(),
    } as unknown as ModelRepository;

    jest
      .spyOn(ModelTypeOrmRepository, 'create')
      .mockReturnValue(scopedRepository);

    unitOfWork.execute.mockImplementation((work) => {
      const manager = { getRepository: jest.fn() } as any;
      return work(manager);
    });

    const result = await service.create(
      { name: 'Ranger', brandId: 'brand-1' },
      'tester',
    );

    expect(scopedRepository.save).toHaveBeenCalledTimes(1);
    expect(auditService.record).toHaveBeenCalledWith(
      expect.objectContaining({
        action: MODEL_EVENT_CREATED,
        actor: 'tester',
        entity: AUDIT_ENTITY_MODEL,
      }),
    );
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({ name: MODEL_EVENT_CREATED }),
    );
    expect(result.name).toBe('Ranger');
  });
});
