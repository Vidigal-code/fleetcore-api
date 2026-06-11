import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

import {
  STRONG_PASSWORD_MESSAGE,
  STRONG_PASSWORD_REGEX,
} from '../auth.constants';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'Senha atual. / Current password.',
    example: 'aivacol123!',
    format: 'password',
  })
  @IsString()
  oldPassword!: string;

  @ApiProperty({
    description: 'Nova senha forte. / New strong password.',
    example: 'Fleetcore123!',
    format: 'password',
  })
  @IsString()
  @Matches(STRONG_PASSWORD_REGEX, {
    message: STRONG_PASSWORD_MESSAGE,
  })
  newPassword!: string;
}
