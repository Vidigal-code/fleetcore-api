import { Column, Entity, Index } from 'typeorm';

import { AuditableEntity } from '../../../../shared/domain/base.entity';
import { UserRole } from '../../domain/user-role.enum';

@Entity({ name: 'users' })
export class UserOrmEntity extends AuditableEntity {
  @Column({ unique: true })
  @Index({ unique: true })
  nickname!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  @Index({ unique: true })
  email!: string;

  @Column({ name: 'password_hash' })
  passwordHash!: string;

  @Column('simple-array')
  roles!: UserRole[];
}
