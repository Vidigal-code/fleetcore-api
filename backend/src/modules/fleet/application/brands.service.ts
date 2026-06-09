import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { AuditService } from '../../audit/audit.service';
import { UnitOfWork } from '../../../shared/unit-of-work/unit-of-work';
import { BRAND_REPOSITORY } from '../fleet.constants';
import { Brand } from '../domain/brand.aggregate';
import type { BrandRepository } from '../domain/brand.repository';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { UpdateBrandDto } from '../dto/update-brand.dto';
import { BrandOrmEntity } from '../infrastructure/entities/brand.orm-entity';
import { BrandTypeOrmRepository } from '../infrastructure/repositories/brand.typeorm.repository';
import { EventBusService } from '../../../shared/domain/events/event-bus.service';
import { FeatureToggleService } from '../../../shared/features/feature-toggle.service';
import { BrandCreatedEvent, BrandDeletedEvent, BrandUpdatedEvent } from '../domain/events/brand-events';

@Injectable()
export class BrandsService {
  constructor(
    @Inject(BRAND_REPOSITORY) private readonly repository: BrandRepository,
    private readonly unitOfWork: UnitOfWork,
    private readonly auditService: AuditService,
    private readonly eventBus: EventBusService,
    private readonly featureToggleService: FeatureToggleService,
  ) {}

  list() {
    return this.repository.list();
  }

  findById(id: string) {
    return this.repository.findById(id);
  }

  async create(input: CreateBrandDto, createdBy: string) {
    const existing = await this.repository.findByName(input.name);
    if (existing) {
      throw new ConflictException('Brand already exists');
    }

    const brand = Brand.create({ name: input.name, createdBy });

    const created = await this.unitOfWork.execute((manager) =>
      this.scopedRepository(manager).save(brand),
    );

    await this.auditService.record({
      action: 'brand.created',
      entity: 'brand',
      entityId: created.id,
      actor: createdBy,
      payload: { name: created.name },
    });

    await this.featureToggleService.runIfEnabled('domainEvents', () =>
      this.eventBus.publish(
        new BrandCreatedEvent({
          brandId: created.id,
          actor: createdBy,
          snapshot: created,
        }),
      ),
    );

    return created;
  }

  async update(id: string, input: UpdateBrandDto, actor: string) {
    const brand = await this.repository.findById(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    if (input.name && input.name !== brand.name) {
      const duplicated = await this.repository.findByName(input.name);
      if (duplicated && duplicated.id !== id) {
        throw new ConflictException('Brand name already in use');
      }
      brand.rename(input.name);
    }

    const updated = await this.unitOfWork.execute((manager) =>
      this.scopedRepository(manager).save(brand),
    );

    await this.auditService.record({
      action: 'brand.updated',
      entity: 'brand',
      entityId: updated.id,
      actor,
      payload: { name: updated.name },
    });

    await this.featureToggleService.runIfEnabled('domainEvents', () =>
      this.eventBus.publish(
        new BrandUpdatedEvent({
          brandId: updated.id,
          actor,
          snapshot: updated,
        }),
      ),
    );

    return updated;
  }

  async remove(id: string, actor: string) {
    const brand = await this.repository.findById(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    await this.unitOfWork.execute(async (manager) => {
      await this.scopedRepository(manager).remove(brand);
    });

    await this.auditService.record({
      action: 'brand.removed',
      entity: 'brand',
      entityId: id,
      actor,
      payload: { name: brand.name },
    });

    await this.featureToggleService.runIfEnabled('domainEvents', () =>
      this.eventBus.publish(
        new BrandDeletedEvent({
          brandId: brand.id,
          actor,
          snapshot: brand,
        }),
      ),
    );
  }

  private scopedRepository(manager: EntityManager): BrandRepository {
    return BrandTypeOrmRepository.create(manager.getRepository(BrandOrmEntity));
  }
}
