import { Model } from '../../domain/model.aggregate';
import { ModelOrmEntity } from '../entities/model.orm-entity';

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
    entity.brandId = model.brandId;
    entity.createdAt = model.createdAt;
    entity.updatedAt = model.updatedAt;
    entity.createdBy = model.createdBy;
    return entity;
  },
};
