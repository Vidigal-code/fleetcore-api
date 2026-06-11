import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateModelDto {
  @ApiProperty({
    description: 'Nome do modelo. / Model name.',
    example: 'MegaBus Horizon',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    description:
      'Identificador da marca associada (UUID, opcional). / Associated brand identifier (UUID, optional).',
    example: 'b2c3d4e5-6f70-4812-9a3b-4c5d6e7f8a9b',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  brandId?: string;
}
