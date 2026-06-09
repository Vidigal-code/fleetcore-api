import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../../users/application/users.service';
import { User } from '../../users/domain/user.aggregate';
import { LoginDto } from '../dto/login.dto';
import { JwtPayload } from '../domain/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(credentials: LoginDto) {
    const user = await this.validateUser(
      credentials.identifier,
      credentials.password,
    );
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      nickname: user.nickname,
    };

    const expiresIn = this.configService.get<string>('jwt.expiresIn', '3600s');
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
      user: {
        id: user.id,
        nickname: user.nickname,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
    };
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
}
