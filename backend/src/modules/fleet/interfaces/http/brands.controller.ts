import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../../../auth/decorators/current-user.decorator';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { UserRole } from '../../../users/domain/user-role.enum';
import type { JwtPayload } from '../../../auth/domain/jwt-payload.interface';
import { BrandsService } from '../../application/brands.service';
import { CreateBrandDto } from '../../dto/create-brand.dto';
import { UpdateBrandDto } from '../../dto/update-brand.dto';
import { toBrandResponse } from './presenters/brand.presenter';
import { resolveActor } from '../../../auth/utils/actor.util';

@ApiTags('Fleet')
@ApiBearerAuth()
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  @ApiOperation({ summary: 'List Brands' })
  async list() {
    const brands = await this.brandsService.list();
    return brands.map(toBrandResponse);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve Brand by id' })
  async find(@Param('id') id: string) {
    const brand = await this.brandsService.findById(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return toBrandResponse(brand);
  }

  @Roles(UserRole.Admin)
  @Post()
  @ApiOperation({ summary: 'Create Brand' })
  async create(@Body() dto: CreateBrandDto, @CurrentUser() user: JwtPayload) {
    const brand = await this.brandsService.create(dto, resolveActor(user));
    return toBrandResponse(brand);
  }

  @Roles(UserRole.Admin)
  @Patch(':id')
  @ApiOperation({ summary: 'Update Brand' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBrandDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const brand = await this.brandsService.update(id, dto, resolveActor(user));
    return toBrandResponse(brand);
  }

  @Roles(UserRole.Admin)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Brand' })
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.brandsService.remove(id, resolveActor(user));
  }
}
