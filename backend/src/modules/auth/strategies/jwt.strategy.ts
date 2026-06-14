import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../domain/jwt-payload.interface';
import { AuthSessionService } from '../application/auth-session.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authSessionService: AuthSessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    if (!payload.sessionId) {
      throw new UnauthorizedException('Session metadata missing');
    }

    const active = await this.authSessionService.isActive(payload.sessionId);
    if (!active) {
      throw new UnauthorizedException('Session expired or revoked');
    }

    const locked = await this.authSessionService.isLocked(payload.sessionId);
    if (locked) {
      throw new UnauthorizedException('Session is locked');
    }

    await this.authSessionService.refresh(payload.sessionId);

    return payload;
  }
}
