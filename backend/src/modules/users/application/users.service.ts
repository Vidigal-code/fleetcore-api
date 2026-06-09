import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EntityManager } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UnitOfWork } from '../../../shared/unit-of-work/unit-of-work';
import { User } from '../domain/user.aggregate';
import type { UserRepository } from '../domain/user.repository';
import { UserRole } from '../domain/user-role.enum';
import { UserOrmEntity } from '../infrastructure/entities/user.orm-entity';
import { UserTypeOrmRepository } from '../infrastructure/repositories/user.typeorm.repository';
import { USER_REPOSITORY } from '../users.constants';

export interface CreateUserInput {
  nickname: string;
  name: string;
  email: string;
  password: string;
  roles: UserRole[];
  createdBy: string;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject(USER_REPOSITORY) private readonly repository: UserRepository,
    private readonly unitOfWork: UnitOfWork,
    private readonly configService: ConfigService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findByEmail(email.toLowerCase());
  }

  async findByNickname(nickname: string): Promise<User | null> {
    return this.repository.findByNickname(nickname.toLowerCase());
  }

  async ensureAdminSeed(): Promise<User> {
    const nickname = this.configService
      .get<string>('auth.adminNickname', 'aivacol')
      .toLowerCase();
    const existing = await this.findByNickname(nickname);
    if (existing) {
      return existing;
    }

    const defaultPassword = this.configService.get<string>(
      'auth.adminPassword',
      'aivacol123!',
    );
    const salted = await bcrypt.hash(defaultPassword, 10);

    const adminUser = User.create({
      nickname,
      name: this.configService.get<string>('auth.adminName', 'Aivacol Admin'),
      email: this.configService
        .get<string>('auth.adminEmail', 'aivacol@fleetcore.local')
        .toLowerCase(),
      passwordHash: salted,
      roles: [UserRole.Admin],
      createdBy: 'system',
    });

    this.logger.log(`Seeding admin user "${nickname}"`);

    return this.unitOfWork.execute(async (manager) => {
      const scopedRepository = this.getScopedRepository(manager);
      return scopedRepository.save(adminUser);
    });
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const email = input.email.toLowerCase();
    const nickname = input.nickname.toLowerCase();

    const [byEmail, byNickname] = await Promise.all([
      this.repository.findByEmail(email),
      this.repository.findByNickname(nickname),
    ]);

    if (byEmail) {
      throw new ConflictException('Email already in use');
    }

    if (byNickname) {
      throw new ConflictException('Nickname already in use');
    }

    const hashed = await bcrypt.hash(input.password, 10);
    const user = User.create({
      nickname,
      name: input.name,
      email,
      passwordHash: hashed,
      roles: input.roles,
      createdBy: input.createdBy,
    });

    return this.unitOfWork.execute(async (manager) => {
      const scopedRepository = this.getScopedRepository(manager);
      return scopedRepository.save(user);
    });
  }

  private getScopedRepository(manager: EntityManager): UserRepository {
    return UserTypeOrmRepository.create(manager.getRepository(UserOrmEntity));
  }
}
