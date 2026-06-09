import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { AuditableEntity } from '../../../../shared/domain/base.entity';
import { ModelOrmEntity } from './model.orm-entity';

@Entity({ name: 'vehicles' })
export class VehicleOrmEntity extends AuditableEntity {
  @Column({ name: 'license_plate', unique: true })
  @Index({ unique: true })
  licensePlate!: string;

  @Column({ unique: true })
  @Index({ unique: true })
  chassis!: string;

  @Column({ unique: true })
  @Index({ unique: true })
  renavam!: string;

  @Column()
  year!: number;

  @ManyToOne(() => ModelOrmEntity, (model) => model.vehicles, {
    onDelete: 'CASCADE',
  })
  model!: ModelOrmEntity;

  @Column({ name: 'model_id', type: 'uuid' })
  modelId!: string;
}
