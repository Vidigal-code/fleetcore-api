import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EntityManager } from 'typeorm';
import * as bcrypt from 'bcryptjs';

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

export interface UpdateProfileInput {
  userId: string;
  name: string;
  nickname: string;
  email?: string;
}

export interface UpdatePasswordInput {
  userId: string;
  passwordHash: string;
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

  async findById(id: string): Promise<User | null> {
    return this.repository.findById(id);
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

  async updateProfile(input: UpdateProfileInput): Promise<User> {
    const nickname = input.nickname.toLowerCase();
    const email = input.email ? input.email.toLowerCase() : undefined;

    return this.unitOfWork.execute(async (manager) => {
      const scopedRepository = this.getScopedRepository(manager);
      const user = await scopedRepository.findById(input.userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const existingByEmail =
        email && email !== user.email
          ? await scopedRepository.findByEmail(email)
          : null;
      const existingByNickname =
        nickname !== user.nickname
          ? await scopedRepository.findByNickname(nickname)
          : null;

      if (existingByEmail && existingByEmail.id !== user.id) {
        throw new ConflictException('Email already in use');
      }

      if (existingByNickname && existingByNickname.id !== user.id) {
        throw new ConflictException('Nickname already in use');
      }

      const targetEmail = email ?? user.email;
      user.updateProfile(input.name, nickname, targetEmail);
      return scopedRepository.save(user);
    });
  }

  async updatePassword(input: UpdatePasswordInput): Promise<User> {
    return this.unitOfWork.execute(async (manager) => {
      const scopedRepository = this.getScopedRepository(manager);
      const user = await scopedRepository.findById(input.userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.updatePassword(input.passwordHash);
      return scopedRepository.save(user);
    });
  }

  private getScopedRepository(manager: EntityManager): UserRepository {
    return UserTypeOrmRepository.create(manager.getRepository(UserOrmEntity));
  }
}
