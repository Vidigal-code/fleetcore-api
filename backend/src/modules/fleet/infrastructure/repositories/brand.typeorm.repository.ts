import { Repository } from 'typeorm';

import { Brand } from '../../domain/brand.aggregate';
import { BrandRepository } from '../../domain/brand.repository';
import { BrandOrmEntity } from '../entities/brand.orm-entity';
import { BrandMapper } from '../mappers/brand.mapper';

export class BrandTypeOrmRepository implements BrandRepository {
  constructor(private readonly repository: Repository<BrandOrmEntity>) {}

  static create(repository: Repository<BrandOrmEntity>): BrandRepository {
    return new BrandTypeOrmRepository(repository);
  }

  async findById(id: string): Promise<Brand | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? BrandMapper.toDomain(entity) : null;
  }

  async findByName(name: string): Promise<Brand | null> {
    const entity = await this.repository.findOne({ where: { name } });
    return entity ? BrandMapper.toDomain(entity) : null;
  }

  async list(): Promise<Brand[]> {
    const entities = await this.repository.find({ order: { name: 'ASC' } });
    return entities.map((entity) => BrandMapper.toDomain(entity));
  }

  async save(brand: Brand): Promise<Brand> {
    const saved = await this.repository.save(BrandMapper.toOrm(brand));
    return BrandMapper.toDomain(saved);
  }

  async remove(brand: Brand): Promise<void> {
    await this.repository.delete(brand.id);
  }
}
