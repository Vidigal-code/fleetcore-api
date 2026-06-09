import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { AuditService } from '../../audit/audit.service';
import { UnitOfWork } from '../../../shared/unit-of-work/unit-of-work';
import { BRAND_REPOSITORY, MODEL_REPOSITORY } from '../fleet.constants';
import type { BrandRepository } from '../domain/brand.repository';
import { Model } from '../domain/model.aggregate';
import type { ModelRepository } from '../domain/model.repository';
import { CreateModelDto } from '../dto/create-model.dto';
import { UpdateModelDto } from '../dto/update-model.dto';
import { ModelOrmEntity } from '../infrastructure/entities/model.orm-entity';
import { ModelTypeOrmRepository } from '../infrastructure/repositories/model.typeorm.repository';
import { EventBusService } from '../../../shared/domain/events';
import { FeatureToggleService } from '../../../shared/features';
import { ModelCreatedEvent, ModelDeletedEvent, ModelUpdatedEvent } from '../domain/events';

@Injectable()
export class ModelsService {
  constructor(
    @Inject(MODEL_REPOSITORY) private readonly repository: ModelRepository,
    @Inject(BRAND_REPOSITORY) private readonly brandRepository: BrandRepository,
    private readonly unitOfWork: UnitOfWork,
    private readonly auditService: AuditService,
    private readonly eventBus: EventBusService,
    private readonly featureToggleService: FeatureToggleService,
  ) {}

  list() {
    return this.repository.list();
  }

  listByBrand(brandId: string) {
    return this.repository.listByBrand(brandId);
  }

  findById(id: string) {
    return this.repository.findById(id);
  }

  async create(input: CreateModelDto, actor: string) {
    if (input.brandId) {
      const brand = await this.brandRepository.findById(input.brandId);
      if (!brand) {
        throw new NotFoundException('Brand not found');
      }
    }

    const existing = await this.repository.findByName(input.name);
    if (existing) {
      throw new ConflictException('Model already exists');
    }

    const model = Model.create({
      name: input.name,
      brandId: input.brandId ?? null,
      createdBy: actor,
    });

    const created = await this.unitOfWork.execute((manager) =>
      this.scopedRepository(manager).save(model),
    );

    await this.auditService.record({
      action: 'model.created',
      entity: 'model',
      entityId: created.id,
      actor,
      payload: { name: created.name, brandId: created.brandId },
    });

    await this.featureToggleService.runIfEnabled('domainEvents', () =>
      this.eventBus.publish(
        new ModelCreatedEvent({
          modelId: created.id,
          actor,
          snapshot: created,
        }),
      ),
    );

    return created;
  }

  async update(id: string, input: UpdateModelDto, actor: string) {
    const model = await this.repository.findById(id);
    if (!model) {
      throw new NotFoundException('Model not found');
    }

    if (input.brandId) {
      const brand = await this.brandRepository.findById(input.brandId);
      if (!brand) {
        throw new NotFoundException('Brand not found');
      }
      model.assignBrand(input.brandId);
    }

    if (input.name && input.name !== model.name) {
      const duplicate = await this.repository.findByName(input.name);
      if (duplicate && duplicate.id !== id) {
        throw new ConflictException('Model name already in use');
      }
      model.rename(input.name);
    }

    if (input.brandId === null) {
      model.assignBrand(null);
    }

    const updated = await this.unitOfWork.execute((manager) =>
      this.scopedRepository(manager).save(model),
    );

    await this.auditService.record({
      action: 'model.updated',
      entity: 'model',
      entityId: updated.id,
      actor,
      payload: { name: updated.name, brandId: updated.brandId },
    });

    await this.featureToggleService.runIfEnabled('domainEvents', () =>
      this.eventBus.publish(
        new ModelUpdatedEvent({
          modelId: updated.id,
          actor,
          snapshot: updated,
        }),
      ),
    );

    return updated;
  }

  async remove(id: string, actor: string) {
    const model = await this.repository.findById(id);
    if (!model) {
      throw new NotFoundException('Model not found');
    }

    await this.unitOfWork.execute(async (manager) => {
      await this.scopedRepository(manager).remove(model);
    });

    await this.auditService.record({
      action: 'model.removed',
      entity: 'model',
      entityId: id,
      actor,
      payload: { name: model.name },
    });

    await this.featureToggleService.runIfEnabled('domainEvents', () =>
      this.eventBus.publish(
        new ModelDeletedEvent({
          modelId: model.id,
          actor,
          snapshot: model,
        }),
      ),
    );
  }

  private scopedRepository(manager: EntityManager): ModelRepository {
    return ModelTypeOrmRepository.create(manager.getRepository(ModelOrmEntity));
  }
}
