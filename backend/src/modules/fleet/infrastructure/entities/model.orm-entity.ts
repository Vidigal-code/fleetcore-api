import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';

import { AuditableEntity } from '../../../../shared/domain/base.entity';
import { BrandOrmEntity } from './brand.orm-entity';
import { VehicleOrmEntity } from './vehicle.orm-entity';

@Entity({ name: 'models' })
export class ModelOrmEntity extends AuditableEntity {
  @Column()
  @Index()
  name!: string;

  @ManyToOne(() => BrandOrmEntity, (brand) => brand.models, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'brand_id' })
  brand?: BrandOrmEntity | null;

  @RelationId((model: ModelOrmEntity) => model.brand)
  brandId?: string | null;

  @OneToMany(() => VehicleOrmEntity, (vehicle) => vehicle.model)
  vehicles?: VehicleOrmEntity[];
}
