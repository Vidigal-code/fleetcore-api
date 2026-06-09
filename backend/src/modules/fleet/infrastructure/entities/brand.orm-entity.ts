import { Column, Entity, Index, OneToMany } from 'typeorm';

import { AuditableEntity } from '../../../../shared/domain/base.entity';
import { ModelOrmEntity } from './model.orm-entity';

@Entity({ name: 'brands' })
export class BrandOrmEntity extends AuditableEntity {
  @Column({ unique: true })
  @Index({ unique: true })
  name!: string;

  @OneToMany(() => ModelOrmEntity, (model) => model.brand)
  models?: ModelOrmEntity[];
}
