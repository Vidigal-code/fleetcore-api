import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersService } from './application/users.service';
import { USER_REPOSITORY } from './users.constants';
import { UserRepository } from './domain/user.repository';
import { UserTypeOrmRepository } from './infrastructure/repositories/user.typeorm.repository';
import { UserOrmEntity } from './infrastructure/entities/user.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  providers: [
    UsersService,
    {
      provide: USER_REPOSITORY,
      useFactory: (repository: Repository<UserOrmEntity>): UserRepository =>
        UserTypeOrmRepository.create(repository),
      inject: [getRepositoryToken(UserOrmEntity)],
    },
  ],
  exports: [UsersService, USER_REPOSITORY],
})
export class UsersModule {}
