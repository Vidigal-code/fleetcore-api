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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../../../auth/decorators/current-user.decorator';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { UserRole } from '../../../users/domain/user-role.enum';
import type { JwtPayload } from '../../../auth/domain/jwt-payload.interface';
import { resolveActor } from '../../../auth/utils/actor.util';
import { VehiclesService } from '../../application/vehicles.service';
import { CreateVehicleDto } from '../../dto/create-vehicle.dto';
import { QueryVehiclesDto } from '../../dto/query-vehicles.dto';
import { UpdateVehicleDto } from '../../dto/update-vehicle.dto';
import { toVehicleResponse } from './presenters/vehicle.presenter';

@ApiTags('Fleet')
@ApiBearerAuth()
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  @ApiOperation({ summary: 'Buscar veículos / Search vehicles' })
  async search(@Query() query: QueryVehiclesDto) {
    const result = await this.vehiclesService.search(query);
    return {
      ...result,
      items: result.items.map(toVehicleResponse),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar veículo por ID / Retrieve vehicle by id' })
  async find(@Param('id') id: string) {
    const vehicle = await this.vehiclesService.findById(id);
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    return toVehicleResponse(vehicle);
  }

  @Roles(UserRole.Admin)
  @Post()
  @ApiOperation({ summary: 'Cadastrar veículo / Create vehicle' })
  async create(@Body() dto: CreateVehicleDto, @CurrentUser() user: JwtPayload) {
    const vehicle = await this.vehiclesService.create(dto, resolveActor(user));
    return toVehicleResponse(vehicle);
  }

  @Roles(UserRole.Admin)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar veículo / Update vehicle' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateVehicleDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const vehicle = await this.vehiclesService.update(
      id,
      dto,
      resolveActor(user),
    );
    return toVehicleResponse(vehicle);
  }

  @Roles(UserRole.Admin)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover veículo / Delete vehicle' })
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.vehiclesService.remove(id, resolveActor(user));
  }
}
