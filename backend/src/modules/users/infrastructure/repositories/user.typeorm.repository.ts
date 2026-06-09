import { Repository } from 'typeorm';

import { User } from '../../domain/user.aggregate';
import { UserRepository } from '../../domain/user.repository';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { UserMapper } from '../mappers/user.mapper';

export class UserTypeOrmRepository implements UserRepository {
  constructor(private readonly repository: Repository<UserOrmEntity>) {}

  static create(repository: Repository<UserOrmEntity>) {
    return new UserTypeOrmRepository(repository);
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByNickname(nickname: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { nickname } });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async save(user: User): Promise<User> {
    const saved = await this.repository.save(UserMapper.toOrm(user));
    return UserMapper.toDomain(saved);
  }

  async listAdmins(): Promise<User[]> {
    const entities = await this.repository
      .createQueryBuilder('user')
      .where('user.roles LIKE :role', { role: '%admin%' })
      .getMany();
    return entities.map((entity) => UserMapper.toDomain(entity));
  }
}
