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

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and issue JWT token.' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Return the current authenticated user profile.' })
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
  @ApiOperation({ summary: 'Register a new user account.' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update/password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the current user password.' })
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
  @ApiOperation({ summary: 'Update the current user profile.' })
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
  @ApiOperation({ summary: 'Invalidate the current session.' })
  async logout(@CurrentUser() user: JwtPayload | undefined) {
    if (!user?.sessionId) {
      throw new UnauthorizedException('Invalid session context');
    }

    await this.authService.logout(user.sessionId);
    return { success: true };
  }
}
