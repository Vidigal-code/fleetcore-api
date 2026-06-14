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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../../../auth/decorators/current-user.decorator';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { UserRole } from '../../../users/domain/user-role.enum';
import type { JwtPayload } from '../../../auth/domain/jwt-payload.interface';
import { BrandsService } from '../../application/brands.service';
import { CreateBrandDto } from '../../dto/create-brand.dto';
import { UpdateBrandDto } from '../../dto/update-brand.dto';
import { toBrandResponse } from './presenters/brand.presenter';
import { resolveActor } from '../../../auth/utils/actor.util';
import {
  ApiCreated,
  ApiOk,
  ApiProtectedErrors,
  ApiResourceNotFound,
  ApiTraceHeaders,
} from '../../../../apps/api/swagger/api-docs.decorators';

const BRAND_ID_PARAM = {
  name: 'id',
  description: 'Identificador da marca (UUID). / Brand identifier (UUID).',
  format: 'uuid',
} as const;

@ApiTags('Fleet')
@ApiBearerAuth()
@ApiProtectedErrors()
@ApiTraceHeaders()
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar marcas / List brands' })
  @ApiOk('Lista de marcas.', 'List of brands.')
  async list() {
    const brands = await this.brandsService.list();
    return brands.map(toBrandResponse);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar marca por ID / Retrieve brand by id' })
  @ApiParam(BRAND_ID_PARAM)
  @ApiOk('Marca encontrada.', 'Brand found.')
  @ApiResourceNotFound('Marca', 'Brand')
  async find(@Param('id') id: string) {
    const brand = await this.brandsService.findById(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return toBrandResponse(brand);
  }

  @Roles(UserRole.Admin)
  @Post()
  @ApiOperation({ summary: 'Cadastrar marca / Create brand' })
  @ApiCreated('Marca criada.', 'Brand created.')
  async create(@Body() dto: CreateBrandDto, @CurrentUser() user: JwtPayload) {
    const brand = await this.brandsService.create(dto, resolveActor(user));
    return toBrandResponse(brand);
  }

  @Roles(UserRole.Admin)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar marca / Update brand' })
  @ApiParam(BRAND_ID_PARAM)
  @ApiOk('Marca atualizada.', 'Brand updated.')
  @ApiResourceNotFound('Marca', 'Brand')
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
  @ApiOperation({ summary: 'Remover marca / Delete brand' })
  @ApiParam(BRAND_ID_PARAM)
  @ApiOk('Marca removida.', 'Brand removed.')
  @ApiResourceNotFound('Marca', 'Brand')
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.brandsService.remove(id, resolveActor(user));
  }
}
