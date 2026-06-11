import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class QueryVehiclesDto {
  @ApiPropertyOptional({
    description:
      'Filtra pela placa (correspondência parcial). / Filter by license plate (partial match).',
    example: 'BRA',
  })
  @IsOptional()
  @IsString()
  licensePlate?: string;

  @ApiPropertyOptional({
    description: 'Filtra pelo modelo (UUID). / Filter by model (UUID).',
    example: 'a3f1c2d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  modelId?: string;

  @ApiPropertyOptional({
    description: 'Filtra pela marca (UUID). / Filter by brand (UUID).',
    example: 'b2c3d4e5-6f70-4812-9a3b-4c5d6e7f8a9b',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  brandId?: string;

  @ApiPropertyOptional({
    description: 'Número da página. / Page number.',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({
    description: 'Itens por página. / Items per page.',
    example: 20,
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit = 20;
}
