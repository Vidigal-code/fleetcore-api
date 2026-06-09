import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';

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
  brand?: BrandOrmEntity | null;

  @Column({ name: 'brand_id', type: 'uuid', nullable: true })
  brandId?: string | null;

  @OneToMany(() => VehicleOrmEntity, (vehicle) => vehicle.model)
  vehicles?: VehicleOrmEntity[];
}
