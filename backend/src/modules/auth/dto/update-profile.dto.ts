import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'Nome completo. / Full name.',
    example: 'João Oliveira',
    minLength: 3,
    maxLength: 120,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  name!: string;

  @ApiProperty({
    description: 'Apelido único do usuário. / Unique user nickname.',
    example: 'joliveira',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  nickname!: string;

  @ApiPropertyOptional({
    description: 'E-mail válido (opcional). / Valid email (optional).',
    example: 'joao.oliveira@fleetcore.local',
    maxLength: 255,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;
}
