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
  ApiParam,
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
import {
  ApiCreated,
  ApiOk,
  ApiProtectedErrors,
  ApiResourceNotFound,
} from '../../../../apps/api/swagger/api-docs.decorators';

const MODEL_ID_PARAM = {
  name: 'id',
  description: 'Identificador do modelo (UUID). / Model identifier (UUID).',
  format: 'uuid',
} as const;

@ApiTags('Fleet')
@ApiBearerAuth()
@ApiProtectedErrors()
@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar modelos / List models' })
  @ApiQuery({
    name: 'brandId',
    required: false,
    description:
      'Filtra modelos pela marca (UUID). / Filter models by brand identifier (UUID).',
    example: 'b2c3d4e5-6f70-4812-9a3b-4c5d6e7f8a9b',
  })
  @ApiOk('Lista de modelos.', 'List of models.')
  async list(@Query('brandId') brandId?: string) {
    const models = brandId
      ? await this.modelsService.listByBrand(brandId)
      : await this.modelsService.list();

    return models.map(toModelResponse);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar modelo por ID / Retrieve model by id' })
  @ApiParam(MODEL_ID_PARAM)
  @ApiOk('Modelo encontrado.', 'Model found.')
  @ApiResourceNotFound('Modelo', 'Model')
  async find(@Param('id') id: string) {
    const model = await this.modelsService.findById(id);
    if (!model) {
      throw new NotFoundException('Model not found');
    }
    return toModelResponse(model);
  }

  @Roles(UserRole.Admin)
  @Post()
  @ApiOperation({ summary: 'Cadastrar modelo / Create model' })
  @ApiCreated('Modelo criado.', 'Model created.')
  async create(@Body() dto: CreateModelDto, @CurrentUser() user: JwtPayload) {
    const model = await this.modelsService.create(dto, resolveActor(user));
    return toModelResponse(model);
  }

  @Roles(UserRole.Admin)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar modelo / Update model' })
  @ApiParam(MODEL_ID_PARAM)
  @ApiOk('Modelo atualizado.', 'Model updated.')
  @ApiResourceNotFound('Modelo', 'Model')
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
  @ApiOperation({ summary: 'Remover modelo / Delete model' })
  @ApiParam(MODEL_ID_PARAM)
  @ApiOk('Modelo removido.', 'Model removed.')
  @ApiResourceNotFound('Modelo', 'Model')
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.modelsService.remove(id, resolveActor(user));
  }
}
