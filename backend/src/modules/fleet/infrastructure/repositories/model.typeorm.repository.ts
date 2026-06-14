import { Repository } from 'typeorm';

import { Model } from '../../domain/model.aggregate';
import { ModelRepository } from '../../domain/model.repository';
import { ModelOrmEntity } from '../entities/model.orm-entity';
import { ModelMapper } from '../mappers/model.mapper';

export class ModelTypeOrmRepository implements ModelRepository {
  constructor(private readonly repository: Repository<ModelOrmEntity>) {}

  static create(repository: Repository<ModelOrmEntity>): ModelRepository {
    return new ModelTypeOrmRepository(repository);
  }

  async findById(id: string): Promise<Model | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? ModelMapper.toDomain(entity) : null;
  }

  async list(): Promise<Model[]> {
    const entities = await this.repository.find({ order: { name: 'ASC' } });
    return entities.map((entity) => ModelMapper.toDomain(entity));
  }

  async listByBrand(brandId: string): Promise<Model[]> {
    // `brandId` é uma propriedade @RelationId (somente leitura) e não pode ser
    // usada no `where` do find. Filtramos pela coluna FK real (`brand_id`) via
    // query builder, mesmo padrão usado na busca de veículos.
    const entities = await this.repository
      .createQueryBuilder('model')
      .where('model.brand_id = :brandId', { brandId })
      .orderBy('model.name', 'ASC')
      .getMany();
    return entities.map((entity) => ModelMapper.toDomain(entity));
  }

  async findByName(name: string): Promise<Model | null> {
    const entity = await this.repository.findOne({ where: { name } });
    return entity ? ModelMapper.toDomain(entity) : null;
  }

  async save(model: Model): Promise<Model> {
    const saved = await this.repository.save(ModelMapper.toOrm(model));
    return ModelMapper.toDomain(saved);
  }

  async remove(model: Model): Promise<void> {
    await this.repository.delete(model.id);
  }
}
