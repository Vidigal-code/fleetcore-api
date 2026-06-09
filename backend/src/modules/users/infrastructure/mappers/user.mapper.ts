import { User } from '../../domain/user.aggregate';
import { UserOrmEntity } from '../entities/user.orm-entity';

export const UserMapper = {
  toDomain(entity: UserOrmEntity): User {
    return User.restore({
      id: entity.id,
      nickname: entity.nickname,
      name: entity.name,
      email: entity.email,
      passwordHash: entity.passwordHash,
      roles: entity.roles,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdBy: entity.createdBy,
    });
  },
  toOrm(user: User): UserOrmEntity {
    const entity = new UserOrmEntity();
    entity.id = user.id;
    entity.nickname = user.nickname;
    entity.name = user.name;
    entity.email = user.email;
    entity.passwordHash = user.passwordHash;
    entity.roles = user.roles;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    entity.createdBy = user.createdBy;
    return entity;
  },
};
