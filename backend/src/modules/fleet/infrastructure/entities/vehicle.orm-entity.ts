import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';

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
  @JoinColumn({ name: 'model_id' })
  model!: ModelOrmEntity;

  @RelationId((vehicle: VehicleOrmEntity) => vehicle.model)
  modelId!: string;
}
