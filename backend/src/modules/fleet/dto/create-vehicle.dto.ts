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
  @IsString()
  @IsNotEmpty()
  @Matches(LICENSE_PLATE_REGEX, {
    message: 'licensePlate must follow Mercosul pattern',
  })
  licensePlate!: string;

  @IsString()
  @IsNotEmpty()
  chassis!: string;

  @IsString()
  @IsNotEmpty()
  renavam!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(VEHICLE_YEAR_MIN)
  @Max(VEHICLE_YEAR_MAX)
  year!: number;

  @IsUUID()
  modelId!: string;
}
