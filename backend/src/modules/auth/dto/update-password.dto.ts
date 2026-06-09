import { IsString, Matches } from 'class-validator';

import {
  STRONG_PASSWORD_MESSAGE,
  STRONG_PASSWORD_REGEX,
} from '../auth.constants';

export class UpdatePasswordDto {
  @IsString()
  oldPassword!: string;

  @IsString()
  @Matches(STRONG_PASSWORD_REGEX, {
    message: STRONG_PASSWORD_MESSAGE,
  })
  newPassword!: string;
}
