import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Matches,
  Max,
  Min,
} from 'class-validator';

import {
  LICENSE_PLATE_REGEX,
  VEHICLE_YEAR_MAX,
  VEHICLE_YEAR_MIN,
} from '../../../shared/validation/fleet.schema';

export class CreateVehicleDto {
  @ApiProperty({
    description: 'Placa no padrão Mercosul. / Mercosul license plate.',
    example: 'BRA1A23',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(LICENSE_PLATE_REGEX, {
    message: 'licensePlate must follow Mercosul pattern',
  })
  licensePlate!: string;

  @ApiProperty({
    description: 'Número do chassi. / Chassis number.',
    example: '9BG116GW04C400001',
  })
  @IsString()
  @IsNotEmpty()
  chassis!: string;

  @ApiProperty({
    description: 'Código Renavam. / Renavam code.',
    example: '12345678901',
  })
  @IsString()
  @IsNotEmpty()
  renavam!: string;

  @ApiProperty({
    description: 'Ano de fabricação. / Manufacturing year.',
    example: 2024,
    minimum: VEHICLE_YEAR_MIN,
    maximum: VEHICLE_YEAR_MAX,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(VEHICLE_YEAR_MIN)
  @Max(VEHICLE_YEAR_MAX)
  year!: number;

  @ApiProperty({
    description: 'Identificador do modelo (UUID). / Model identifier (UUID).',
    example: 'a3f1c2d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
    format: 'uuid',
  })
  @IsUUID()
  modelId!: string;
}
