import { Brand } from '../../domain/brand.aggregate';
import { BrandOrmEntity } from '../entities/brand.orm-entity';

export const BrandMapper = {
  toDomain(entity: BrandOrmEntity): Brand {
    return Brand.restore({
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdBy: entity.createdBy,
    });
  },
  toOrm(brand: Brand): BrandOrmEntity {
    const entity = new BrandOrmEntity();
    entity.id = brand.id;
    entity.name = brand.name;
    entity.createdAt = brand.createdAt;
    entity.updatedAt = brand.updatedAt;
    entity.createdBy = brand.createdBy;
    return entity;
  },
};
