import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../../../auth/decorators/current-user.decorator';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { UserRole } from '../../../users/domain/user-role.enum';
import type { JwtPayload } from '../../../auth/domain/jwt-payload.interface';
import { resolveActor } from '../../../auth/utils/actor.util';
import { ModelsService } from '../../application/models.service';
import { CreateModelDto } from '../../dto/create-model.dto';
import { UpdateModelDto } from '../../dto/update-model.dto';
import { toModelResponse } from './presenters/model.presenter';

@ApiTags('Fleet')
@ApiBearerAuth()
@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get()
  @ApiOperation({ summary: 'List Models' })
  @ApiQuery({
    name: 'brandId',
    required: false,
    description: 'Filter models by brand identifier.',
  })
  async list(@Query('brandId') brandId?: string) {
    const models = brandId
      ? await this.modelsService.listByBrand(brandId)
      : await this.modelsService.list();

    return models.map(toModelResponse);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve Model by id' })
  async find(@Param('id') id: string) {
    const model = await this.modelsService.findById(id);
    if (!model) {
      throw new NotFoundException('Model not found');
    }
    return toModelResponse(model);
  }

  @Roles(UserRole.Admin)
  @Post()
  @ApiOperation({ summary: 'Create Model' })
  async create(@Body() dto: CreateModelDto, @CurrentUser() user: JwtPayload) {
    const model = await this.modelsService.create(dto, resolveActor(user));
    return toModelResponse(model);
  }

  @Roles(UserRole.Admin)
  @Patch(':id')
  @ApiOperation({ summary: 'Update Model' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateModelDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const model = await this.modelsService.update(id, dto, resolveActor(user));
    return toModelResponse(model);
  }

  @Roles(UserRole.Admin)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Model' })
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.modelsService.remove(id, resolveActor(user));
  }
}
