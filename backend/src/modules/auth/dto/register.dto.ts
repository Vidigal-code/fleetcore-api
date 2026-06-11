import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import {
  STRONG_PASSWORD_MESSAGE,
  STRONG_PASSWORD_REGEX,
} from '../auth.constants';

export class RegisterDto {
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
    description: 'E-mail válido. / Valid email.',
    example: 'joao.oliveira@fleetcore.local',
    maxLength: 255,
  })
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty({
    description:
      'Senha forte: maiúscula, minúscula, número e símbolo. / Strong password: upper, lower, number and symbol.',
    example: 'Fleetcore123!',
    format: 'password',
  })
  @IsString()
  @Matches(STRONG_PASSWORD_REGEX, {
    message: STRONG_PASSWORD_MESSAGE,
  })
  password!: string;
}
