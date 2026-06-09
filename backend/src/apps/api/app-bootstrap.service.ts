import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { UsersService } from '../../modules/users/application/users.service';

@Injectable()
export class AppBootstrapService implements OnModuleInit {
  private readonly logger = new Logger(AppBootstrapService.name);

  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    const admin = await this.usersService.ensureAdminSeed();
    this.logger.log(`Admin user ready: ${admin.nickname}`);
  }
}
