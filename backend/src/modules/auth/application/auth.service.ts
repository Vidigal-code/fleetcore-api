import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import {
  UpdateProfileInput,
  UsersService,
} from '../../users/application/users.service';
import { User } from '../../users/domain/user.aggregate';
import { UserRole } from '../../users/domain/user-role.enum';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { JwtPayload } from '../domain/jwt-payload.interface';
import { AuthSessionService } from './auth-session.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authSessionService: AuthSessionService,
  ) {}

  async login(credentials: LoginDto) {
    const user = await this.validateUser(
      credentials.identifier,
      credentials.password,
    );
    const sessionId = this.authSessionService.generateSessionId();
    const payload = this.buildPayload(user, sessionId);

    const accessToken = await this.jwtService.signAsync(payload, {
      jwtid: sessionId,
    });

    await this.authSessionService.store(sessionId, user.id);

    return this.buildAuthResponse(accessToken, this.getTokenExpiration(), user);
  }

  async register(input: RegisterDto) {
    const user = await this.usersService.createUser({
      nickname: input.nickname,
      name: input.name,
      email: input.email,
      password: input.password,
      roles: [UserRole.Admin],
      createdBy: input.nickname,
    });

    return this.mapUser(user);
  }

  async updatePassword(
    userId: string,
    sessionId: string | undefined,
    dto: UpdatePasswordDto,
  ) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isOldPasswordValid = await bcrypt.compare(
      dto.oldPassword,
      user.passwordHash,
    );
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Invalid current password');
    }

    const isSamePassword = await bcrypt.compare(
      dto.newPassword,
      user.passwordHash,
    );
    if (isSamePassword) {
      throw new BadRequestException(
        'New password must be different from the current password',
      );
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.usersService.updatePassword({ userId, passwordHash });

    if (sessionId) {
      await this.authSessionService.revoke(sessionId);
    }

    return { success: true };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload: UpdateProfileInput = {
      userId,
      name: dto.name,
      nickname: dto.nickname,
      email: dto.email,
    };

    const updated = await this.usersService.updateProfile(payload);
    return this.mapUser(updated);
  }

  async logout(sessionId: string): Promise<void> {
    await this.authSessionService.revoke(sessionId);
  }

  async validateUser(identifier: string, password: string): Promise<User> {
    const user = await this.findByIdentifier(identifier);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  private async findByIdentifier(identifier: string) {
    const byEmail = await this.usersService.findByEmail(
      identifier.toLowerCase(),
    );
    if (byEmail) {
      return byEmail;
    }
    return this.usersService.findByNickname(identifier);
  }

  private buildPayload(user: User, sessionId: string): JwtPayload {
    return {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      nickname: user.nickname,
      sessionId,
    };
  }

  private getTokenExpiration(): string {
    return this.configService.get<string>('jwt.expiresIn', '3600s');
  }

  private mapUser(user: User) {
    return {
      id: user.id,
      nickname: user.nickname,
      name: user.name,
      email: user.email,
      roles: user.roles,
    };
  }

  private buildAuthResponse(
    accessToken: string,
    expiresIn: string,
    user: User,
  ) {
    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
      user: this.mapUser(user),
    };
  }
}
