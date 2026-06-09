import { Model } from '../../domain/model.aggregate';
import { ModelOrmEntity } from '../entities/model.orm-entity';
import { BrandOrmEntity } from '../entities/brand.orm-entity';

export const ModelMapper = {
  toDomain(entity: ModelOrmEntity): Model {
    return Model.restore({
      id: entity.id,
      name: entity.name,
      brandId: entity.brandId ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdBy: entity.createdBy,
    });
  },
  toOrm(model: Model): ModelOrmEntity {
    const entity = new ModelOrmEntity();
    entity.id = model.id;
    entity.name = model.name;
    entity.brand = model.brandId
      ? ({ id: model.brandId } as BrandOrmEntity)
      : null;
    entity.brandId = model.brandId ?? null;
    entity.createdAt = model.createdAt;
    entity.updatedAt = model.updatedAt;
    entity.createdBy = model.createdBy;
    return entity;
  },
};
