import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  ApiAuthErrors,
  ApiCreated,
  ApiOk,
  ApiTraceHeaders,
} from '../../../../apps/api/swagger/api-docs.decorators';

import { UsersService } from '../../../users/application/users.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import type { JwtPayload } from '../../domain/jwt-payload.interface';
import { AuthService } from '../../application/auth.service';
import { LoginDto } from '../../dto/login.dto';
import { RegisterDto } from '../../dto/register.dto';
import { UpdatePasswordDto } from '../../dto/update-password.dto';
import { UpdateProfileDto } from '../../dto/update-profile.dto';
import { Public } from '../../decorators/public.decorator';
import { AuthRateLimit } from '../../../../apps/api/security/rate-limit.decorator';

@ApiTags('Authentication')
@ApiAuthErrors()
@ApiTraceHeaders()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @AuthRateLimit()
  @Post('login')
  @ApiOperation({
    summary: 'Autenticar e emitir token JWT / Authenticate and issue JWT token',
  })
  @ApiOk(
    'Token JWT, tipo, expiração e dados do usuário.',
    'JWT token, type, expiration and user data.',
  )
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Perfil do usuário autenticado / Current authenticated user profile',
  })
  @ApiOk('Dados do usuário autenticado.', 'Authenticated user data.')
  async me(@CurrentUser() user: JwtPayload | undefined) {
    if (!user) {
      throw new NotFoundException('User context not found');
    }
    const found = await this.usersService.findByEmail(user.email);
    if (!found) {
      throw new NotFoundException('User not found');
    }
    return {
      id: found.id,
      nickname: found.nickname,
      name: found.name,
      email: found.email,
      roles: found.roles,
    };
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário / Register a new user' })
  @ApiCreated('Usuário criado.', 'User created.')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update/password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar senha / Update current user password' })
  @ApiOk('Senha atualizada.', 'Password updated.')
  async updatePassword(
    @CurrentUser() user: JwtPayload | undefined,
    @Body() dto: UpdatePasswordDto,
  ) {
    if (!user) {
      throw new UnauthorizedException('User context not found');
    }

    return this.authService.updatePassword(user.sub, user.sessionId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update/profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar perfil / Update current user profile' })
  @ApiOk('Perfil atualizado.', 'Profile updated.')
  async updateProfile(
    @CurrentUser() user: JwtPayload | undefined,
    @Body() dto: UpdateProfileDto,
  ) {
    if (!user) {
      throw new UnauthorizedException('User context not found');
    }

    return this.authService.updateProfile(user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Encerrar sessão / Invalidate current session' })
  @ApiOk('Sessão encerrada.', 'Session invalidated.')
  async logout(@CurrentUser() user: JwtPayload | undefined) {
    if (!user?.sessionId) {
      throw new UnauthorizedException('Invalid session context');
    }

    await this.authService.logout(user.sessionId);
    return { success: true };
  }
}
